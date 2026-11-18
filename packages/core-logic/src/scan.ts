import type {
  ScanCandidateAssessment,
  ScanCandidateEvidence,
  ScanInterpretation,
  ScanResult,
} from "@eco/core-contracts";

const HOUR_MS = 60 * 60 * 1000;

/**
 * Relevance of a scan result: close and fresh first, expiring soon last.
 * Pure and deterministic so it can run on the device or on the server.
 */
export function scanRelevance(result: ScanResult, now = Date.now()): number {
  const proximity = 1 / (1 + Math.max(0, result.distanceKm));
  const ageHours = Math.max(0, now - result.createdAt) / HOUR_MS;
  const freshness = 1 / (1 + ageHours);
  const timeLeftHours = Math.max(0, result.expiresAt - now) / HOUR_MS;
  const stillUseful = timeLeftHours <= 0 ? 0 : Math.min(1, timeLeftHours / 24);
  return proximity * 0.5 + freshness * 0.3 + stillUseful * 0.2;
}

/** Most relevant results first; never mutates the input. */
export function rankScanResults(results: ScanResult[], now = Date.now()): ScanResult[] {
  return [...results].sort((a, b) => scanRelevance(b, now) - scanRelevance(a, now));
}


/**
 * Qualifies a candidate only from explicit source evidence.
 * Missing evidence is kept as unknown and can never produce an exact match.
 */
export function assessScanCandidate(
  result: ScanResult,
  interpretation: ScanInterpretation,
  evidence?: ScanCandidateEvidence,
): ScanCandidateAssessment {
  const safeEvidence: ScanCandidateEvidence = evidence ?? result.evidence ?? {
    needMatch: "unknown",
    confirmedRequiredCriteria: [],
    refutedRequiredCriteria: [],
    unknownRequiredCriteria: [...interpretation.requiredCriteria],
    matchedPreferences: [],
  };
  const required = new Set(interpretation.requiredCriteria);
  const confirmed = new Set(safeEvidence.confirmedRequiredCriteria);
  const refuted = new Set(safeEvidence.refutedRequiredCriteria);
  const unknown = new Set(safeEvidence.unknownRequiredCriteria);
  const hasCompleteRequiredEvidence = [...required].every(
    (criterion) => confirmed.has(criterion) || refuted.has(criterion),
  );
  const hasRefutedRequired = [...required].some((criterion) => refuted.has(criterion));
  const hasUnknownRequired = [...required].some(
    (criterion) => unknown.has(criterion) || (!confirmed.has(criterion) && !refuted.has(criterion)),
  );

  let level: ScanCandidateAssessment["level"] = "unverified";
  if (safeEvidence.needMatch === "no_match") {
    level = "alternative";
  } else if (
    safeEvidence.needMatch === "partial" ||
    hasRefutedRequired
  ) {
    level = "close";
  } else if (
    safeEvidence.needMatch === "match" &&
    hasCompleteRequiredEvidence &&
    !hasRefutedRequired &&
    !hasUnknownRequired
  ) {
    level = "exact";
  }

  const explanationCodes: string[] = [];
  if (safeEvidence.needMatch === "partial") explanationCodes.push("need_partially_matches");
  if (safeEvidence.needMatch === "no_match") explanationCodes.push("different_primary_need");
  if (hasRefutedRequired) explanationCodes.push("required_criteria_not_met");
  if (hasUnknownRequired || safeEvidence.needMatch === "unknown") {
    explanationCodes.push("evidence_incomplete");
  }
  if (interpretation.preferences.length > safeEvidence.matchedPreferences.length) {
    explanationCodes.push("some_preferences_unconfirmed");
  }

  return { result, level, evidence: safeEvidence, explanationCodes };
}

/** Keeps qualification groups separate; relevance only orders items within a group. */
export function rankScanAssessments(
  assessments: ScanCandidateAssessment[],
  now = Date.now(),
): ScanCandidateAssessment[] {
  const priority: Record<ScanCandidateAssessment["level"], number> = {
    exact: 0,
    close: 1,
    alternative: 2,
    unverified: 3,
  };
  return [...assessments].sort((a, b) => {
    const levelDifference = priority[a.level] - priority[b.level];
    if (levelDifference !== 0) return levelDifference;
    const relevanceDifference =
      scanRelevance(b.result, now) - scanRelevance(a.result, now);
    return relevanceDifference || a.result.id.localeCompare(b.result.id);
  });
}


/** Source evidence flows into qualification before the established relevance ranking. */
export function selectScanResults(
  results: ScanResult[],
  interpretation: ScanInterpretation,
  now = Date.now(),
): ScanCandidateAssessment[] {
  return rankScanAssessments(
    results.map((result) => assessScanCandidate(result, interpretation)),
    now,
  );
}
