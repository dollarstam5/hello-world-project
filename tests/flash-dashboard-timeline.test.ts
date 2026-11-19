import { describe, expect, it } from "vitest";
import { groupFlashByDate } from "@/domains/flash/ui/dashboard/utils/groupFlashByDate";

function localDay(year: number, month: number, day: number, hour = 12) {
  return new Date(year, month, day, hour, 0, 0, 0).getTime();
}

function record(id: string, createdAt: number) {
  return { id, createdAt } as never;
}

describe("Flash dashboard timeline grouping", () => {
  it("places records into the six chronological buckets without overlap", () => {
    // Sunday: Saturday belongs to the current week; Friday is two days ago.
    const now = localDay(2026, 10, 22);
    const rows = [
      record("today", now),
      record("yesterday", localDay(2026, 10, 21)),
      record("twoDays", localDay(2026, 10, 20)),
      record("thisWeek", localDay(2026, 10, 21 - 3)),
      record("lastWeek", localDay(2026, 10, 9)),
      record("older", localDay(2026, 10, 2)),
    ];

    const groups = groupFlashByDate(rows, now);
    const groupedIds = groups.flatMap((group) => group.items.map((item) => item.id));

    expect(groups.map((group) => group.key)).toEqual([
      "today",
      "yesterday",
      "twoDays",
      "week",
      "lastWeek",
      "older",
    ]);
    expect(groups.map((group) => group.items.map((item) => item.id))).toEqual([
      ["today"],
      ["yesterday"],
      ["twoDays"],
      ["thisWeek"],
      ["lastWeek"],
      ["older"],
    ]);
    expect(groupedIds).toHaveLength(rows.length);
    expect(new Set(groupedIds).size).toBe(rows.length);
  });

  it("handles Monday week boundaries and the previous Sunday", () => {
    const now = localDay(2026, 10, 23); // Monday
    const rows = [
      record("monday", now),
      record("sunday", localDay(2026, 10, 22)),
      record("older-date", localDay(2026, 10, 2)),
    ];

    const groups = groupFlashByDate(rows, now);

    expect(groups.map((group) => [group.key, group.items.map((item) => item.id)])).toEqual([
      ["today", ["monday"]],
      ["lastWeek", ["sunday"]],
      ["older", ["older-date"]],
    ]);
  });

  it("handles month/year rollover and sorts items newest-first inside a bucket", () => {
    const now = localDay(2026, 0, 1);
    const rows = [
      record("later", localDay(2025, 11, 28, 18)),
      record("earlier", localDay(2025, 11, 28, 8)),
      record("old", localDay(2025, 11, 20)),
    ];

    const groups = groupFlashByDate(rows, now);

    expect(groups.map((group) => group.key)).toEqual(["lastWeek", "older"]);
    expect(groups[0].items.map((item) => item.id)).toEqual(["later", "earlier"]);
    expect(groups[1].items.map((item) => item.id)).toEqual(["old"]);
  });

  it("returns no groups for an empty result", () => {
    expect(groupFlashByDate([], localDay(2026, 10, 22))).toEqual([]);
  });
});
