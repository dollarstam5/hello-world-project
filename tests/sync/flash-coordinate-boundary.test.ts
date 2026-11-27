import { describe, expect, it } from "vitest";
import { toRecord } from "@/lib/sync/mapping";

describe("Sync record privacy boundary", () => {
  it("never serializes legacy precise coordinates from Flash rows", () => {
    const record = toRecord("flashes", {
      id: "f0000000-0000-4000-8000-000000000001",
      author_id: "f1000000-0000-4000-8000-000000000001",
      area_label: "Akwa",
      latitude: 4.0201,
      longitude: 9.6902,
      accuracy_meters: 8,
    });

    expect(record).toEqual({
      id: "f0000000-0000-4000-8000-000000000001",
      authorId: "f1000000-0000-4000-8000-000000000001",
      areaLabel: "Akwa",
    });
    expect(record).not.toHaveProperty("latitude");
    expect(record).not.toHaveProperty("longitude");
    expect(record).not.toHaveProperty("accuracyMeters");
  });

  it("does not apply Flash-only exclusions to other synced tables", () => {
    expect(toRecord("posts", { latitude: 4.02 })).toEqual({ latitude: 4.02 });
  });
});
