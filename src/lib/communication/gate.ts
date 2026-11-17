import type { MessageKey } from "@/lib/i18n/messages";

export type CommunicationPriority = "critical" | "high" | "normal" | "low";

export interface CommunicationCandidate {
  key: MessageKey;
  priority: CommunicationPriority;
  /** Stable domain event ID. Never use temporary guest/session identifiers. */
  eventId?: string;
  /** Optional local deduplication key for one interaction/session. */
  repeatKey?: string;
}

export interface CommunicationGateState {
  deliveredEventIds?: ReadonlySet<string>;
  deliveredRepeatKeys?: ReadonlySet<string>;
}

export interface CommunicationGateResult {
  selected: CommunicationCandidate[];
  suppressed: CommunicationCandidate[];
}

const PRIORITY_WEIGHT: Record<CommunicationPriority, number> = {
  critical: 4,
  high: 3,
  normal: 2,
  low: 1,
};

/**
 * Applies deterministic priority and duplicate filtering to already-confirmed
 * domain events. It does not create events, persist history, or use a timer.
 */
export function resolveCommunicationCandidates(
  candidates: readonly CommunicationCandidate[],
  state: CommunicationGateState = {},
  maxItems = Number.POSITIVE_INFINITY,
): CommunicationGateResult {
  const deliveredEventIds = state.deliveredEventIds ?? new Set<string>();
  const deliveredRepeatKeys = state.deliveredRepeatKeys ?? new Set<string>();
  const seenEventIds = new Set<string>();
  const seenRepeatKeys = new Set<string>();

  const eligible = candidates.filter((candidate) => {
    if (candidate.eventId) {
      if (deliveredEventIds.has(candidate.eventId) || seenEventIds.has(candidate.eventId)) {
        return false;
      }
      seenEventIds.add(candidate.eventId);
    }

    if (candidate.repeatKey) {
      if (
        deliveredRepeatKeys.has(candidate.repeatKey) ||
        seenRepeatKeys.has(candidate.repeatKey)
      ) {
        return false;
      }
      seenRepeatKeys.add(candidate.repeatKey);
    }

    return true;
  });

  const ordered = eligible
    .map((candidate, index) => ({ candidate, index }))
    .sort(
      (a, b) =>
        PRIORITY_WEIGHT[b.candidate.priority] - PRIORITY_WEIGHT[a.candidate.priority] ||
        a.index - b.index,
    )
    .map(({ candidate }) => candidate);

  const safeLimit = Number.isFinite(maxItems)
    ? Math.max(0, Math.floor(maxItems))
    : ordered.length;

  return {
    selected: ordered.slice(0, safeLimit),
    suppressed: [
      ...candidates.filter((candidate) => !eligible.includes(candidate)),
      ...ordered.slice(safeLimit),
    ],
  };
}
