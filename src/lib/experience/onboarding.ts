import { create } from "zustand";

const STORAGE_KEY = "vitalis.onboarding.v2";

interface OnboardingState {
  hydrated: boolean;
  completed: boolean;
  shouldShow: boolean;
  step: number;
  next: () => void;
  previous: () => void;
  complete: () => void;
  dismiss: () => void;
  hydrate: () => void;
}

function persistCompletion() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // The current session must remain usable when browser storage is blocked.
  }
}

export const useOnboarding = create<OnboardingState>((set) => ({
  hydrated: false,
  completed: false,
  shouldShow: false,
  step: 0,
  next: () => set((state) => ({ step: Math.min(state.step + 1, 4) })),
  previous: () => set((state) => ({ step: Math.max(state.step - 1, 0) })),
  complete: () => {
    persistCompletion();
    set({ completed: true, shouldShow: false, step: 0 });
  },
  dismiss: () => {
    persistCompletion();
    set({ completed: true, shouldShow: false, step: 0 });
  },
  hydrate: () => {
    if (typeof window === "undefined") return;
    const smokeMode =
      import.meta.env.DEV && new URLSearchParams(window.location.search).get("__vitalis_smoke") === "1";
    if (smokeMode) {
      persistCompletion();
      set({ hydrated: true, completed: true, shouldShow: false, step: 0 });
      return;
    }
    let done = false;
    try {
      done = window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // Show onboarding when its completion state cannot be read.
    }
    set({ hydrated: true, completed: done, shouldShow: !done, step: 0 });
  },
}));
