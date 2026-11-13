import { create } from "zustand";

const STORAGE_KEY = "vitalis.assistant.enabled";

function readInitialPreference(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

interface AssistantPreferencesState {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

/** The assistant is opt-in and remains disabled unless the person enables it. */
export const useAssistantPreferences = create<AssistantPreferencesState>((set) => ({
  enabled: readInitialPreference(),
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
