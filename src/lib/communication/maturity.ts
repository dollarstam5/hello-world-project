export type CommunicationMaturityStage = "launch" | "growth" | "established" | "mature";

export interface CommunicationMaturityProfile {
  stage: CommunicationMaturityStage;
  suggestionIntensity: "frequent" | "guided" | "selective" | "precision";
  tone: "warm-conversational" | "supportive" | "discreet" | "professional-intelligent";
}

/**
 * Selects the communication posture from a trusted aggregate count of
 * registered Vitalis accounts. Guest sessions and test accounts are excluded.
 *
 * A missing count deliberately falls back to launch posture: it is safer to
 * offer a little more onboarding help than to assume a mature community.
 * This helper performs no query and stores no user-level activity.
 */
export function getCommunicationMaturityProfile(
  registeredUserCount: number | null | undefined,
): CommunicationMaturityProfile {
  const count =
    typeof registeredUserCount === "number" && Number.isFinite(registeredUserCount)
      ? Math.max(0, Math.floor(registeredUserCount))
      : 0;

  if (count <= 500) {
    return {
      stage: "launch",
      suggestionIntensity: "frequent",
      tone: "warm-conversational",
    };
  }

  if (count <= 5_000) {
    return {
      stage: "growth",
      suggestionIntensity: "guided",
      tone: "supportive",
    };
  }

  if (count < 10_000) {
    return {
      stage: "established",
      suggestionIntensity: "selective",
      tone: "discreet",
    };
  }

  return {
    stage: "mature",
    suggestionIntensity: "precision",
    tone: "professional-intelligent",
  };
}
