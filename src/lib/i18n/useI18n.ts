import { create } from "zustand";
import { defaultLocale, locales, messages, type Locale, type MessageKey } from "./messages";

interface I18nState {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

const STORAGE_KEY = "eco.locale";
let hasExplicitLocalePreference = false;
let languageChangeListenerAttached = false;

/** Resolve browser/system language preferences against the locales Vitalis supports. */
export function resolveBrowserLocale(
  preferredLanguages: readonly string[] = [],
  fallbackLanguage?: string,
): Locale {
  for (const candidate of [...preferredLanguages, fallbackLanguage ?? ""]) {
    const language = candidate.trim().replace(/_/g, "-").split("-")[0]?.toLowerCase();
    if (language && (locales as readonly string[]).includes(language)) {
      return language as Locale;
    }
  }
  return defaultLocale;
}

function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored && (locales as readonly string[]).includes(stored) ? (stored as Locale) : null;
  } catch {
    // Storage can be unavailable in restricted/private browsing contexts.
    return null;
  }
}

function detectBrowserLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  try {
    return resolveBrowserLocale(window.navigator.languages ?? [], window.navigator.language);
  } catch {
    return defaultLocale;
  }
}

function syncWithBrowserLanguage() {
  if (hasExplicitLocalePreference || typeof window === "undefined") return;
  const locale = detectBrowserLocale();
  document.documentElement.lang = locale;
  useI18nStore.setState({ locale });
}

export const useI18nStore = create<I18nState>((set) => ({
  locale: defaultLocale,
  setLocale: (locale) => {
    hasExplicitLocalePreference = true;
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, locale);
      } catch {
        // Keep the preference active for this session even if persistence is blocked.
      }
    }
    if (typeof document !== "undefined") document.documentElement.lang = locale;
    set({ locale });
  },
}));

export function initI18n() {
  if (typeof window === "undefined") return;
  const stored = readStoredLocale();
  hasExplicitLocalePreference = stored !== null;
  const locale = stored ?? detectBrowserLocale();
  document.documentElement.lang = locale;
  useI18nStore.setState({ locale });

  // Follow later system/browser language changes only until the person chooses a language.
  if (!languageChangeListenerAttached) {
    window.addEventListener("languagechange", syncWithBrowserLanguage);
    languageChangeListenerAttached = true;
  }
}

export function useI18n() {
  const { locale, setLocale } = useI18nStore();
  const t = (key: MessageKey): string =>
    messages[locale][key] ?? messages[defaultLocale][key] ?? key;
  return { locale, setLocale, t };
}
