import type { PublicFlash } from "@eco/core-contracts";

export type FlashFeedOrigin = "real" | "demo";
export type PresentedFlash = PublicFlash & { origin: FlashFeedOrigin };

const DAY_MS = 24 * 60 * 60 * 1000;
const MIN_FLASH_FEED_ITEMS = 3;

/**
 * Human, practical and privacy-safe scenarios for interface previews.
 * They use the public Flash contract but never represent live requests.
 * A supplied clock keeps the fixtures deterministic in tests.
 */
export function createDemoFlashes(now = Date.now()): PublicFlash[] {
  return [
    {
      id: "demo:flash:childcare-weekend",
      kind: "need",
      category: "home",
      title: "Je cherche une personne de confiance pour garder mes enfants ce week-end.",
      timeSlot: "this_week",
      areaLabel: "Zone d’exemple",
      createdAt: now - 3 * 60 * 60 * 1000,
      expiresAt: now + DAY_MS,
    },
    {
      id: "demo:flash:moving-urgent",
      kind: "need",
      category: "home",
      title: "J’aurais besoin d’un coup de main pour mon déménagement dans deux heures.",
      timeSlot: "today",
      areaLabel: "Zone d’exemple",
      createdAt: now - 2 * 60 * 60 * 1000,
      expiresAt: now + 2 * DAY_MS,
    },
    {
      id: "demo:flash:meeting-dishes",
      kind: "need",
      category: "home",
      title: "Après notre réunion de dimanche, vers 15 h, nous cherchons deux personnes pour aider à faire la vaisselle.",
      timeSlot: "this_week",
      areaLabel: "Dakar (exemple)",
      createdAt: now - 1 * 60 * 60 * 1000,
      expiresAt: now + DAY_MS,
    },
  ];
}

/**
 * The real feed always comes first. Examples only fill the Flash-specific
 * presentation target after real sources have finished loading.
 * This is a read-only presentation selector; it never writes to repositories.
 */
export function selectFlashFeedItems(
  realRows: PublicFlash[],
  includeDemo: boolean,
  now = Date.now(),
): PresentedFlash[] {
  const realItems = [...realRows]
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((flash) => ({ ...flash, origin: "real" as const }));

  if (!includeDemo || realItems.length >= MIN_FLASH_FEED_ITEMS) {
    return realItems;
  }

  const existingIds = new Set(realItems.map((item) => item.id));
  const missing = MIN_FLASH_FEED_ITEMS - realItems.length;
  const demoItems = createDemoFlashes(now)
    .filter((flash) => !existingIds.has(flash.id))
    .slice(0, missing)
    .map((flash) => ({ ...flash, origin: "demo" as const }));

  return [...realItems, ...demoItems];
}
