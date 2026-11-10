import type { PublicFlash } from "@eco/core-contracts";

export type FlashFeedOrigin = "real" | "demo";
export type PresentedFlash = PublicFlash & { origin: FlashFeedOrigin };

const DAY_MS = 24 * 60 * 60 * 1000;
const MIN_FLASH_FEED_ITEMS = 3;

/**
 * Curated, privacy-safe examples derived from the supplied SQL scenarios.
 * Source contacts, authors, raw descriptions, counters and old dates are omitted.
 * A supplied clock keeps the fixtures deterministic in tests.
 */
export function createDemoFlashes(now = Date.now()): PublicFlash[] {
  return [
    {
      id: "demo:flash:sql-besoin-002",
      kind: "need",
      category: "home",
      title: "Un plombier recherché pour une fuite d’eau",
      timeSlot: "today",
      areaLabel: "Akwa, Douala",
      createdAt: now - 3 * 60 * 60 * 1000,
      expiresAt: now + DAY_MS,
    },
    {
      id: "demo:flash:sql-besoin-009",
      kind: "need",
      category: "education",
      title: "Des cours de mathématiques recherchés",
      timeSlot: "this_week",
      areaLabel: "Messa, Yaoundé",
      createdAt: now - 2 * 60 * 60 * 1000,
      expiresAt: now + 2 * DAY_MS,
    },
    {
      id: "demo:flash:sql-besoin-017",
      kind: "need",
      category: "home",
      title: "Un coup de main pour changer une ampoule",
      timeSlot: "today",
      areaLabel: "Bonapriso, Douala",
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
