import { describe, expect, it } from "vitest";
import { mergeRecords } from "@eco/core-logic";
import type { BaseRecord } from "@eco/core-contracts";

function record(
  overrides: Partial<BaseRecord> & Record<string, unknown> = {},
): BaseRecord & Record<string, unknown> {
  return {
    id: "flash-1",
    createdAt: 100,
    updatedAt: 200,
    revision: 2,
    deletedAt: null,
    title: "local",
    body: "local pending",
    category: "transport",
    ...overrides,
  };
}

describe("offline record merging", () => {
  it("preserves pending local fields when local clock is behind the remote clock", () => {
    const local = record({ updatedAt: 150, title: "title pending", body: "body pending" });
    const remote = record({
      updatedAt: 300,
      revision: 9,
      title: "title remote",
      body: "body remote",
      category: "services",
    });

    const merged = mergeRecords(local, remote, ["title", "body"]);

    expect(merged.title).toBe("title pending");
    expect(merged.body).toBe("body pending");
    expect(merged.category).toBe("services");
    expect(merged.updatedAt).toBe(150);
    expect(merged.revision).toBe(9);
  });

  it("does not resurrect a remote tombstone while preserving a pending local edit", () => {
    const local = record({ title: "title edited offline", deletedAt: null, updatedAt: 450 });
    const remote = record({ title: "title remote", deletedAt: 400, updatedAt: 400, revision: 10 });

    const merged = mergeRecords(local, remote, ["title"]);

    expect(merged.title).toBe("title edited offline");
    expect(merged.deletedAt).toBe(400);
    expect(merged.revision).toBe(10);
  });

  it("uses remote fields when there are no pending local mutations", () => {
    const local = record({ updatedAt: 400, title: "old local" });
    const remote = record({ updatedAt: 300, revision: 8, title: "remote confirmed" });

    const merged = mergeRecords(local, remote, []);

    expect(merged.title).toBe("remote confirmed");
    expect(merged.updatedAt).toBe(400);
    expect(merged.revision).toBe(8);
  });
});
