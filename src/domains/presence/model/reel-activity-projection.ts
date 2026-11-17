import { create } from "zustand";

export type ReelActivityMode = "member" | "guest";

export interface ReelActivitySummary {
  mode: ReelActivityMode | null;
  pendingBips: number;
  activeConnections: number;
  bipsReady: boolean;
  connectionsReady: boolean;
}

interface ReelActivityProjectionState extends ReelActivitySummary {
  publishBips: (mode: ReelActivityMode, count: number) => void;
  publishConnections: (mode: ReelActivityMode, count: number) => void;
  reset: () => void;
}

const emptyProjection: ReelActivitySummary = {
  mode: null,
  pendingBips: 0,
  activeConnections: 0,
  bipsReady: false,
  connectionsReady: false,
};

function safeCount(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

/**
 * Minimal, in-memory read model shared by Réel and the communication centre.
 * It deliberately stores counts only: no presence, bip, connection or guest
 * session identifiers can cross into the global communication surface.
 */
export const useReelActivityProjection = create<ReelActivityProjectionState>((set) => ({
  ...emptyProjection,
  publishBips: (mode, count) =>
    set((state) => ({
      ...(state.mode === mode ? state : emptyProjection),
      mode,
      pendingBips: safeCount(count),
      bipsReady: true,
    })),
  publishConnections: (mode, count) =>
    set((state) => ({
      ...(state.mode === mode ? state : emptyProjection),
      mode,
      activeConnections: safeCount(count),
      connectionsReady: true,
    })),
  reset: () => set(emptyProjection),
}));

export function resetReelActivityProjection(): void {
  useReelActivityProjection.getState().reset();
}
