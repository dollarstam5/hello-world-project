import { describe, expect, it } from "vitest";
import { mapRadarRow } from "@/domains/radar/model/radar.mapper";

const row = {
  id: "d0000000-0000-4000-8000-000000000010",
  owner_id: "d0000000-0000-4000-8000-000000000001",
  title: "Recherche",
  query: "Je cherche une activité",
  category: null,
  area_label: null,
  radius_km: 5,
  starts_at: 1_000,
  expires_at: 10_000,
  status: "draft",
  next_review_at: null,
  last_reviewed_at: null,
  created_at: 1_000,
  updated_at: 1_000,
  deleted_at: null,
  revision: 0,
};

describe("Radar row mapping", () => {
  it("preserves an unspecified geographic area as null", () => {
    expect(mapRadarRow(row).areaLabel).toBeNull();
  });

  it("preserves a supplied geographic area", () => {
    expect(mapRadarRow({ ...row, area_label: "Centre" }).areaLabel).toBe("Centre");
  });
});
