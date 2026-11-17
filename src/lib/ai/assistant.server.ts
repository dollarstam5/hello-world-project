import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { AssistantRequest, AssistantResult } from "@eco/core-contracts";
import { buildAssistantSystemPrompt } from "./assistant-personality";
import { getServerConfig } from "@/lib/config.server";
import {
  classifyAssistantQuestion,
  hasSensitiveUserContent,
  isSharedCacheAnswerEligible,
  isSharedCacheEligible,
  MAX_ASSISTANT_OUTPUT_CHARS,
  safeAssistantRoute,
} from "./assistant-policy";
import {
  claimAssistantRequest,
  completeAssistantRequest,
  failAssistantRequest,
} from "./assistant-rate-limit.server";
import {
  mapAssistantVocabulary,
  normalizeAssistantText,
} from "@/domains/assistant/services/mapping.service";

type SupabaseLike = SupabaseClient;

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function findPromoted(
  db: SupabaseLike,
  hash: string,
  locale: "fr" | "en",
  promptVersion: number,
): Promise<{
  id: string;
  answer: string;
  normalized_question: string;
  category: string;
  updated_at: string;
} | null> {
  const { data, error } = await db
    .from("ai_cache")
    .select("id, answer, normalized_question, category, updated_at")
    .eq("question_hash", hash)
    .eq("locale", locale)
    .eq("prompt_version", promptVersion)
    .eq("status", "promoted")
    .eq("is_local", true)
    .maybeSingle();
  return error ? null : data;
}

function serviceClient(): SupabaseLike | null {
  try {
    const config = getServerConfig();
    return createClient(config.supabaseUrl, config.supabaseSecretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    }) as unknown as SupabaseLike;
  } catch {
    return null;
  }
}

async function recordCandidate(input: {
  userId: string;
  hash: string;
  normalizedQuestion: string;
  answer: string;
  locale: "fr" | "en";
  promptVersion: number;
}): Promise<void> {
  const admin = serviceClient();
  if (!admin) return;
  await admin.rpc("record_ai_cache_candidate", {
    p_user_id: input.userId,
    p_question_hash: input.hash,
    p_normalized_question: input.normalizedQuestion,
    p_answer: input.answer,
    p_locale: input.locale,
    p_category: classifyAssistantQuestion(input.normalizedQuestion),
    p_prompt_version: input.promptVersion,
  });
}

async function callGateway(
  request: AssistantRequest,
  cacheHash: string | null,
): Promise<string | null> {
  const config = getServerConfig().ai;
  if (!config) return null;
  const models = [config.primaryModel, config.fallbackModel].filter(Boolean) as string[];
  const route = cacheHash ? undefined : safeAssistantRoute(request.route);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    for (const model of models) {
      try {
        const headers: Record<string, string> = {
          Authorization: `Bearer ${config.cloudflareApiToken}`,
          "Content-Type": "application/json",
          "cf-aig-gateway-id": config.gatewayId,
        };
        if (cacheHash) {
          headers["cf-aig-cache-key"] =
            `vitala:${config.promptVersion}:${request.locale}:${cacheHash}`;
          headers["cf-aig-cache-ttl"] = "86400";
        } else {
          headers["cf-aig-skip-cache"] = "true";
        }
        const response = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(config.cloudflareAccountId)}/ai/v1/chat/completions`,
          {
            method: "POST",
            headers,
            signal: controller.signal,
            body: JSON.stringify({
              model,
              temperature: 0.2,
              max_tokens: config.maxOutputTokens,
              messages: [
                { role: "system", content: buildAssistantSystemPrompt(request.locale, route) },
                ...request.messages.map(({ role, content }) => ({ role, content: content.trim() })),
              ],
            }),
          },
        );
        if (!response.ok) continue;
        const payload = (await response.json()) as {
          choices?: Array<{ message?: { content?: unknown } }>;
        };
        const content = payload.choices?.[0]?.message?.content;
        if (typeof content !== "string") continue;
        const clean = content.trim().slice(0, MAX_ASSISTANT_OUTPUT_CHARS);
        if (clean) return clean;
      } catch {
        // The next configured model is the fallback. No provider detail leaks.
      }
    }
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function runPaidAssistant(
  db: SupabaseLike,
  userId: string,
  request: AssistantRequest,
): Promise<AssistantResult> {
  const question = request.messages.at(-1)!.content.trim();
  if (hasSensitiveUserContent(request.messages)) {
    return { ok: false, reason: "unsafe_request", requestId: request.requestId };
  }

  const config = getServerConfig().ai;
  const promptVersion = config?.promptVersion ?? 1;
  const normalizedQuestion = normalizeAssistantText(question);
  const cacheEligible = request.messages.length === 1 && isSharedCacheEligible(question);
  const hash = await sha256(
    `${request.locale}:${promptVersion}:${mapAssistantVocabulary(question)}`,
  );

  if (cacheEligible) {
    const promoted = await findPromoted(db, hash, request.locale, promptVersion);
    if (promoted) {
      const updatedAt = Date.parse(promoted.updated_at);
      return {
        ok: true,
        content: promoted.answer,
        source: "promoted_cache",
        requestId: request.requestId,
        promoted: {
          id: promoted.id,
          normalizedQuestion: promoted.normalized_question,
          answer: promoted.answer,
          locale: request.locale,
          category: promoted.category,
          version: promptVersion,
          updatedAt: Number.isFinite(updatedAt) ? updatedAt : Date.now(),
        },
      };
    }
  }

  const claim = await claimAssistantRequest(db, request.requestId, request.locale);
  if (!claim.allowed) return { ok: false, reason: claim.reason, requestId: request.requestId };

  const answer = await callGateway(request, cacheEligible ? hash : null);
  if (!answer) {
    await failAssistantRequest(db, request.requestId);
    return { ok: false, reason: "unavailable", requestId: request.requestId };
  }

  await completeAssistantRequest(db, {
    requestId: request.requestId,
    source: "gateway",
    inputChars: request.messages.reduce((sum, message) => sum + message.content.length, 0),
    outputChars: answer.length,
  });
  if (cacheEligible && isSharedCacheAnswerEligible(answer)) {
    await recordCandidate({
      userId,
      hash,
      normalizedQuestion,
      answer,
      locale: request.locale,
      promptVersion,
    });
  }
  return { ok: true, content: answer, source: "gateway", requestId: request.requestId };
}
