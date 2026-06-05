/**
 * PWA foundation — interfaces only (no service worker, no vite-plugin-pwa).
 * Concrete install/cache/sync wiring lands when the user opts in.
 */

export type PwaInstallState = "unsupported" | "available" | "installed" | "dismissed";

export interface PwaInstallPrompt {
  state: PwaInstallState;
  prompt: () => Promise<void>;
  dismiss: () => void;
}

export interface PwaSyncState {
  status: "idle" | "syncing" | "synced" | "error";
  lastSyncedAt: number | null;
}

export interface PwaCacheStrategy {
  name: string;
  describe: () => string;
}

/** Placeholder noop prompt — replaced when PWA is enabled. */
export const noopInstallPrompt: PwaInstallPrompt = {
  state: "unsupported",
  prompt: async () => {},
  dismiss: () => {},
};
