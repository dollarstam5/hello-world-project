/**
 * Server-side execution of the sync protocol.
 *
 * It never elevates privileges: it always runs with a Supabase client bound to
 * the caller's session, so the access rules (RLS) are the real boundary.
 */

import type {
  PullRequest,
  PullResult,
  PushRequest,
  PushResult,
  SyncRecordEnvelope,
} from "@eco/core-contracts";
import { isReadOnlyTable, ownerColumn, physicalTable, toRecord, toRow } from "./mapping";

export type SyncClient = { from: (table: string) => any };

export async function runPull(
  db: SyncClient,
  request: PullRequest,
): Promise<PullResult> {
  const records: SyncRecordEnvelope[] = [];
  const cursors: PullResult["cursors"] = [];
  let hasMore = false;

  for (const cursor of request.cursors) {
    const { data: rows, error } = await db
      .from(physicalTable(cursor.table))
      .select("*")
      .gt("revision", cursor.revision)
      .order("revision", { ascending: true })
      .limit(request.limit);

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

    if (typedRows.length === request.limit) hasMore = true;
    cursors.push({ table: cursor.table, revision: nextRevision });
  }

  return { records, cursors, hasMore };
}

export async function runPush(
  db: SyncClient,
  request: PushRequest,
  userId: string,
): Promise<PushResult> {
  const accepted: string[] = [];
  const rejected: PushResult["rejected"] = [];
  const records: SyncRecordEnvelope[] = [];

  for (const entry of request.entries) {
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
      if (owner) row[owner] = userId;
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
}
