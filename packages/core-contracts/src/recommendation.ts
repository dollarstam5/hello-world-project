import type { RecommendationId, RecommendationReactionId, UserId } from "./ids";

/** Public contract version. Breaking shape changes require a new version. */
export const RECOMMENDATION_CONTRACT_VERSION = 1 as const;

export type RecommendationTargetType =
  | "mission"
  | "flash"
  | "opportunity"
  | "person"
  | "skill"
  | "content"
  | "action";

export type RecommendationStatus = "generated" | "available" | "expired" | "withdrawn";
export type RecommendationPriority = "low" | "normal" | "high";

/**
 * Opaque pointer only. Possessing this reference never grants access to the
 * source resource; the owning domain must authorize every read/action.
 */
export interface RecommendationTargetReference {
  readonly domain: string;
  readonly type: RecommendationTargetType;
  readonly ref: string;
}

/** Minimized, user-safe explanation. Never place private third-party signals here. */
export interface RecommendationExplanation {
  readonly summary: string;
  readonly reasonCodes: readonly string[];
}

/** Audit provenance for the authorized projection actually used. */
export interface RecommendationProvenance {
  readonly sourceDomain: string;
  readonly projectionSchemaVersion: number;
  readonly observedAt: number;
  readonly sourceUpdatedAt: number | null;
}

/**
 * Persisted recommendation owned by its recipient.
 * V1 deliberately has no score field: priority is the only exposed ordering
 * signal until a scoring formula, calibration and versioning policy are approved.
 * Timestamps are Unix milliseconds, matching the core domain records.
 */
export interface RecommendationRecord {
  readonly contractVersion: typeof RECOMMENDATION_CONTRACT_VERSION;
  readonly id: RecommendationId;
  readonly recipientId: UserId;
  readonly target: RecommendationTargetReference;
  readonly title: string;
  readonly explanation: RecommendationExplanation;
  readonly provenance: RecommendationProvenance;
  readonly priority: RecommendationPriority;
  readonly status: RecommendationStatus;
  readonly ruleVersion: string;
  readonly generatedAt: number;
  readonly availableAt: number;
  readonly expiresAt: number;
  readonly withdrawnAt: number | null;
}

/** Authorized, minimized source input. It is not a raw domain database row. */
export interface RecommendationSourceProjection<TPayload = unknown> {
  readonly contractVersion: typeof RECOMMENDATION_CONTRACT_VERSION;
  readonly sourceDomain: string;
  readonly sourceEventId: string;
  readonly projectionSchemaVersion: number;
  readonly purpose: "recommendation";
  readonly target: RecommendationTargetReference;
  readonly recipientId: UserId;
  readonly observedAt: number;
  readonly sourceUpdatedAt: number | null;
  readonly payload: TPayload;
}

/** Candidate is an in-memory generation artifact, not an API response. */
export interface RecommendationCandidate {
  readonly recipientId: UserId;
  readonly target: RecommendationTargetReference;
  readonly explanation: RecommendationExplanation;
  readonly provenance: RecommendationProvenance;
  readonly priority: RecommendationPriority;
  readonly ruleVersion: string;
  readonly availableAt: number;
  readonly expiresAt: number;
}

/** Reactions are append-only events; they do not mutate the source resource. */
export type RecommendationReactionAction =
  | "viewed"
  | "saved"
  | "accepted"
  | "dismissed"
  | "reported";

export type RecommendationReportReason =
  | "irrelevant"
  | "inaccurate"
  | "outdated"
  | "privacy_concern"
  | "other";

export interface RecommendationReaction {
  readonly id: RecommendationReactionId;
  readonly recommendationId: RecommendationId;
  readonly recipientId: UserId;
  readonly action: RecommendationReactionAction;
  readonly idempotencyKey: string;
  readonly reason: RecommendationReportReason | null;
  readonly createdAt: number;
}

/** Client commands intentionally omit recipientId; the server derives it from auth. */
export interface CreateRecommendationReactionInput {
  readonly action: RecommendationReactionAction;
  readonly idempotencyKey: string;
  readonly reason?: RecommendationReportReason;
}

export interface RecommendationListQuery {
  readonly cursor?: string;
  readonly limit?: number;
  readonly status?: "available" | "saved";
}

export interface RecommendationListResult {
  readonly items: readonly RecommendationRecord[];
  readonly nextCursor: string | null;
}
