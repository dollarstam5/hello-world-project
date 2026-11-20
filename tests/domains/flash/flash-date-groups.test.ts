import { describe, expect, it } from "vitest";
import { getFlashDateGroup } from "@/domains/flash/model/date-groups";

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
