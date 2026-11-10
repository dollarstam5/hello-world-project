/**
 * Flash taxonomy shared by the local database, the radar domain and the
 * public feed exposed by the backend.
 */

export const FLASH_CATEGORIES = [
  "personal",
  "professional",
  "commercial",
  "home",
  "transport",
  "food",
  "education",
  "health",
  "events",
  "other",
] as const;

export type FlashCategory = (typeof FLASH_CATEGORIES)[number];

export const FLASH_KINDS = ["offer", "need"] as const;
export type FlashKind = (typeof FLASH_KINDS)[number];

export const FLASH_TIME_SLOTS = ["now", "today", "tomorrow", "this_week"] as const;
export type FlashTimeSlot = (typeof FLASH_TIME_SLOTS)[number];

import type { PublicProfilePreview } from "./profile-preview";

/**
 * The public shape of a Flash. Author details are omitted unless the person
 * has explicitly enabled the small public profile projection. Coordinates
 * and private account data always stay on the backend.
 */

/** Public fields of a Flash; precise location and private account data stay server-side. */
export interface PublicFlash {
  id: string;
  kind: FlashKind;
  category: FlashCategory;
  title: string;
  timeSlot: FlashTimeSlot;
  areaLabel: string;
  expiresAt: number;
  createdAt: number;
  /** Present only when the author has explicitly enabled public profile visibility. */
  authorPreview?: PublicProfilePreview | null;
}
