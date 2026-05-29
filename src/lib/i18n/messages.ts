/**
 * Centralized i18n message catalog (FR / EN).
 * Foundation only — domain-specific strings will be added per module.
 * Rule: NEVER hardcode user-facing strings in components. Always go through t().
 */

export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export const messages = {
  fr: {
    "app.name": "Écosystème",
    "app.tagline": "Vivant, calme, intelligent.",
    "app.loading": "Chargement…",
    "app.offline": "Hors ligne",
    "app.online": "En ligne",
    "app.lowData": "Mode économie de données",
    "common.retry": "Réessayer",
    "common.continue": "Continuer",
    "common.cancel": "Annuler",
  },
  en: {
    "app.name": "Ecosystem",
    "app.tagline": "Alive, calm, intelligent.",
    "app.loading": "Loading…",
    "app.offline": "Offline",
    "app.online": "Online",
    "app.lowData": "Data-saver mode",
    "common.retry": "Retry",
    "common.continue": "Continue",
    "common.cancel": "Cancel",
  },
} as const;

export type MessageKey = keyof (typeof messages)["fr"];
