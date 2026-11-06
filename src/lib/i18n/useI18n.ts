import { create } from "zustand";
import { defaultLocale, locales, messages, type Locale, type MessageKey } from "./messages";

interface I18nState {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

const STORAGE_KEY = "eco.locale";

function detectInitialLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  let stored: Locale | null = null;
  try {
    stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
  } catch {
    // Fall back to the browser language when storage is unavailable.
  }
  if (stored && locales.includes(stored)) return stored;
  const nav = window.navigator.language?.slice(0, 2);
  return (locales as readonly string[]).includes(nav) ? (nav as Locale) : defaultLocale;
}

export const useI18nStore = create<I18nState>((set) => ({
  locale: defaultLocale,
  setLocale: (locale) => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, locale);
      } catch {
        // The current session can still change language when storage is unavailable.
      }
      document.documentElement.lang = locale;
    }
    set({ locale });
  },
}));

export function initI18n() {
  if (typeof window === "undefined") return;
  const locale = detectInitialLocale();
  document.documentElement.lang = locale;
  useI18nStore.setState({ locale });
}

export function useI18n() {
  const { locale, setLocale } = useI18nStore();
  const t = (key: MessageKey): string =>
    messages[locale][key] ?? messages[defaultLocale][key] ?? key;
  return { locale, setLocale, t };
}
