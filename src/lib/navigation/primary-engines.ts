/** Canonical destinations for the four independent first-level engines. */
export const PRIMARY_ENGINES = [
  {
    key: "reel",
    to: "/reel",
    labelKey: "nav.reel",
    titleKey: "home.engine.reel",
    descriptionKey: "home.engine.reel.desc",
  },
  {
    key: "flash",
    to: "/flash",
    labelKey: "nav.flash",
    titleKey: "home.engine.flash",
    descriptionKey: "home.engine.flash.desc",
  },
  {
    key: "scan",
    to: "/scan",
    labelKey: "nav.scan",
    titleKey: "home.engine.scan",
    descriptionKey: "home.engine.scan.desc",
  },
  {
    key: "radar",
    to: "/radar",
    labelKey: "nav.radar",
    titleKey: "home.engine.radar",
    descriptionKey: "home.engine.radar.desc",
  },
] as const;

export type PrimaryEngineKey = (typeof PRIMARY_ENGINES)[number]["key"];
