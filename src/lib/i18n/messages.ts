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
    "common.close": "Fermer",
    "common.soon": "Bientôt",
    "nav.home": "Accueil",
    "nav.flash": "Flash",
    "nav.radar": "Radar",
    "nav.menu": "Menu",
    "nav.open_menu": "Ouvrir le menu",
    "menu.title": "Explorer",
    "menu.subtitle": "Deux portes d'entrée vers l'écosystème.",
    "menu.espace": "Espace",
    "menu.espace.desc": "Votre lieu, vos cercles, vos respirations.",
    "menu.talents": "Talents — Savoirs Vivants",
    "menu.talents.desc": "Ce que les gens savent faire, et veulent partager.",
    "page.flash.title": "Flash",
    "page.flash.desc": "Moments éphémères. À venir.",
    "page.radar.title": "Radar",
    "page.radar.desc": "Ce qui se passe autour de vous. À venir.",
    "page.espace.title": "Espace",
    "page.espace.desc": "Votre espace personnel. À venir.",
    "page.talents.title": "Talents — Savoirs Vivants",
    "page.talents.desc": "Connaissances vivantes, échanges humains. À venir.",
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
    "common.close": "Close",
    "common.soon": "Soon",
    "nav.home": "Home",
    "nav.flash": "Flash",
    "nav.radar": "Radar",
    "nav.menu": "Menu",
    "nav.open_menu": "Open menu",
    "menu.title": "Explore",
    "menu.subtitle": "Two doorways into the ecosystem.",
    "menu.espace": "Space",
    "menu.espace.desc": "Your place, your circles, your breathing room.",
    "menu.talents": "Talents — Living Knowledge",
    "menu.talents.desc": "What people know how to do, and want to share.",
    "page.flash.title": "Flash",
    "page.flash.desc": "Ephemeral moments. Coming soon.",
    "page.radar.title": "Radar",
    "page.radar.desc": "What's happening around you. Coming soon.",
    "page.espace.title": "Space",
    "page.espace.desc": "Your personal space. Coming soon.",
    "page.talents.title": "Talents — Living Knowledge",
    "page.talents.desc": "Living knowledge, human exchanges. Coming soon.",
  },
} as const;

export type MessageKey = keyof (typeof messages)["fr"];
