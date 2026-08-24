import type { MutationKind, OutboxEntry, SyncedTable } from "@eco/core-contracts";
import { newId } from "@eco/core-contracts";
import { getDb } from "./schema";

/**
 * The outbox is the durable queue of local writes. Every mutation goes through
 * it, so a device can work for days offline and still converge once online.
 */
export async function enqueueMutation(input: {
  table: SyncedTable;
  recordId: string;
  kind: MutationKind;
  patch: Record<string, unknown>;
  mutatedAt?: number;
}): Promise<OutboxEntry> {
  const entry: OutboxEntry = {
    id: newId<"OutboxId">(),
    table: input.table,
    recordId: input.recordId,
    kind: input.kind,
    patch: input.patch,
    mutatedAt: input.mutatedAt ?? Date.now(),
    attempts: 0,
    lastAttemptAt: null,
    lastError: null,
  };
  await getDb().outbox.put(entry);
  return entry;
}

/** Oldest pending writes first — order matters for causal consistency. */
export function readPending(limit = 50): Promise<OutboxEntry[]> {
  return getDb().outbox.orderBy("mutatedAt").limit(limit).toArray();
}

export function countPending(): Promise<number> {
  return getDb().outbox.count();
}

export async function dropAccepted(ids: readonly string[]): Promise<void> {
  if (ids.length === 0) return;
  await getDb().outbox.bulkDelete([...ids]);
}

/** Records a failed attempt so the worker can back off instead of hammering. */
export async function markAttemptFailed(id: string, reason: string): Promise<void> {
  const db = getDb();
  const entry = await db.outbox.get(id);
  if (!entry) return;
  await db.outbox.put({
    ...entry,
    attempts: entry.attempts + 1,
    lastAttemptAt: Date.now(),
    lastError: reason,
  });
}

/** Fields this device changed for a record — drives field-level merging. */
export async function locallyChangedFields(
  table: SyncedTable,
  recordId: string,
): Promise<string[]> {
  const entries = await getDb()
    .outbox.where("recordId")
    .equals(recordId)
    .filter((entry) => entry.table === table)
    .toArray();
  const fields = new Set<string>();
  for (const entry of entries) {
    for (const key of Object.keys(entry.patch)) fields.add(key);
  }
  return [...fields];
}
