import { create } from "zustand";

export type IdentityTier = "guest" | "identified" | "trusted";

interface IdentityState {
  tier: IdentityTier;
  displayName?: string;
  displayNameOwnerId?: string;
  setTier: (tier: IdentityTier) => void;
  setDisplayName: (name: string | undefined, ownerId?: string) => void;
}

export const useIdentity = create<IdentityState>((set) => ({
  tier: "guest",
  displayName: undefined,
  displayNameOwnerId: undefined,
  setTier: (tier) => set({ tier }),
  setDisplayName: (displayName, displayNameOwnerId) => set({ displayName, displayNameOwnerId }),
}));

export function hasAtLeast(current: IdentityTier, min: IdentityTier): boolean {
  const order: Record<IdentityTier, number> = { guest: 0, identified: 1, trusted: 2 };
  return order[current] >= order[min];
}
