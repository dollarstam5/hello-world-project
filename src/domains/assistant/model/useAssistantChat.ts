/**
 * Assistant conversation state. Owns the exchange with the assistant service;
 * the UI only renders what this hook exposes.
 */
import { useCallback, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

import { askAssistant } from "../api/assistant.functions";
import { useI18n } from "@/lib/i18n/useI18n";
import { useNetworkStatus } from "@/lib/platform/useNetworkStatus";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

type Failure = "unavailable" | "rate-limited" | "credits" | "error" | "offline";

let counter = 0;
const nextId = () => `m${++counter}`;

export function useAssistantChat() {
  const { locale, t } = useI18n();
  const net = useNetworkStatus();
  const route = useRouterState({ select: (s) => s.location.pathname });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState<Failure | null>(null);
  const busy = useRef(false);

  const send = useCallback(
    async (raw: string) => {
      const content = raw.trim();
      if (!content || busy.current) return;
      busy.current = true;
      setFailure(null);

      const history = [...messages, { id: nextId(), role: "user" as const, content }];
      setMessages(history);

      if (!net.online) {
        setFailure("offline");
        busy.current = false;
        return;
      }

      setPending(true);
      try {
        const result = await askAssistant({
          data: {
            messages: history.slice(-12).map(({ role, content: text }) => ({ role, content: text })),
            locale: locale === "en" ? "en" : "fr",
            route,
          },
        });
        if (result.ok) {
          setMessages((current) => [
            ...current,
            { id: nextId(), role: "assistant", content: result.content },
          ]);
        } else {
          setFailure(result.reason);
        }
      } catch {
        setFailure("error");
      } finally {
        setPending(false);
        busy.current = false;
      }
    },
    [locale, messages, net.online, route],
  );

  const reset = useCallback(() => {
    setMessages([]);
    setFailure(null);
  }, []);

  const failureText = failure
    ? t(
        failure === "offline"
          ? "assistant.error.offline"
          : failure === "rate-limited"
            ? "assistant.error.busy"
            : failure === "credits"
              ? "assistant.error.credits"
              : failure === "unavailable"
                ? "assistant.error.unavailable"
                : "assistant.error.generic",
      )
    : null;

  return { messages, pending, failureText, send, reset };
}
