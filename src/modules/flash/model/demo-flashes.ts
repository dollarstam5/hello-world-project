import type { PublicFlash, PublicProfilePreview } from "@eco/core-contracts";

export type FlashFeedOrigin = "real" | "demo";
export type PresentedFlash = PublicFlash & { origin: FlashFeedOrigin };

const DAY_MS = 24 * 60 * 60 * 1000;
const MIN_FLASH_FEED_ITEMS = 3;

type DemoFlash = PublicFlash & { authorPreview: PublicProfilePreview };

const demoAuthors: Record<string, PublicProfilePreview> = {
  "demo:flash:childcare-weekend": {
    publicProfileId: "demo:profile:aissatou",
    displayName: "Aïssatou Ndiaye",
    avatarUrl: null,
    areaLabel: "Lieu non précisé",
    summary: "Parent, cherche une solution de garde attentive pour le week-end.",
    category: "home",
  },
  "demo:flash:moving-urgent": {
    publicProfileId: "demo:profile:ibrahima",
    displayName: "Ibrahima Sarr",
    avatarUrl: null,
    areaLabel: "Lieu non précisé",
    summary: "Prépare un déménagement et cherche un coup de main ponctuel.",
    category: "home",
  },
  "demo:flash:meeting-dishes": {
    publicProfileId: "demo:profile:mariama",
    displayName: "Mariama Fall",
    avatarUrl: null,
    areaLabel: "Dakar (exemple)",
    summary: "Participe à l’organisation d’une réunion et de son accueil.",
    category: "events",
  },
};

/** Fictional people use initials, not photos or real account information. */
export function createDemoFlashes(now = Date.now()): DemoFlash[] {
  const flashes: PublicFlash[] = [
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
      title:
        "Après notre réunion de dimanche, vers 15 h, nous cherchons deux personnes pour aider à faire la vaisselle.",
      timeSlot: "this_week",
      areaLabel: "Dakar (exemple)",
      createdAt: now - 1 * 60 * 60 * 1000,
      expiresAt: now + DAY_MS,
    },
  ];
  return flashes.map((flash) => {
    const authorPreview = demoAuthors[flash.id];
    if (!authorPreview) throw new Error(`Missing demo profile for ${flash.id}`);
    return { ...flash, authorPreview };
  });
}

/** Real items always come first; local examples only fill the missing slots. */
export function selectFlashFeedItems(
  realRows: PublicFlash[],
  includeDemo: boolean,
  now = Date.now(),
): PresentedFlash[] {
  const realItems = [...realRows]
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((flash) => ({ ...flash, origin: "real" as const }));

  if (!includeDemo || realItems.length >= MIN_FLASH_FEED_ITEMS) return realItems;

  const existingIds = new Set(realItems.map((item) => item.id));
  const missing = MIN_FLASH_FEED_ITEMS - realItems.length;
  const demoItems = createDemoFlashes(now)
    .filter((flash) => !existingIds.has(flash.id))
    .slice(0, missing)
    .map((flash) => ({ ...flash, origin: "demo" as const }));

  return [...realItems, ...demoItems];
}
