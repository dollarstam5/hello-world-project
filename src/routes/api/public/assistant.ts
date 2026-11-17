import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  claimAssistantRequest,
  completeAssistantRequest,
  failAssistantRequest,
} from "@/lib/ai/assistant-rate-limit.server";
import {
  hasSensitiveUserContent,
  safeAssistantRoute,
  validateConversation,
} from "@/lib/ai/assistant-policy";
import type { AssistantRequest } from "@eco/core-contracts";
import { buildAssistantSystemPrompt } from "@/lib/ai/assistant-personality";

/** Canonical assistant endpoint: one policy, one quota path, streamed delivery. */
const bodySchema = z.object({
  requestId: z.string().uuid(),
  locale: z.enum(["fr", "en"]).default("fr"),
  route: z.string().max(200).optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(600),
      }),
    )
    .min(1)
    .max(8),
});

function trackUsage(
  body: ReadableStream<Uint8Array>,
  db: Parameters<typeof completeAssistantRequest>[0],
  requestId: string,
  inputChars: number,
): ReadableStream<Uint8Array> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let outputChars = 0;
  let completed = false;
  let failed = false;
  let finalized = false;

  const observe = (chunk?: Uint8Array, final = false) => {
    buffer += chunk ? decoder.decode(chunk, { stream: !final }) : decoder.decode();
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    if (final && buffer.trim()) lines.push(buffer);
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload) continue;
      if (payload === "[DONE]") {
        completed = true;
        continue;
      }
      try {
        const event = JSON.parse(payload) as { type?: string; delta?: string };
        if (event.type === "response.output_text.delta" && event.delta) {
          outputChars += event.delta.length;
        } else if (event.type === "response.completed") {
          completed = true;
        } else if (event.type === "response.failed" || event.type === "error") {
          failed = true;
        }
      } catch {
        // Ignore non-JSON SSE comments and provider keep-alives.
      }
    }
  };

  const finalize = async () => {
    if (finalized) return;
    finalized = true;
    if (completed && !failed && outputChars > 0) {
      await completeAssistantRequest(db, {
        requestId,
        source: "gateway",
        inputChars,
        outputChars,
      });
    } else {
      await failAssistantRequest(db, requestId);
    }
  };

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          observe(undefined, true);
          await finalize();
          controller.close();
          return;
        }
        observe(value);
        controller.enqueue(value);
      } catch (error) {
        await failAssistantRequest(db, requestId);
        controller.error(error);
      }
    },
    async cancel(reason) {
      try {
        await reader.cancel(reason);
      } finally {
        await failAssistantRequest(db, requestId);
      }
    },
  });
}

export const Route = createFileRoute("/api/public/assistant")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { readSyncSession } = await import("@/lib/sync/session.server");
        const session = await readSyncSession(request);
        if (!session) return Response.json({ error: "auth_required" }, { status: 401 });

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return Response.json({ error: "unavailable" }, { status: 503 });

        let body: z.infer<typeof bodySchema>;
        try {
          body = bodySchema.parse(await request.json());
        } catch {
          return Response.json({ error: "invalid_request" }, { status: 400 });
        }

        const assistantRequest: AssistantRequest = {
          ...body,
          route: safeAssistantRoute(body.route),
        };
        if (validateConversation(assistantRequest)) {
          return Response.json({ error: "invalid_request" }, { status: 400 });
        }
        if (hasSensitiveUserContent(assistantRequest.messages)) {
          return Response.json({ error: "unsafe_request" }, { status: 422 });
        }

        const claim = await claimAssistantRequest(session.supabase, body.requestId, body.locale);
        if (!claim.allowed) {
          const status =
            claim.reason === "rate_limited" ? 429 : claim.reason === "daily_limit" ? 402 : 503;
          return Response.json({ error: claim.reason }, { status });
        }

        const inputChars = assistantRequest.messages.reduce(
          (total, message) => total + message.content.length,
          0,
        );
        const input = [
          {
            role: "system",
            content: buildAssistantSystemPrompt(body.locale, assistantRequest.route),
          },
          ...assistantRequest.messages,
        ];

        try {
          const upstream = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
            method: "POST",
            signal: request.signal,
            headers: {
              "Content-Type": "application/json",
              "Lovable-API-Key": apiKey,
              "X-Lovable-AIG-SDK": "fetch",
            },
            body: JSON.stringify({
              model: "openai/gpt-6-astra",
              input,
              stream: true,
              store: false,
              // A hard provider-side ceiling limits variable generation cost.
              max_output_tokens: 700,
              reasoning: { effort: "low", summary: "auto" },
            }),
          });
          if (!upstream.ok || !upstream.body) {
            await failAssistantRequest(session.supabase, body.requestId);
            const status = upstream.status === 429 ? 429 : upstream.status === 402 ? 402 : 502;
            return Response.json(
              {
                error: status === 429 ? "rate_limited" : status === 402 ? "daily_limit" : "gateway",
              },
              { status },
            );
          }
          return new Response(
            trackUsage(upstream.body, session.supabase, body.requestId, inputChars),
            {
              status: 200,
              headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-store",
                "X-Accel-Buffering": "no",
              },
            },
          );
        } catch (error) {
          await failAssistantRequest(session.supabase, body.requestId);
          if (request.signal.aborted) return new Response(null, { status: 499 });
          console.error("assistant failure", error);
          return Response.json({ error: "gateway" }, { status: 502 });
        }
      },
    },
  },
});
