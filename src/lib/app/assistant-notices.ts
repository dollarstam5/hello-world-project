import { create } from "zustand";
import type { MessageKey } from "@/lib/i18n/messages";
import { useAssistantPreferences } from "@/lib/app/assistant-preferences";

export interface AssistantNotice {
  id: number;
  message: MessageKey;
  kind: "notice" | "welcome";
}

interface AssistantNoticeState {
  notice: AssistantNotice | null;
  publish: (message: MessageKey, kind?: AssistantNotice["kind"]) => void;
  dismiss: () => void;
}

let nextNoticeId = 0;
const WELCOME_SHOWN_KEY = "vitalis.assistant.welcome-shown";
let welcomeShownInMemory = false;

/** Transient assistant messages are event-driven and never create a persistent control. */
export const useAssistantNotices = create<AssistantNoticeState>((set) => ({
  notice: null,
  publish: (message, kind = "notice") =>
    set({ notice: { id: ++nextNoticeId, message, kind } }),
  dismiss: () => set({ notice: null }),
}));

/** Publish only when enabled; the welcome is shown once after the first opt-in. */
export function dismissAssistantNotice() {
  const notice = useAssistantNotices.getState().notice;
  if (notice?.kind === "welcome") welcomeShownInMemory = false;
  useAssistantNotices.getState().dismiss();
}

export function publishAssistantNotice(message: MessageKey) {
  if (!useAssistantPreferences.getState().enabled) return;
  useAssistantNotices.getState().publish(message);
}

export function publishAssistantWelcome() {
  if (!useAssistantPreferences.getState().enabled || welcomeShownInMemory) return;
  try {
    if (typeof window !== "undefined" && window.localStorage.getItem(WELCOME_SHOWN_KEY) === "true") {
      return;
    }
  } catch {
    // The in-memory guard still prevents duplicate welcomes during this session.
  }
  welcomeShownInMemory = true;
  useAssistantNotices.getState().publish("assistant.notice.welcome", "welcome");
}

/** Persist the one-time welcome only after its notice has actually been presented. */
export function markAssistantWelcomePresented() {
  welcomeShownInMemory = true;
  try {
    if (typeof window !== "undefined") window.localStorage.setItem(WELCOME_SHOWN_KEY, "true");
  } catch {
    // The in-memory guard still prevents duplicates during this session.
  }
}
