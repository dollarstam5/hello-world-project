/**
 * Hybrid assistant: instant local answers first, then a streamed AI answer.
 * One conversation, kept on this device.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import type {
  AssistantFailure,
  AssistantMessage,
  PromotedAssistantAnswer,
} from "@eco/core-contracts";
import { listPromotedAssistantAnswers } from "@eco/core-db";
import { useI18n } from "@/lib/i18n/useI18n";
import { useNetworkStatus } from "@/lib/platform/useNetworkStatus";
import { useAuth } from "@/domains/auth";
import { searchLocalKnowledge } from "../services/localSearch.service";
import {
  AssistantStreamError,
  buildAssistantRequestMessages,
  streamAssistant,
} from "../services/assistant-stream.service";

const LEGACY_STORAGE_KEY = "eco.assistant.conversation.v1";
const STORAGE_KEY_PREFIX = "eco.assistant.conversation.v2";

export function assistantConversationStorageKey(userId: string | null): string | null {
  if (!userId) return null;
  return `${STORAGE_KEY_PREFIX}:${userId}`;
}

export interface HybridAssistantState {
  signedIn: boolean;
  authLoading: boolean;
  messages: AssistantMessage[];
  pending: boolean;
  streaming: boolean;
  failure: AssistantFailure | "offline" | null;
  send: (question: string) => Promise<void>;
  reset: () => void;
}

function persist(storageKey: string | null, messages: AssistantMessage[]) {
  if (!storageKey) return;
  try {
    localStorage.setItem(storageKey, JSON.stringify(messages.slice(-40)));
  } catch {
    /* storage full or unavailable */
  }
}

export function useHybridAssistant(): HybridAssistantState {
  const { locale } = useI18n();
  const language = locale === "en" ? "en" : "fr";
  const online = useNetworkStatus().online;
  const { session, loading: authLoading } = useAuth();
  const token = session?.access_token ?? null;
  const userId = session?.user?.id ?? null;
  const storageKey = assistantConversationStorageKey(userId);
  const route = useRouterState({ select: (state) => state.location.pathname });
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [promoted, setPromoted] = useState<PromotedAssistantAnswer[]>([]);
  const [pending, setPending] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [failure, setFailure] = useState<AssistantFailure | "offline" | null>(null);
  const busy = useRef(false);
  const activeRequest = useRef<AbortController | null>(null);
  const currentStorageKey = useRef(storageKey);
  currentStorageKey.current = storageKey;

  useEffect(() => {
    activeRequest.current?.abort();
    activeRequest.current = null;
    busy.current = false;
    setPending(false);
    setStreaming(false);
    setMessages([]);
    try {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      if (!storageKey) return;
      const saved = localStorage.getItem(storageKey);
      if (saved) setMessages(JSON.parse(saved) as AssistantMessage[]);
    } catch {
      /* ignore corrupt storage */
    }
    return () => {
      activeRequest.current?.abort();
      activeRequest.current = null;
    };
  }, [storageKey]);

  useEffect(() => {
    let active = true;
    listPromotedAssistantAnswers(language)
      .then((answers) => active && setPromoted(answers))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [language]);

  const update = useCallback(
    (next: (current: AssistantMessage[]) => AssistantMessage[]) => {
      setMessages((current) => {
        const value = next(current);
        persist(storageKey, value);
        return value;
      });
    },
    [storageKey],
  );

  const send = useCallback(
    async (raw: string) => {
      const question = raw.trim().slice(0, 600);
      if (!question || busy.current) return;
      busy.current = true;
      setFailure(null);

      const userMessage: AssistantMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: question,
      };
      const history = [...messages, userMessage];
      update(() => history);

      const local = searchLocalKnowledge(question, language, promoted);
      if (local) {
        update((c) => [
          ...c,
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
        busy.current = false;
        return;
      }
      if (!token) {
        setFailure("auth_required");
        busy.current = false;
        return;
      }

      setPending(true);
      const answerId = crypto.randomUUID();
      const controller = new AbortController();
      activeRequest.current = controller;
      try {
        await streamAssistant(
          {
            requestId: crypto.randomUUID(),
            locale: language,
            route,
            messages: buildAssistantRequestMessages(history),
          },
          (text) => {
            if (controller.signal.aborted || currentStorageKey.current !== storageKey) return;
            setPending(false);
            setStreaming(true);
            setMessages((c) => {
              const exists = c.some((m) => m.id === answerId);
              return exists
                ? c.map((m) => (m.id === answerId ? { ...m, content: text } : m))
                : [...c, { id: answerId, role: "assistant", content: text, source: "gateway" }];
            });
          },
          token,
          controller.signal,
        );
        if (!controller.signal.aborted && currentStorageKey.current === storageKey) {
          setMessages((c) => {
            persist(storageKey, c);
            return c;
          });
        }
      } catch (error) {
        if (currentStorageKey.current === storageKey) {
          setMessages((current) => {
            const next = current.filter((message) => message.id !== answerId);
            persist(storageKey, next);
            return next;
          });
        }
        if (!controller.signal.aborted && currentStorageKey.current === storageKey) {
          setFailure(error instanceof AssistantStreamError ? error.reason : "provider_error");
        }
      } finally {
        if (activeRequest.current === controller) {
          activeRequest.current = null;
          setPending(false);
          setStreaming(false);
          busy.current = false;
        }
      }
    },
    [language, messages, online, promoted, route, storageKey, token, update],
  );

  const reset = useCallback(() => {
    activeRequest.current?.abort();
    activeRequest.current = null;
    busy.current = false;
    setPending(false);
    setStreaming(false);
    update(() => []);
    setFailure(null);
  }, [update]);

  return { signedIn: !!token, authLoading, messages, pending, streaming, failure, send, reset };
}
