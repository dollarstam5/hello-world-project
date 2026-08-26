import { create } from "zustand";
import type { SyncPhase, SyncState } from "@eco/core-contracts";
import type { MessageKey } from "@/lib/i18n/messages";

/**
 * Single source of truth for "is my work saved?" in the interface.
 * The sync worker pushes its state here; components only read it.
 */
interface SyncStatusStore extends SyncState {
  setState: (state: Partial<SyncState>) => void;
}

export const useSyncStatusStore = create<SyncStatusStore>((set) => ({
  phase: "idle",
  pendingCount: 0,
  lastSyncedAt: null,
  messageKey: null,
  setState: (state) => set(state),
}));

/** Plain-language message for each situation — never a technical error. */
const PHASE_MESSAGES: Record<SyncPhase, MessageKey> = {
  idle: "sync.saved",
  pulling: "sync.updating",
  pushing: "sync.sending",
  offline: "sync.offlineSaved",
  error: "sync.retrying",
};

export interface SyncStatusView {
  phase: SyncPhase;
  pendingCount: number;
  lastSyncedAt: number | null;
  /** i18n key describing the situation in human words. */
  messageKey: MessageKey;
  /** True when everything the person did is safely in the Cloud. */
  isSettled: boolean;
}

export function useSyncStatus(): SyncStatusView {
  const { phase, pendingCount, lastSyncedAt, messageKey } = useSyncStatusStore();
  const resolved = (messageKey as MessageKey | null) ?? PHASE_MESSAGES[phase];
  return {
    phase,
    pendingCount,
    lastSyncedAt,
    messageKey: pendingCount > 0 && phase !== "pushing" ? "sync.waiting" : resolved,
    isSettled: phase === "idle" && pendingCount === 0,
  };
}
