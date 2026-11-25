import { describe, expect, it } from "vitest";
import { getCommunicationMaturityProfile } from "@/features/communication/model/maturity";

describe("communication maturity profile", () => {
  it.each([
    [0, "launch", "frequent"],
    [500, "launch", "frequent"],
    [501, "growth", "guided"],
    [5_000, "growth", "guided"],
    [5_001, "established", "selective"],
    [9_999, "established", "selective"],
    [10_000, "mature", "precision"],
  ] as const)("maps %i registered users to %s posture", (count, stage, intensity) => {
    const profile = getCommunicationMaturityProfile(count);
    expect(profile.stage).toBe(stage);
    expect(profile.suggestionIntensity).toBe(intensity);
  });

  it("uses launch posture when the trusted aggregate is not yet available", () => {
    expect(getCommunicationMaturityProfile(null)).toEqual({
      stage: "launch",
      suggestionIntensity: "frequent",
      tone: "warm-conversational",
    });
  });

  it("normalizes invalid and negative counts safely", () => {
    expect(getCommunicationMaturityProfile(Number.NaN).stage).toBe("launch");
    expect(getCommunicationMaturityProfile(-20).stage).toBe("launch");
    expect(getCommunicationMaturityProfile(10_000.9).stage).toBe("mature");
  });
});
