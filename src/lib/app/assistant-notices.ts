import { create } from "zustand";
import type { MessageKey } from "@/lib/i18n/messages";
import { useAssistantPreferences } from "@/lib/app/assistant-preferences";

export interface AssistantNotice {
  id: number;
  message: MessageKey;
}

interface AssistantNoticeState {
  notice: AssistantNotice | null;
  publish: (message: MessageKey) => void;
  dismiss: () => void;
}

let nextNoticeId = 0;
const WELCOME_SHOWN_KEY = "vitalis.assistant.welcome-shown";
let welcomeShownInMemory = false;

/** Transient assistant messages are event-driven and never create a persistent control. */
export const useAssistantNotices = create<AssistantNoticeState>((set) => ({
  notice: null,
  publish: (message) => set({ notice: { id: ++nextNoticeId, message } }),
  dismiss: () => set({ notice: null }),
}));

/** Publish only when enabled; the welcome is shown once after the first opt-in. */
export function dismissAssistantNotice() {
  useAssistantNotices.getState().dismiss();
}

export function publishAssistantNotice(message: MessageKey) {
  if (!useAssistantPreferences.getState().enabled) return;
  useAssistantNotices.getState().publish(message);
}

export function publishAssistantWelcome() {
  if (!useAssistantPreferences.getState().enabled || welcomeShownInMemory) return;
  try {
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem(WELCOME_SHOWN_KEY) === "true") return;
      window.localStorage.setItem(WELCOME_SHOWN_KEY, "true");
    }
  } catch {
    // The in-memory guard still prevents duplicate welcomes during this session.
  }
  welcomeShownInMemory = true;
  publishAssistantNotice("assistant.notice.welcome");
}
