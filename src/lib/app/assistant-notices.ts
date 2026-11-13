import { create } from "zustand";
import type { MessageKey } from "@/lib/i18n/messages";

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

/** Transient assistant messages are event-driven and never create a persistent control. */
export const useAssistantNotices = create<AssistantNoticeState>((set) => ({
  notice: null,
  publish: (message) => set({ notice: { id: ++nextNoticeId, message } }),
  dismiss: () => set({ notice: null }),
}));
