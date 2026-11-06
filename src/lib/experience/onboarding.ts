/**
 * Onboarding foundation — minimal store. Domain steps land later.
 * Persists a single flag so the welcome experience appears once.
 */
import { create } from "zustand";

const STORAGE_KEY = "eco.onboarding.v1";

interface OnboardingState {
  hydrated: boolean;
  completed: boolean;
  /** Open the onboarding sheet (used by AppShell on first visit). */
  shouldShow: boolean;
  markCompleted: () => void;
  dismiss: () => void;
  hydrate: () => void;
}

export const useOnboarding = create<OnboardingState>((set) => ({
  hydrated: false,
  completed: false,
  shouldShow: false,
  markCompleted: () => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // Continue the first-run flow when browser storage is unavailable.
      }
    }
    set({ completed: true, shouldShow: false });
  },
  dismiss: () => set({ shouldShow: false }),
  hydrate: () => {
    if (typeof window === "undefined") return;
    let done = false;
    try {
      done = window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // Treat unavailable storage as a fresh visit; the flow remains usable.
    }
    set({ hydrated: true, completed: done, shouldShow: !done });
  },
}));
