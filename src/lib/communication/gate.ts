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

export interface CommunicationGateResult<
  T extends CommunicationCandidate = CommunicationCandidate,
> {
  selected: T[];
  suppressed: T[];
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
export function resolveCommunicationCandidates<T extends CommunicationCandidate>(
  candidates: readonly T[],
  state: CommunicationGateState = {},
  maxItems = Number.POSITIVE_INFINITY,
): CommunicationGateResult<T> {
  const deliveredEventIds = state.deliveredEventIds ?? new Set<string>();
  const deliveredRepeatKeys = state.deliveredRepeatKeys ?? new Set<string>();
  const seenEventIds = new Set<string>();
  const seenRepeatKeys = new Set<string>();
  const suppressed: T[] = [];

  const eligible = candidates.filter((candidate) => {
    const duplicateEvent =
      !!candidate.eventId &&
      (deliveredEventIds.has(candidate.eventId) || seenEventIds.has(candidate.eventId));
    const duplicateRepeat =
      !!candidate.repeatKey &&
      (deliveredRepeatKeys.has(candidate.repeatKey) || seenRepeatKeys.has(candidate.repeatKey));

    if (duplicateEvent || duplicateRepeat) {
      suppressed.push(candidate);
      return false;
    }

    if (candidate.eventId) seenEventIds.add(candidate.eventId);
    if (candidate.repeatKey) seenRepeatKeys.add(candidate.repeatKey);
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

  const safeLimit = Number.isFinite(maxItems) ? Math.max(0, Math.floor(maxItems)) : ordered.length;

  // Critical messages are never discarded by a presentation quota intended
  // to keep routine communication concise.
  const critical = ordered.filter((candidate) => candidate.priority === "critical");
  const remaining = ordered.filter((candidate) => candidate.priority !== "critical");
  const remainingLimit = Math.max(0, safeLimit - critical.length);
  const selected = [...critical, ...remaining.slice(0, remainingLimit)];
  const selectedSet = new Set(selected);

  return {
    selected,
    suppressed: [...suppressed, ...ordered.filter((candidate) => !selectedSet.has(candidate))],
  };
}
