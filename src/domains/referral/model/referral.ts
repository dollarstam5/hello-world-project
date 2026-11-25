/**
 * Referral domain contract.
 * The placeholder remains an explicit non-production capability until
 * referral code generation and redemption are backed by domain services.
 */
export interface ReferralCode {
  code: string;
  expiresAt?: string;
  redemptions: number;
}

export function makePlaceholderReferral(): ReferralCode {
  return { code: "ECO-SOON", redemptions: 0 };
}
