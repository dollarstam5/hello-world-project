/**
 * Sync protocol contract — shared by the local database, the sync worker and
 * the backend endpoints. Changing anything here is a protocol change.
 */

/** Tables that participate in synchronisation. */
export const SYNCED_TABLES = [
  "users",
  "udi",
  "flashes",
  "missions",
  "posts",
  "media",
  "notifications",
  "audit",
] as const;

export type SyncedTable = (typeof SYNCED_TABLES)[number];

export type MutationKind = "create" | "update" | "delete";

/** One pending local write waiting to reach the backend. */
export interface OutboxEntry {
  id: string;
  table: SyncedTable;
  recordId: string;
  kind: MutationKind;
  /** Only the fields that actually changed — enables field-level merging. */
  patch: Record<string, unknown>;
  /** Client clock at the moment of the write. */
  mutatedAt: number;
  attempts: number;
  lastAttemptAt: number | null;
  lastError: string | null;
}

/** Per-table synchronisation cursor and health. */
export interface SyncCursor {
  table: SyncedTable;
  /** Server revision of the last successfully pulled record. */
  revision: number;
  lastPulledAt: number | null;
  lastPushedAt: number | null;
}

export type SyncPhase = "idle" | "pulling" | "pushing" | "offline" | "error";

export interface SyncState {
  phase: SyncPhase;
  pendingCount: number;
  lastSyncedAt: number | null;
  /** Plain-language message key, never a technical error string. */
  messageKey: string | null;
}

/** Push request body sent to the backend. */
export interface PushRequest {
  entries: OutboxEntry[];
}

export interface PushResult {
  /** Outbox entry ids the backend accepted; safe to drop locally. */
  accepted: string[];
  /** Entries rejected for good (validation, permission) — never retried. */
  rejected: { id: string; reason: string }[];
  /** Records the backend returns as authoritative after the merge. */
  records: SyncRecordEnvelope[];
}

/** Pull request body sent to the backend. */
export interface PullRequest {
  cursors: Pick<SyncCursor, "table" | "revision">[];
  limit: number;
}

export interface PullResult {
  records: SyncRecordEnvelope[];
  cursors: Pick<SyncCursor, "table" | "revision">[];
  /** True when more pages remain for the same cursors. */
  hasMore: boolean;
}

export interface SyncRecordEnvelope {
  table: SyncedTable;
  revision: number;
  deleted: boolean;
  data: Record<string, unknown>;
}

/** Messages exchanged with the sync worker. */
export type SyncWorkerCommand =
  | { type: "start"; accessToken: string | null }
  | { type: "stop" }
  | { type: "sync-now" }
  | { type: "token"; accessToken: string | null };

export type SyncWorkerEvent =
  | { type: "state"; state: SyncState }
  | { type: "applied"; tables: SyncedTable[] };
