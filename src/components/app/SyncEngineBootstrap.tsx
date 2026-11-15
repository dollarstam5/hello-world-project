import { useSyncEngine } from "@/platform/offline/sync-controller";

/** Starts background synchronization after the application shell has painted. */
export function SyncEngineBootstrap() {
  useSyncEngine();
  return null;
}
