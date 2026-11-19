import { describe, expect, it } from "vitest";
import {
  interpretScanRequest,
  normalizeScanText,
} from "../../packages/core-logic/src/scan-interpreter";

describe("Scan interpreter — human need first", () => {
  it("normalizes accents and whitespace", () => {
    expect(normalizeScanText("  MÉCANICIEN   près de moi  ")).toBe("mecanicien pres de moi");
  });

  it("recognizes urgent repair goals without assigning a listing category", () => {
    const parsed = interpretScanRequest(
      "Je cherche un mécanicien urgent pour une crevaison maintenant",
    );
    expect(parsed.intent).toBe("repair");
    expect(parsed.primaryNeed).toBe(
      "je cherche un mecanicien urgent pour une crevaison maintenant",
    );
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
    const parsed = interpretScanRequest(
      "J'ai besoin de quelqu'un pour m'aider à déménager dans deux heures",
    );
    expect(parsed.intent).toBe("help");
    expect(parsed.category).toBeNull();
    expect(parsed.primaryNeed).toContain("demenager");
  });

  it("treats equivalent moving-help requests as the same human need and preserves relative timing", () => {
    const requests = [
      "Je cherche quelqu'un pour m'aider à déménager dans deux heures",
      "J'ai besoin d'un coup de main pour mon déménagement dans 2 h",
      "Quelqu'un peut-il m'aider à déplacer mes meubles aujourd'hui ?",
    ];
    const parsed = requests.map(interpretScanRequest);

    expect(parsed.map((item) => item.intent)).toEqual(["help", "help", "help"]);
    expect(parsed.map((item) => item.category)).toEqual([null, null, null]);
    expect(parsed[0].timeContext).toBe("dans deux heures");
    expect(parsed[1].timeContext).toBe("dans 2 h");
    expect(parsed[2].timeContext).toBe("aujourd hui");
    expect(parsed[0].urgency).toBe("soon");
    expect(parsed[1].urgency).toBe("soon");
    expect(parsed.every((item) => item.primaryNeed?.length)).toBe(true);
  });

  it("extracts explicit task, object, place, distance and quantity without inventing them", () => {
    const parsed = interpretScanRequest(
      "Je cherche quelqu'un pour transporter 3 cartons près de Bonapriso, dans un rayon de 5 km",
    );

    expect(parsed.taskContext).toContain("transporter");
    expect(parsed.objectContext).toContain("cartons");
    expect(parsed.locationContext).toBe("bonapriso");
    expect(parsed.distanceContext).toBe("dans un rayon de 5 km");
    expect(parsed.quantityContext).toBe("3 cartons");
    expect(parsed.category).toBeNull();
  });

  it("leaves location, distance and quantity empty when the user did not specify them", () => {
    const parsed = interpretScanRequest("Je cherche un mécanicien pour réparer ma moto demain");

    expect(parsed.locationContext).toBeNull();
    expect(parsed.distanceContext).toBeNull();
    expect(parsed.quantityContext).toBeNull();
    expect(parsed.taskContext).toContain("reparer");
    expect(parsed.objectContext).toContain("moto");
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
    const parsed = interpretScanRequest(
      "Je cherche un mécanicien, si possible proche, pour réparer ma moto demain",
    );
    expect(parsed.intent).toBe("repair");
    expect(parsed.timeContext).toBe("demain");
    expect(parsed.preferences).toContain("si possible");
    expect(parsed.requiredCriteria).not.toContain("demain");
    expect(parsed.normalizedText).toContain("moto");
  });

  it("keeps ordinary timing as context unless the user makes it mandatory", () => {
    const flexible = interpretScanRequest("Je cherche un mécanicien demain");
    const mandatory = interpretScanRequest(
      "Je veux impérativement un mécanicien disponible demain",
    );

    expect(flexible.timeContext).toBe("demain");
    expect(flexible.requiredCriteria).not.toContain("demain");
    expect(mandatory.timeContext).toBe("demain");
    expect(mandatory.requiredCriteria).toContain("demain");
  });

  it("distinguishes preferred location from a mandatory radius", () => {
    const preferred = interpretScanRequest(
      "Je cherche un mécanicien, de préférence près de Bonapriso",
    );
    const mandatory = interpretScanRequest(
      "Je veux obligatoirement un mécanicien dans un rayon de 2 km",
    );

    expect(preferred.preferences).toContain("de preference");
    expect(preferred.preferences.some((value) => value.includes("bonapriso"))).toBe(true);
    expect(preferred.requiredCriteria).not.toContain("dans un rayon de 2 km");
    expect(mandatory.requiredCriteria).toContain("dans un rayon de 2 km");
  });

  it("keeps quantity as context unless the user makes it a requirement", () => {
    const contextual = interpretScanRequest("Je cherche quelqu'un pour transporter 3 cartons");
    const mandatory = interpretScanRequest("Je veux absolument transporter 3 cartons avant 18 h");

    expect(contextual.quantityContext).toBe("3 cartons");
    expect(contextual.requiredCriteria).toHaveLength(0);
    expect(mandatory.requiredCriteria).toContain("3 cartons");
    expect(mandatory.requiredCriteria).toContain("avant 18 h");
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
