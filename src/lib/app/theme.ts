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
      ? matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      : mode;
  document.documentElement.classList.toggle("dark", effective === "dark");
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: "system",
  setMode: (mode) => {
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, mode);
    apply(mode);
    set({ mode });
  },
}));

export function initTheme() {
  if (typeof window === "undefined") return;
  const stored = (window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? "system";
  apply(stored);
  useThemeStore.setState({ mode: stored });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (useThemeStore.getState().mode === "system") apply("system");
  });
}
