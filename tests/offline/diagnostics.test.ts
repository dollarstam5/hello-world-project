// @vitest-environment node

import type { FailedMutation, OutboxEntry } from "@eco/core-contracts";
import { describe, expect, it } from "vitest";
import { getOfflineDiagnostics } from "@/platform/offline/diagnostics";

const now = 1_000_000;

function pending(id: string, mutatedAt: number): OutboxEntry {
  return {
    id,
    ownerId: "user-a",
    table: "posts",
    recordId: id,
    kind: "update",
    patch: {},
    mutatedAt,
    attempts: 1,
    lastAttemptAt: mutatedAt,
    lastError: null,
  };
}

function failed(id: string): FailedMutation {
  return {
    ...pending(id, now - 1000),
    failedAt: now - 500,
    failureCode: "permission_denied",
  };
}

describe("offline diagnostics", () => {
  it("reports pending count and age without exposing mutation data", () => {
    const result = getOfflineDiagnostics(
      [pending("one", now - 10_000), pending("two", now - 3_000)],
      [failed("failed")],
      now,
    );

    expect(result).toEqual({
      pendingCount: 2,
      oldestPendingAgeMs: 10_000,
      quarantinedCount: 1,
    });
    expect(JSON.stringify(result)).not.toContain("one");
    expect(JSON.stringify(result)).not.toContain("posts");
    expect(JSON.stringify(result)).not.toContain("user-a");
  });

  it("returns null age when there is nothing pending", () => {
    expect(getOfflineDiagnostics([], [], now)).toEqual({
      pendingCount: 0,
      oldestPendingAgeMs: null,
      quarantinedCount: 0,
    });
  });

  it("ignores invalid or future mutation timestamps", () => {
    const result = getOfflineDiagnostics(
      [pending("invalid", Number.NaN), pending("future", now + 5_000)],
      [],
      now,
    );

    expect(result.pendingCount).toBe(2);
    expect(result.oldestPendingAgeMs).toBeNull();
  });
});
