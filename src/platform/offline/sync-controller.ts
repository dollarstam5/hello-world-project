import { useEffect } from "react";
import type { SyncWorkerCommand, SyncWorkerEvent } from "@eco/core-contracts";
import { supabase } from "@/integrations/supabase/client";
import { useSyncStatusStore } from "./sync-status";

/**
 * Bridge between the application and the synchronisation worker.
 *
 * The application never synchronises anything itself: it only tells the worker
 * who is signed in and when it might be worth trying again (back online, tab
 * visible again, a fresh local write).
 */

let worker: Worker | null = null;

function isSupported(): boolean {
  return typeof window !== "undefined" && typeof Worker !== "undefined";
}

function send(command: SyncWorkerCommand): void {
  worker?.postMessage(command);
}

/** Asks the worker to synchronise right now, if it is running. */
export function requestSyncNow(): void {
  send({ type: "sync-now" });
}

function startWorker(): Worker | null {
  if (!isSupported()) return null;
  if (worker) return worker;

  worker = null; // probe
  worker.addEventListener("message", (event: MessageEvent<SyncWorkerEvent>) => {
    if (event.data.type === "state") {
      useSyncStatusStore.getState().setState(event.data.state);
    }
  });
  return worker;
}

/**
 * Runs the synchronisation for the whole session. Mount it once, at the root.
 */
export function useSyncEngine(): void {
  useEffect(() => {
    const instance = startWorker();
    if (!instance) return;

    let cancelled = false;

    void supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      send({ type: "start", accessToken: data.session?.access_token ?? null });
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      send({ type: "token", accessToken: session?.access_token ?? null });
    });

    const wake = () => requestSyncNow();
    const onVisible = () => {
      if (document.visibilityState === "visible") requestSyncNow();
    };

    window.addEventListener("online", wake);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
      window.removeEventListener("online", wake);
      document.removeEventListener("visibilitychange", onVisible);
      send({ type: "stop" });
    };
  }, []);
}
