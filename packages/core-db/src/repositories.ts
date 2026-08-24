import type {
  AuditEntryRecord,
  FlashRecord,
  MediaRecord,
  MissionRecord,
  NotificationRecord,
  PostRecord,
  UdiRecord,
  UserRecord,
} from "@eco/core-contracts";
import { createRepository } from "./repository";

/** One repository per synchronised table. The UI uses these, never Dexie. */
export const usersRepository = createRepository<UserRecord>("users");
export const udiRepository = createRepository<UdiRecord>("udi");
export const flashesRepository = createRepository<FlashRecord>("flashes");
export const missionsRepository = createRepository<MissionRecord>("missions");
export const postsRepository = createRepository<PostRecord>("posts");
export const mediaRepository = createRepository<MediaRecord>("media");
export const notificationsRepository =
  createRepository<NotificationRecord>("notifications");
export const auditRepository = createRepository<AuditEntryRecord>("audit");
