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


/**
 * A candidate is a public Scan result that may be evaluated against the
 * interpreted need. It does not imply that the candidate is a confirmed match.
 */
export type ScanCandidate = ScanResult;

/**
 * Opaque continuation token. Its internal representation belongs to the
 * server and must never contain private coordinates or profile data.
 */
export type ScanSearchCursor = string;

/** Parameters for a future paged Scan request; not yet wired to the RPC. */
export interface ScanSearchPageRequest {
  /** Search criteria without the legacy one-shot result limit. */
  query: Omit<ScanQuery, "limit">;
  /** Maximum number of candidates requested in this page. */
  pageSize: number;
  cursor?: ScanSearchCursor | null;
}

/**
 * Why a search page can or cannot continue. A cursor is only returned when
 * the server can safely resume from a stable position.
 */
export type ScanSearchContinuation =
  | { status: "available"; cursor: ScanSearchCursor }
  | { status: "exhausted" }
  | { status: "budget_reached"; cursor?: ScanSearchCursor }
  | { status: "source_unavailable" };

/**
 * One bounded page of candidates. "partial" means the search did not
 * establish that all eligible candidates were examined; it is not a claim
 * that no further matches exist.
 */
export type ScanSearchPage<TCandidate = ScanCandidate> =
  | {
      items: TCandidate[];
      /** Number of source candidates examined, not the number returned. */
      examinedCount: number;
      completeness: "complete";
      continuation: { status: "exhausted" };
    }
  | {
      items: TCandidate[];
      /** Number of source candidates examined, not the number returned. */
      examinedCount: number;
      completeness: "partial";
      continuation: Exclude<ScanSearchContinuation, { status: "exhausted" }>;
    };
