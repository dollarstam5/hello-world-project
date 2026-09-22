import { useCallback, useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import type {
  AssistantFailure,
  AssistantMessage,
  AssistantSource,
  PromotedAssistantAnswer,
} from "@eco/core-contracts";
import {
  listPromotedAssistantAnswers,
  savePromotedAssistantAnswer,
} from "@eco/core-db";
import { useI18n } from "@/lib/i18n/useI18n";
import { useNetworkStatus } from "@/lib/platform/useNetworkStatus";
import { askAssistant } from "../api/assistant.functions";
import { searchLocalKnowledge } from "../services/localSearch.service";

export interface HybridAssistantState {
  messages: AssistantMessage[];
  pending: boolean;
  failure: AssistantFailure | "offline" | null;
  send: (question: string) => Promise<void>;
  reset: () => void;
}

export function useHybridAssistant(): HybridAssistantState {
  const { locale } = useI18n();
  const language = locale === "en" ? "en" : "fr";
  const online = useNetworkStatus().online;
  const route = useRouterState({ select: (state) => state.location.pathname });
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [promoted, setPromoted] = useState<PromotedAssistantAnswer[]>([]);
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState<AssistantFailure | "offline" | null>(null);
  const busy = useRef(false);

  useEffect(() => {
    let active = true;
    listPromotedAssistantAnswers(language)
      .then((answers) => {
        if (active) setPromoted(answers);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [language]);

  const send = useCallback(async (raw: string) => {
    const question = raw.trim();
    if (!question || busy.current) return;
    busy.current = true;
    setFailure(null);

    const userMessage: AssistantMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: question.slice(0, 600),
    };
    const nextHistory = [...messages, userMessage];
    const providerHistory = [
      ...(messages.at(-1)?.role === "user" ? messages.slice(0, -1) : messages),
      userMessage,
    ];
    setMessages(nextHistory);

    const local = searchLocalKnowledge(question, language, promoted);
    if (local) {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: local.answer,
          source: local.source,
        },
      ]);
      busy.current = false;
      return;
    }

    if (!online) {
      setFailure("offline");
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: language === "fr"
            ? "Je n’ai pas encore cette réponse hors ligne. Reconnectez-vous pour que je puisse chercher davantage."
            : "I do not have this answer offline yet. Reconnect so I can look further.",
          source: "offline_fallback",
        },
      ]);
      busy.current = false;
      return;
    }

    setPending(true);
    try {
      const result = await askAssistant({
        data: {
          requestId: crypto.randomUUID(),
          locale: language,
          route,
          messages: providerHistory
            .slice(-8)
            .map(({ role, content }) => ({ role, content })),
        },
      });
      if (!result.ok) {
        setFailure(result.reason);
        return;
      }
      const source: AssistantSource = result.source;
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: result.content,
          source,
        },
      ]);
      if (result.promoted) {
        await savePromotedAssistantAnswer(result.promoted).catch(() => undefined);
        setPromoted((current) => [
          ...current.filter((item) => item.id !== result.promoted!.id),
          result.promoted!,
        ]);
      }
    } catch {
      setFailure("auth_required");
    } finally {
      setPending(false);
      busy.current = false;
    }
  }, [language, messages, online, promoted, route]);

  const reset = useCallback(() => {
    setMessages([]);
    setFailure(null);
  }, []);

  return { messages, pending, failure, send, reset };
}
