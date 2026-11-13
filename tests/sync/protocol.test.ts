import { describe, expect, it } from "vitest";
import {
  FLASH_SCOPE_RADIUS_METERS,
  FLASH_SCOPES,
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
  it("keeps the stable Flash scope identifiers mapped to the approved meter radii", () => {
    expect(FLASH_SCOPES).toEqual(["current_area", "expanded_area", "half_city", "whole_city"]);
    expect(FLASH_SCOPE_RADIUS_METERS).toEqual({
      current_area: 500,
      expanded_area: 2_000,
      half_city: 5_000,
      whole_city: 15_000,
    });
  });

  it("accepts the current strict push contract", () => {
    const result = validatePushRequest({
      protocolVersion: SYNC_PROTOCOL_VERSION,
      entries: [mutation],
    });

    expect(result.entries[0].table).toBe("flashes");
  });

  it("accepts the Flash time, scope and urgency values selected by the composer", () => {
    const result = validatePushRequest({
      protocolVersion: SYNC_PROTOCOL_VERSION,
      entries: [
        {
          ...mutation,
          patch: {
            timeSlot: "tomorrow",
            scope: "half_city",
            urgency: "very_urgent",
          },
        },
      ],
    });

    expect(result.entries[0].patch).toEqual({
      timeSlot: "tomorrow",
      scope: "half_city",
      urgency: "very_urgent",
    });
  });

  it("creates Flash records without accepting a client-supplied status", () => {
    const created = validatePushRequest({
      protocolVersion: SYNC_PROTOCOL_VERSION,
      entries: [
        {
          ...mutation,
          kind: "create",
          patch: {
            title: "Besoin de transport",
            body: "Un trajet local",
            expiresAt: 1_900_000_000_000,
            mediaIds: [],
            kind: "need",
            category: "transport",
            timeSlot: "today",
            scope: "current_area",
            urgency: "today",
            areaLabel: "Akwa",
          },
        },
      ],
    });
    expect(created.entries[0].patch).not.toHaveProperty("status");

    for (const kind of ["create", "update"] as const) {
      expect(() =>
        validatePushRequest({
          protocolVersion: SYNC_PROTOCOL_VERSION,
          entries: [
            {
              ...mutation,
              kind,
              patch:
                kind === "create"
                  ? {
                      title: "Publication directe",
                      body: "Ne doit pas être visible",
                      expiresAt: 1_900_000_000_000,
                      mediaIds: [],
                      kind: "need",
                      category: "transport",
                      timeSlot: "today",
                      scope: "current_area",
                      urgency: "today",
                      areaLabel: "Akwa",
                      status: "live",
                    }
                  : { status: "archived" },
            },
          ],
        }),
      ).toThrow(SyncValidationError);
    }
  });

  it("rejects obsolete time-slot values and unknown Flash scope or urgency values", () => {
    for (const patch of [
      { timeSlot: "morning" },
      { scope: "nearby_radius" },
      { urgency: "critical" },
    ]) {
      expect(() =>
        validatePushRequest({
          protocolVersion: SYNC_PROTOCOL_VERSION,
          entries: [{ ...mutation, patch }],
        }),
      ).toThrow(SyncValidationError);
    }
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

  it("rejects duplicate mutation ids", () => {
    expect(() =>
      validatePushRequest({
        protocolVersion: SYNC_PROTOCOL_VERSION,
        entries: [mutation, { ...mutation }],
      }),
    ).toThrow(SyncValidationError);
  });

  it("rejects a mutation that tries to write a protected field", () => {
    expect(() =>
      validatePushRequest({
        protocolVersion: SYNC_PROTOCOL_VERSION,
        entries: [{ ...mutation, patch: { revision: 999 } }],
      }),
    ).toThrow(SyncValidationError);
  });

  it("rejects an incomplete create mutation", () => {
    expect(() =>
      validatePushRequest({
        protocolVersion: SYNC_PROTOCOL_VERSION,
        entries: [
          {
            ...mutation,
            id: uuid(4),
            kind: "create",
            patch: { title: "only a title" },
          },
        ],
      }),
    ).toThrow(SyncValidationError);
  });

  it("rejects duplicate pull cursors", () => {
    expect(() =>
      validatePullRequest({
        protocolVersion: SYNC_PROTOCOL_VERSION,
        cursors: [...cursors.slice(0, -1), cursors[0]],
        limit: 10,
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

  it("rejects a pull result containing a record outside its cursor window", () => {
    const request = validatePullRequest({
      protocolVersion: SYNC_PROTOCOL_VERSION,
      cursors,
      limit: 10,
    });

    expect(() =>
      validatePullResult(
        {
          records: [
            {
              table: "flashes",
              revision: 11,
              deleted: false,
              data: { id: uuid(3), title: "updated" },
            },
          ],
          cursors: cursors.map((cursor) =>
            cursor.table === "flashes" ? { ...cursor, revision: 10 } : cursor,
          ),
          hasMore: false,
        },
        request,
      ),
    ).toThrow(SyncValidationError);
  });

  it("rejects a push result that resolves an unknown mutation id", async () => {
    const { validatePushResult } = await import("@eco/core-contracts");
    const request = validatePushRequest({
      protocolVersion: SYNC_PROTOCOL_VERSION,
      entries: [mutation],
    });

    expect(() =>
      validatePushResult(
        {
          accepted: [uuid(99)],
          rejected: [],
          records: [],
        },
        request,
      ),
    ).toThrow(SyncValidationError);
  });
});
