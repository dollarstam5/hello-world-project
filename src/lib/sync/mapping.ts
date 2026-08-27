/**
 * Sync mapping — pure, client-safe.
 *
 * Translates the offline protocol (logical table names + camelCase fields)
 * into the backend physical schema (real table names + snake_case columns).
 * No I/O here: this module is imported by both the client and the server.
 */

import type { JsonValue, SyncedTable } from "@eco/core-contracts";

/** Physical table backing each logical synced table. */
const PHYSICAL_TABLE: Record<SyncedTable, string> = {
  users: "profiles",
  udi: "udi",
  flashes: "flashes",
  missions: "missions",
  posts: "posts",
  media: "media",
  notifications: "notifications",
  audit: "audit",
};

/**
 * Column that must equal the caller's user id for a write to be legitimate.
 * `null` means the table is read-only from the client (server-written).
 */
const OWNER_COLUMN: Record<SyncedTable, string | null> = {
  users: "id",
  udi: "user_id",
  flashes: "author_id",
  missions: "author_id",
  posts: "author_id",
  media: "owner_id",
  notifications: "recipient_id",
  audit: null,
};

/** Tables the client is never allowed to push to. */
const READ_ONLY_TABLES: ReadonlySet<SyncedTable> = new Set<SyncedTable>(["audit"]);

/** Columns the client may never set — the backend owns them. */
const PROTECTED_COLUMNS: ReadonlySet<string> = new Set([
  "revision",
  "server_updated_at",
]);

export function physicalTable(table: SyncedTable): string {
  return PHYSICAL_TABLE[table];
}

export function ownerColumn(table: SyncedTable): string | null {
  return OWNER_COLUMN[table];
}

export function isReadOnlyTable(table: SyncedTable): boolean {
  return READ_ONLY_TABLES.has(table);
}

export function toSnakeCase(key: string): string {
  return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function toCamelCase(key: string): string {
  return key.replace(/_([a-z0-9])/g, (_match, letter: string) => letter.toUpperCase());
}

/** camelCase patch coming from the outbox -> snake_case row for the backend. */
export function toRow(patch: Record<string, unknown>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(patch)) {
    const column = toSnakeCase(key);
    if (PROTECTED_COLUMNS.has(column)) continue;
    row[column] = value;
  }
  return row;
}

/** snake_case row coming from the backend -> camelCase record for the client. */
export function toRecord(row: Record<string, unknown>): Record<string, JsonValue> {
  const record: Record<string, JsonValue> = {};
  for (const [key, value] of Object.entries(row)) {
    if (key === "server_updated_at") continue;
    record[toCamelCase(key)] = value as JsonValue;
  }
  return record;
}
