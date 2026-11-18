import type { FlashCategory, FlashKind, FlashTimeSlot } from "./flash";
import type { PublicProfilePreview } from "./profile-preview";

/** What someone is looking for around them, right now. */
export interface ScanQuery {
  text: string;
  category: FlashCategory | null;
  latitude: number;
  longitude: number;
  radiusKm: number;
  limit: number;
}

/** One public match returned by a scan, already stripped of private data. */
export interface ScanResult {
  id: string;
  kind: FlashKind;
  category: FlashCategory;
  title: string;
  timeSlot: FlashTimeSlot;
  areaLabel: string;
  distanceKm: number;
  createdAt: number;
  expiresAt: number;
  /** Optional, consent-gated public author summary. */
  authorPreview?: PublicProfilePreview | null;
  /** Source-backed matching evidence; absent means unknown, never a positive match. */
  evidence?: ScanCandidateEvidence | null;
}

/** Evidence supplied by a real source; absent evidence must remain unknown. */
export type ScanEvidenceStatus = "confirmed" | "refuted" | "unknown";
export type ScanNeedMatch = "match" | "partial" | "no_match" | "unknown";

export interface ScanCandidateEvidence {
  /** Whether source data supports the user's primary need. */
  needMatch: ScanNeedMatch;
  /** Exact normalized criteria confirmed by source data. */
  confirmedRequiredCriteria: string[];
  /** Exact normalized criteria contradicted by source data. */
  refutedRequiredCriteria: string[];
  /** Criteria the source cannot verify. */
  unknownRequiredCriteria: string[];
  /** Preferences confirmed by source data. */
  matchedPreferences: string[];
}

/** A result's qualification is separate from its relevance score. */
export type ScanMatchLevel = "exact" | "close" | "alternative" | "unverified";

export interface ScanCandidateAssessment {
  result: ScanResult;
  level: ScanMatchLevel;
  evidence: ScanCandidateEvidence;
  explanationCodes: string[];
}
