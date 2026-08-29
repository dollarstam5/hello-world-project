/// <reference lib="webworker" />

/**
 * The synchronisation worker.
 *
 * It is the ONLY place that talks to both the local database and the Cloud.
 * It runs off the main thread, so the interface stays smooth even while a
 * large backlog of offline work is being sent.
 */

import type { SyncWorkerCommand, SyncWorkerEvent } from "@eco/core-contracts";
import {
  applyRemoteRecords,
  countPending,
  dropAccepted,
  markAttemptFailed,
  readCursors,
  readPending,
  writeCursor,
} from "@eco/core-db";
import { createHttpTransport, createSyncEngine } from "@eco/core-sync";

const scope = self as unknown as DedicatedWorkerGlobalScope;

let accessToken: string | null = null;

const engine = createSyncEngine({
  transport: createHttpTransport({
    baseUrl: "/api/sync",
    getAccessToken: () => accessToken,
  }),
  store: {
    readCursors,
    writeCursor,
    applyRemoteRecords,
    readPending,
    dropAccepted,
    markAttemptFailed,
    countPending,
  },
  onState: (state) => post({ type: "state", state }),
  onApplied: (tables) => post({ type: "applied", tables }),
});

function post(event: SyncWorkerEvent): void {
  scope.postMessage(event);
}

scope.addEventListener("message", (event: MessageEvent<SyncWorkerCommand>) => {
  const command = event.data;
  switch (command.type) {
    case "start":
      accessToken = command.accessToken;
      engine.start();
      break;
    case "token":
      accessToken = command.accessToken;
      if (command.accessToken) void engine.syncNow();
      break;
    case "sync-now":
      void engine.syncNow();
      break;
    case "stop":
      engine.stop();
      break;
  }
});
