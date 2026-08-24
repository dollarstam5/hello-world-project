/**
 * @eco/core-db — the local, offline-first database.
 *
 * Rules enforced by this package:
 *  - The UI reads and writes here, never the Cloud.
 *  - Every write also lands in the outbox, inside the same transaction.
 *  - Only the sync worker applies remote records.
 */

export * from "./schema";
export * from "./outbox";
export * from "./repository";
export * from "./repositories";
export * from "./apply-remote";
