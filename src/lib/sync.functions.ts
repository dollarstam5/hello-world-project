/**
 * Sync endpoints — the only bridge between the local database and the cloud.
 *
 * The UI never calls these directly: the sync worker does. Every call runs as
 * the signed-in person, so the backend access rules (RLS) are the real
 * security boundary — these functions add validation, never privilege.
 */

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  SYNCED_TABLES,
  type PullRequest,
  type PullResult,
  type PushRequest,
  type PushResult,
  type SyncRecordEnvelope,
  type SyncedTable,
} from "@eco/core-contracts";
import {
  isReadOnlyTable,
  ownerColumn,
  physicalTable,
  toRecord,
  toRow,
} from "./sync/mapping";

const MAX_PULL_LIMIT = 200;
const MAX_PUSH_ENTRIES = 200;

type LooseClient = {
  from: (table: string) => any;
};

function isSyncedTable(value: unknown): value is SyncedTable {
  return typeof value === "string" && (SYNCED_TABLES as readonly string[]).includes(value);
}

function validatePull(input: unknown): PullRequest {
  const raw = input as Partial<PullRequest> | undefined;
  const cursors = Array.isArray(raw?.cursors) ? raw.cursors : [];
  return {
    cursors: cursors
      .filter((cursor) => isSyncedTable(cursor?.table))
      .map((cursor) => ({
        table: cursor.table,
        revision: Number.isFinite(cursor.revision) ? Math.max(0, Math.trunc(cursor.revision)) : 0,
      })),
    limit: Math.min(MAX_PULL_LIMIT, Math.max(1, Math.trunc(Number(raw?.limit ?? 100)) || 100)),
  };
}

function validatePush(input: unknown): PushRequest {
  const raw = input as Partial<PushRequest> | undefined;
  const entries = Array.isArray(raw?.entries) ? raw.entries : [];
  return {
    entries: entries
      .filter(
        (entry) =>
          entry != null &&
          typeof entry.id === "string" &&
          typeof entry.recordId === "string" &&
          isSyncedTable(entry.table) &&
          (entry.kind === "create" || entry.kind === "update" || entry.kind === "delete"),
      )
      .slice(0, MAX_PUSH_ENTRIES),
  };
}

/** Pull every change newer than the caller's cursors, table by table. */
export const pullChanges = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(validatePull)
  .handler(async ({ data, context }): Promise<PullResult> => {
    const db = context.supabase as unknown as LooseClient;
    const records: SyncRecordEnvelope[] = [];
    const cursors: PullResult["cursors"] = [];
    let hasMore = false;

    for (const cursor of data.cursors) {
      const { data: rows, error } = await db
        .from(physicalTable(cursor.table))
        .select("*")
        .gt("revision", cursor.revision)
        .order("revision", { ascending: true })
        .limit(data.limit);

      if (error) {
        // A single unreadable table must not break the whole sync pass.
        cursors.push({ table: cursor.table, revision: cursor.revision });
        continue;
      }

      const typedRows = (rows ?? []) as Record<string, unknown>[];
      let nextRevision = cursor.revision;

      for (const row of typedRows) {
        const revision = Number(row["revision"] ?? 0);
        nextRevision = Math.max(nextRevision, revision);
        records.push({
          table: cursor.table,
          revision,
          deleted: row["deleted_at"] != null,
          data: toRecord(row),
        });
      }

      if (typedRows.length === data.limit) hasMore = true;
      cursors.push({ table: cursor.table, revision: nextRevision });
    }

    return { records, cursors, hasMore };
  });

/** Push pending local writes. Rejected entries are permanent failures. */
export const pushChanges = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(validatePush)
  .handler(async ({ data, context }): Promise<PushResult> => {
    const db = context.supabase as unknown as LooseClient;
    const accepted: string[] = [];
    const rejected: PushResult["rejected"] = [];
    const records: SyncRecordEnvelope[] = [];

    for (const entry of data.entries) {
      if (isReadOnlyTable(entry.table)) {
        rejected.push({ id: entry.id, reason: "read_only_table" });
        continue;
      }

      const table = physicalTable(entry.table);
      const owner = ownerColumn(entry.table);
      const row = toRow(entry.patch ?? {});
      row["updated_at"] = entry.mutatedAt;

      if (entry.kind === "delete") {
        row["deleted_at"] = entry.mutatedAt;
      }

      let result: { data: unknown; error: { message: string } | null };

      if (entry.kind === "create") {
        row["id"] = entry.recordId;
        row["created_at"] = row["created_at"] ?? entry.mutatedAt;
        if (owner) row[owner] = context.userId;
        result = await db.from(table).upsert(row, { onConflict: "id" }).select("*").maybeSingle();
      } else {
        delete row["id"];
        if (owner) delete row[owner];
        result = await db.from(table).update(row).eq("id", entry.recordId).select("*").maybeSingle();
      }

      if (result.error) {
        rejected.push({ id: entry.id, reason: result.error.message });
        continue;
      }

      accepted.push(entry.id);

      const saved = result.data as Record<string, unknown> | null;
      if (saved) {
        records.push({
          table: entry.table,
          revision: Number(saved["revision"] ?? 0),
          deleted: saved["deleted_at"] != null,
          data: toRecord(saved),
        });
      }
    }

    return { accepted, rejected, records };
  });
