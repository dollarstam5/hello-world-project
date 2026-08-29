/**
 * Sync input validation — pure and client-safe.
 * Shared by the server functions and the HTTP sync endpoints.
 */

import {
  SYNCED_TABLES,
  type PullRequest,
  type PushRequest,
  type SyncedTable,
} from "@eco/core-contracts";

export const MAX_PULL_LIMIT = 200;
export const MAX_PUSH_ENTRIES = 200;

export function isSyncedTable(value: unknown): value is SyncedTable {
  return typeof value === "string" && (SYNCED_TABLES as readonly string[]).includes(value);
}

export function validatePull(input: unknown): PullRequest {
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

export function validatePush(input: unknown): PushRequest {
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
