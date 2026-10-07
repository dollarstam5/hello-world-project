import type { FailedMutation, OfflineDiagnostics, OutboxEntry } from "@eco/core-contracts";

export function getOfflineDiagnostics(
  pending: readonly OutboxEntry[],
  quarantined: readonly FailedMutation[],
  now: number = Date.now(),
): OfflineDiagnostics {
  const oldestPendingAt = pending.reduce<number | null>((oldest, entry) => {
    if (!Number.isFinite(entry.mutatedAt) || entry.mutatedAt > now) {
      return oldest;
    }

    return oldest === null ? entry.mutatedAt : Math.min(oldest, entry.mutatedAt);
  }, null);

  return {
    pendingCount: pending.length,
    oldestPendingAgeMs:
      oldestPendingAt === null ? null : Math.max(0, now - oldestPendingAt),
    quarantinedCount: quarantined.length,
  };
}
