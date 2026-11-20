import { describe, expect, it } from "vitest";
import { getFlashDateGroup, groupFlashesByDate } from "@/domains/flash/model/date-groups";

describe("Flash dashboard date groups", () => {
  const now = new Date(2026, 10, 20, 15, 30).getTime();

  it("groups a flash created today", () => {
    expect(getFlashDateGroup(new Date(2026, 10, 20, 8).getTime(), now)).toBe("today");
  });

  it("groups yesterday and two days ago separately", () => {
    expect(getFlashDateGroup(new Date(2026, 10, 19, 8).getTime(), now)).toBe("yesterday");
    expect(getFlashDateGroup(new Date(2026, 10, 18, 8).getTime(), now)).toBe("twoDaysAgo");
  });

  it("groups dates within the last week and older dates", () => {
    expect(getFlashDateGroup(new Date(2026, 10, 16, 8).getTime(), now)).toBe("thisWeek");
    expect(getFlashDateGroup(new Date(2026, 10, 12, 8).getTime(), now)).toBe("older");
  });

  it("treats future timestamps as today's group", () => {
    expect(getFlashDateGroup(new Date(2026, 10, 21, 8).getTime(), now)).toBe("today");
  });
});


describe("Flash chronological dashboard grouping", () => {
  const now = new Date(2026, 10, 20, 15, 30).getTime();
  const records = [
    { id: "older", createdAt: new Date(2026, 10, 10, 10).getTime() },
    { id: "today-old", createdAt: new Date(2026, 10, 20, 8).getTime() },
    { id: "yesterday", createdAt: new Date(2026, 10, 19, 12).getTime() },
    { id: "today-new", createdAt: new Date(2026, 10, 20, 14).getTime() },
    { id: "week", createdAt: new Date(2026, 10, 16, 9).getTime() },
  ];

  it("orders non-empty date sections chronologically and items newest-first", () => {
    const grouped = groupFlashesByDate(records, now);
    expect(grouped.map(({ group }) => group)).toEqual(["today", "yesterday", "thisWeek", "older"]);
    expect(grouped[0].items.map((record) => record.id)).toEqual(["today-new", "today-old"]);
  });

  it("omits empty date sections", () => {
    const grouped = groupFlashesByDate([{ createdAt: now }], now);
    expect(grouped).toHaveLength(1);
    expect(grouped[0].group).toBe("today");
  });
});
