import { create } from "zustand";

export type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "eco.theme";

interface ThemeState {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
}

function apply(mode: ThemeMode) {
  if (typeof window === "undefined") return;
  const effective =
    mode === "system"
      ? matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : mode;
  // Dark-first: dark tokens live on :root. Toggle `.light` for light mode,
  // keep `.dark` as a no-op safety class so existing `dark:` variants match.
  document.documentElement.classList.toggle("light", effective === "light");
  document.documentElement.classList.toggle("dark", effective === "dark");
}

let systemPreference: MediaQueryList | null = null;

function handleSystemPreferenceChange() {
  if (useThemeStore.getState().mode === "system") {
    apply("system");
    useThemeStore.setState((state) => ({ ...state, mode: "system" }));
  }
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: "dark",
  setMode: (mode) => {
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, mode);
    apply(mode);
    set({ mode });
  },
}));

export function initTheme() {
  if (typeof window === "undefined") return;
  // Dark-first default; user can opt into light/system explicitly.
  const storedValue = window.localStorage.getItem(STORAGE_KEY);
  const stored: ThemeMode =
    storedValue === "light" || storedValue === "dark" || storedValue === "system"
      ? storedValue
      : "dark";
  apply(stored);
  useThemeStore.setState({ mode: stored });
  systemPreference?.removeEventListener("change", handleSystemPreferenceChange);
  systemPreference = window.matchMedia("(prefers-color-scheme: dark)");
  systemPreference.addEventListener("change", handleSystemPreferenceChange);
}
