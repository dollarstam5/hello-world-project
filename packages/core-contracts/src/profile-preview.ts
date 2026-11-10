import type { FlashCategory } from "./flash";

/**
 * A deliberately small public identity projection.
 * It is returned only when the profile owner has enabled public visibility.
 * Private account identifiers, contacts and precise coordinates never belong here.
 */
export interface PublicProfilePreview {
  /** Opaque public identifier, never an internal account/user ID. */
  publicProfileId: string;
  displayName: string;
  /** Only a first-party, public avatar asset; null falls back to initials. */
  avatarUrl: string | null;
  /** City or voluntarily shared broad area, never a street or coordinates. */
  areaLabel: string;
  /** Short, user-written public introduction. */
  summary: string;
  category: FlashCategory;
}
