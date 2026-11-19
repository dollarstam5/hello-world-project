/**
 * Offline-first platform layer.
 *
 * The interface reads and writes the local database only. Nothing here calls
 * the Cloud: synchronisation is the worker's job.
 */

export * from "./live-query";
export * from "./sync-status";
export * from "./local-scope";

export { useSyncEngine, requestSyncNow } from "./sync-controller";

export {
  isLocalDatabaseAvailable,
  usersRepository,
  udiRepository,
  flashesRepository,
  missionsRepository,
  radarsRepository,
  postsRepository,
  mediaRepository,
  FLASH_MEDIA_LIMITS,
  validateFlashAttachment,
  storeLocalFlashAttachment,
  getLocalFlashAttachment,
  listLocalFlashAttachments,
  attachLocalFlashMedia,
  deleteLocalFlashAttachment,
  deleteLocalFlashAttachments,
  notificationsRepository,
  auditRepository,
  countPending,
} from "@eco/core-db";
