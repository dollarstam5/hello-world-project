import { describe, expect, it } from "vitest";
import { interpretScanRequest, normalizeScanText } from "../../packages/core-logic/src/scan-interpreter";

describe("Scan interpreter — human need first", () => {
  it("normalizes accents and whitespace", () => {
    expect(normalizeScanText("  MÉCANICIEN   près de moi  ")).toBe("mecanicien pres de moi");
  });

  it("recognizes urgent repair goals without assigning a listing category", () => {
    const parsed = interpretScanRequest("Je cherche un mécanicien urgent pour une crevaison maintenant");
    expect(parsed.intent).toBe("repair");
    expect(parsed.primaryNeed).toBe("je cherche un mecanicien urgent pour une crevaison maintenant");
    expect(parsed.category).toBeNull();
    expect(parsed.urgency).toBe("immediate");
    expect(parsed.confidence).toBe("high");
  });

  it("recognizes employment needs and time context", () => {
    const parsed = interpretScanRequest("Je cherche du travail de serveur ce soir");
    expect(parsed.intent).toBe("work");
    expect(parsed.category).toBeNull();
    expect(parsed.timeContext).toBe("ce soir");
  });

  it("recognizes transport goals from everyday phrasing", () => {
    const parsed = interpretScanRequest("Je cherche un taxi pour l'aéroport demain matin");
    expect(parsed.intent).toBe("transport");
    expect(parsed.category).toBeNull();
    expect(parsed.timeContext).toBe("demain matin");
    expect(parsed.urgency).toBe("soon");
  });

  it("does not require the user to name a category to express a human need", () => {
    const parsed = interpretScanRequest("J'ai besoin de quelqu'un pour m'aider à déménager dans deux heures");
    expect(parsed.intent).toBe("help");
    expect(parsed.category).toBeNull();
    expect(parsed.primaryNeed).toContain("demenager");
  });

  it("keeps vague requests open instead of forcing a taxonomy", () => {
    const parsed = interpretScanRequest("Je cherche quelqu'un");
    expect(parsed.intent).toBe("unknown");
    expect(parsed.category).toBeNull();
    expect(parsed.primaryNeed).toBe("je cherche quelqu un");
    expect(parsed.confidence).toBe("low");
  });

  it("understands different wordings of the same repair need consistently", () => {
    const requests = [
      "Ma moto est en panne, il me faut un mécanicien",
      "Je dois faire réparer ma moto aujourd'hui",
      "Quelqu'un peut dépanner mon scooter ?",
    ];
    const parsed = requests.map(interpretScanRequest);
    expect(parsed.map((item) => item.intent)).toEqual(["repair", "repair", "repair"]);
    expect(parsed.every((item) => item.category === null)).toBe(true);
  });

  it("understands different wordings of the same transport need consistently", () => {
    const requests = [
      "Je cherche un taxi pour l'aéroport demain",
      "Quelqu'un peut m'emmener à l'aéroport demain ?",
      "J'ai besoin d'un chauffeur pour aller à l'aéroport",
    ];
    const parsed = requests.map(interpretScanRequest);
    expect(parsed.map((item) => item.intent)).toEqual(["transport", "transport", "transport"]);
    expect(parsed.every((item) => item.category === null)).toBe(true);
    expect(parsed[0].timeContext).toBe("demain");
    expect(parsed[1].timeContext).toBe("demain");
  });

  it("keeps important timing and preferences from the request", () => {
    const parsed = interpretScanRequest("Je cherche un mécanicien, si possible proche, pour réparer ma moto demain");
    expect(parsed.intent).toBe("repair");
    expect(parsed.timeContext).toBe("demain");
    expect(parsed.preferences).toContain("si possible");
    expect(parsed.requiredCriteria).toContain("demain");
    expect(parsed.normalizedText).toContain("moto");
  });

  it("recognizes place-finding requests without forcing a category", () => {
    const requests = [
      "Où puis-je trouver un endroit pour sortir ce soir ?",
      "Où trouver un lieu tranquille ?",
    ];
    const parsed = requests.map(interpretScanRequest);
    expect(parsed.map((item) => item.intent)).toEqual(["activity", "place"]);
    expect(parsed.every((item) => item.category === null)).toBe(true);
  });

  it("recognizes repair needs phrased as a direct request for someone", () => {
    const parsed = interpretScanRequest("Où trouver quelqu'un pour réparer mon téléphone ?");
    expect(parsed.intent).toBe("repair");
    expect(parsed.category).toBeNull();
    expect(parsed.primaryNeed).toContain("reparer mon telephone");
  });

  it("returns a safe empty interpretation for empty input", () => {
    const parsed = interpretScanRequest("");
    expect(parsed.primaryNeed).toBeNull();
    expect(parsed.category).toBeNull();
    expect(parsed.confidence).toBe("low");
    expect(parsed.intent).toBe("unknown");
  });
});
