import type { Table } from "dexie";
import type {
  BaseRecord,
  SyncCursor,
  SyncRecordEnvelope,
  SyncedTable,
} from "@eco/core-contracts";
import { mergeRecords } from "@eco/core-logic";
import { locallyChangedFields } from "./outbox";
import { getDb, type EcosystemDatabase } from "./schema";

/**
 * Applies records coming from the Cloud into the local database, preserving
 * offline edits that have not been pushed yet (field-level merge).
 * Only the sync worker calls this.
 */
export async function applyRemoteRecords(
  envelopes: readonly SyncRecordEnvelope[],
): Promise<SyncedTable[]> {
  const db = getDb();
  const touched = new Set<SyncedTable>();

  for (const envelope of envelopes) {
    const table = db[envelope.table as keyof EcosystemDatabase] as unknown as Table<
      BaseRecord,
      string
    >;
    const incoming = envelope.data as unknown as BaseRecord;
    const remote: BaseRecord = {
      ...incoming,
      revision: envelope.revision,
      deletedAt: envelope.deleted ? (incoming.deletedAt ?? Date.now()) : null,
    };

    const local = await table.get(remote.id);
    const fields = await locallyChangedFields(envelope.table, remote.id);
    await table.put(mergeRecords(local, remote, fields));
    touched.add(envelope.table);
  }

  return [...touched];
}

export async function readCursors(): Promise<SyncCursor[]> {
  return getDb().cursors.toArray();
}

export async function writeCursor(
  table: SyncedTable,
  patch: Partial<Omit<SyncCursor, "table">>,
): Promise<void> {
  const db = getDb();
  const current = (await db.cursors.get(table)) ?? {
    table,
    revision: 0,
    lastPulledAt: null,
    lastPushedAt: null,
  };
  await db.cursors.put({ ...current, ...patch });
}
