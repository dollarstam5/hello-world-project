import { create } from "zustand";

const STORAGE_KEY = "vitalis.assistant.enabled";

interface AssistantPreferencesState {
  enabled: boolean;
  hydrate: () => void;
  setEnabled: (enabled: boolean) => void;
}

/** The assistant is opt-in and remains disabled unless the person enables it. */
export const useAssistantPreferences = create<AssistantPreferencesState>((set) => ({
  enabled: false,
  hydrate: () => {
    try {
      if (typeof window === "undefined") return;
      set({ enabled: window.localStorage.getItem(STORAGE_KEY) === "true" });
    } catch {
      set({ enabled: false });
    }
  },
  setEnabled: (enabled) => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, String(enabled));
      }
    } catch {
      // Keep the preference for this session when browser storage is unavailable.
    }
    set({ enabled });
  },
}));
