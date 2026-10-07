import { describe, expect, it } from "vitest";
import {
  SYNC_PROTOCOL_VERSION,
  SyncValidationError,
  validatePullRequest,
  validatePullResult,
  validatePushRequest,
} from "@eco/core-contracts";

const uuid = (n: number) => `00000000-0000-4000-8000-${n.toString().padStart(12, "0")}`;

const mutation = {
  id: uuid(1),
  ownerId: uuid(2),
  table: "flashes",
  recordId: uuid(3),
  kind: "update",
  patch: { title: "updated" },
  mutatedAt: 1,
  attempts: 0,
  lastAttemptAt: null,
  lastError: null,
};

const cursors = [
  "users",
  "udi",
  "flashes",
  "missions",
  "radars",
  "posts",
  "media",
  "notifications",
  "audit",
].map((table) => ({ table, revision: 0 }));

describe("sync protocol validation", () => {
  it("accepts the current strict push contract", () => {
    const result = validatePushRequest({
      protocolVersion: SYNC_PROTOCOL_VERSION,
      entries: [mutation],
    });

    expect(result.entries[0].table).toBe("flashes");
  });

  it("rejects an unsupported protocol version", () => {
    expect(() => validatePushRequest({ protocolVersion: 1, entries: [mutation] })).toThrow(
      SyncValidationError,
    );
  });

  it("rejects unknown mutation fields", () => {
    expect(() =>
      validatePushRequest({
        protocolVersion: SYNC_PROTOCOL_VERSION,
        entries: [{ ...mutation, unexpected: true }],
      }),
    ).toThrow(SyncValidationError);
  });

  it("rejects a pull result that moves a cursor backwards", () => {
    const request = validatePullRequest({
      protocolVersion: SYNC_PROTOCOL_VERSION,
      cursors: cursors.map((cursor) =>
        cursor.table === "flashes" ? { ...cursor, revision: 10 } : cursor,
      ),
      limit: 10,
    });

    expect(() =>
      validatePullResult(
        {
          records: [],
          cursors: cursors.map((cursor) =>
            cursor.table === "flashes" ? { ...cursor, revision: 9 } : cursor,
          ),
          hasMore: false,
        },
        request,
      ),
    ).toThrow(SyncValidationError);
  });
});
