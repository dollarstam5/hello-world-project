import { describe, expect, it } from "vitest";
import type { PublicFlash } from "@eco/core-contracts";
import { createDemoFlashes, selectFlashFeedItems } from "@/domains/flash/model/demo-flashes";

const NOW = Date.UTC(2026, 10, 10, 12);

function realFlash(id: string, createdAt: number): PublicFlash {
  return {
    id,
    kind: "need",
    category: "home",
    title: `Publication réelle ${id}`,
    timeSlot: "today",
    areaLabel: "Zone réelle",
    createdAt,
    expiresAt: NOW + 60_000,
  };
}

describe("Flash demo feed", () => {
  it("keeps real publications first and only fills the missing slots", () => {
    const rows = selectFlashFeedItems([realFlash("real-1", NOW)], true, NOW);

    expect(rows).toHaveLength(3);
    expect(rows[0]).toMatchObject({ id: "real-1", origin: "real" });
    expect(rows.slice(1).every((row) => row.origin === "demo")).toBe(true);
  });

  it("does not add examples when the real feed reaches its target", () => {
    const realRows = [
      realFlash("real-1", NOW),
      realFlash("real-2", NOW - 1),
      realFlash("real-3", NOW - 2),
    ];

    expect(selectFlashFeedItems(realRows, true, NOW).map((row) => row.origin)).toEqual([
      "real",
      "real",
      "real",
    ]);
  });

  it("does not add examples before real data has finished loading", () => {
    expect(selectFlashFeedItems([], false, NOW)).toEqual([]);
  });

  it("uses only public fields and synthetic demo identifiers", () => {
    const fixtures = createDemoFlashes(NOW);

    expect(fixtures).toHaveLength(3);
    expect(fixtures.every((row) => row.id.startsWith("demo:flash:"))).toBe(true);
    expect(fixtures.every((row) => !("authorId" in row) && !("contact" in row))).toBe(true);
    expect(fixtures.every((row) => row.expiresAt > NOW)).toBe(true);
  });
});
