import { describe, expect, it } from "vitest";
import type { ScanResult } from "../../packages/core-contracts/src/scan";
import {
  assessScanCandidate,
  rankScanAssessments,
} from "../../packages/core-logic/src/scan";
import { interpretScanRequest } from "../../packages/core-logic/src/scan-interpreter";

const result = (id: string, distanceKm = 1): ScanResult => ({
  id,
  kind: "offer",
  category: "other",
  title: id,
  timeSlot: "today",
  areaLabel: "Douala",
  distanceKm,
  createdAt: 1_000,
  expiresAt: 100_000_000,
});

describe("Scan candidate qualification", () => {
  it("never labels a candidate exact when source evidence is absent", () => {
    const interpretation = interpretScanRequest("Je cherche un mécanicien demain");
    const assessment = assessScanCandidate(result("unknown"), interpretation);

    expect(assessment.level).toBe("unverified");
    expect(assessment.explanationCodes).toContain("evidence_incomplete");
  });

  it("labels a result exact only when the need and every strict criterion are confirmed", () => {
    const interpretation = interpretScanRequest(
      "Je veux impérativement un mécanicien disponible demain",
    );
    const assessment = assessScanCandidate(result("exact"), interpretation, {
      needMatch: "match",
      confirmedRequiredCriteria: ["demain"],
      refutedRequiredCriteria: [],
      unknownRequiredCriteria: [],
      matchedPreferences: [],
    });

    expect(assessment.level).toBe("exact");
  });

  it("keeps a contradicted strict criterion out of the exact group", () => {
    const interpretation = interpretScanRequest(
      "Je veux impérativement un mécanicien disponible demain",
    );
    const assessment = assessScanCandidate(result("close"), interpretation, {
      needMatch: "match",
      confirmedRequiredCriteria: [],
      refutedRequiredCriteria: ["demain"],
      unknownRequiredCriteria: [],
      matchedPreferences: [],
    });

    expect(assessment.level).toBe("close");
    expect(assessment.explanationCodes).toContain("required_criteria_not_met");
  });

  it("separates a different primary need as an alternative", () => {
    const interpretation = interpretScanRequest("Je cherche un mécanicien");
    const assessment = assessScanCandidate(result("alternative"), interpretation, {
      needMatch: "no_match",
      confirmedRequiredCriteria: [],
      refutedRequiredCriteria: [],
      unknownRequiredCriteria: [],
      matchedPreferences: [],
    });

    expect(assessment.level).toBe("alternative");
  });

  it("orders qualification groups before proximity and freshness", () => {
    const interpretation = interpretScanRequest("Je cherche un mécanicien");
    const exact = assessScanCandidate(result("exact-far", 4), interpretation, {
      needMatch: "match",
      confirmedRequiredCriteria: [],
      refutedRequiredCriteria: [],
      unknownRequiredCriteria: [],
      matchedPreferences: [],
    });
    const close = assessScanCandidate(result("close-near", 0.1), interpretation, {
      needMatch: "partial",
      confirmedRequiredCriteria: [],
      refutedRequiredCriteria: [],
      unknownRequiredCriteria: [],
      matchedPreferences: [],
    });

    expect(rankScanAssessments([close, exact]).map((item) => item.level)).toEqual([
      "exact",
      "close",
    ]);
  });
});
