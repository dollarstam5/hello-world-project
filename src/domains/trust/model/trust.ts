/**
 * Trust domain policy and signal contract.
 * Trust scoring and thresholds are business rules, not platform infrastructure.
 */
export interface TrustSignal {
  subjectId: string;
  score: number;
  verified: boolean;
  reason?: string;
}

export const TRUST_THRESHOLDS = {
  low: 30,
  medium: 60,
  high: 80,
} as const;

export function trustBand(score: number): "low" | "medium" | "high" {
  if (score >= TRUST_THRESHOLDS.high) return "high";
  if (score >= TRUST_THRESHOLDS.medium) return "medium";
  return "low";
}
