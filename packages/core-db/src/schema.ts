import Dexie, { type Table } from "dexie";
import type {
  AuditEntryRecord,
  FlashRecord,
  MediaRecord,
  MissionRecord,
  NotificationRecord,
  OutboxEntry,
  PostRecord,
  SyncCursor,
  SyncedTable,
  UdiRecord,
  UserRecord,
} from "@eco/core-contracts";

/**
 * The local database is the ONLY source of truth the UI ever reads.
 * Nothing in this file talks to the network: the sync worker is the sole
 * bridge between this database and the Cloud.
 */
export class EcosystemDatabase extends Dexie {
  users!: Table<UserRecord, string>;
  udi!: Table<UdiRecord, string>;
  flashes!: Table<FlashRecord, string>;
  missions!: Table<MissionRecord, string>;
  posts!: Table<PostRecord, string>;
  media!: Table<MediaRecord, string>;
  notifications!: Table<NotificationRecord, string>;
  audit!: Table<AuditEntryRecord, string>;

  /** Pending local writes waiting to reach the Cloud. */
  outbox!: Table<OutboxEntry, string>;
  /** Per-table pull/push cursors. */
  cursors!: Table<SyncCursor, SyncedTable>;

  constructor(name = "ecosystem") {
    super(name);

    this.version(1).stores({
      users: "id, handle, status, updatedAt, deletedAt",
      udi: "id, userId, level, updatedAt, deletedAt",
      flashes: "id, authorId, status, expiresAt, updatedAt, deletedAt",
      missions: "id, authorId, assigneeId, status, dueAt, updatedAt, deletedAt",
      posts: "id, authorId, visibility, updatedAt, deletedAt",
      media: "id, kind, state, updatedAt, deletedAt",
      notifications: "id, recipientId, channel, readAt, updatedAt, deletedAt",
      audit: "id, actorId, targetTable, targetId, updatedAt, deletedAt",
      outbox: "id, table, recordId, mutatedAt, attempts",
      cursors: "table",
    });
  }
}

let instance: EcosystemDatabase | null = null;

/** Lazily creates the singleton database. Never call this during SSR. */
export function getDb(): EcosystemDatabase {
  if (typeof indexedDB === "undefined") {
    throw new Error("The local database is only available in the browser.");
  }
  instance ??= new EcosystemDatabase();
  return instance;
}

/** True when the local database can be used (browser with IndexedDB). */
export function isLocalDatabaseAvailable(): boolean {
  return typeof indexedDB !== "undefined";
}
