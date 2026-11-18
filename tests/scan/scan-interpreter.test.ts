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

  it("returns a safe empty interpretation for empty input", () => {
    const parsed = interpretScanRequest("");
    expect(parsed.primaryNeed).toBeNull();
    expect(parsed.category).toBeNull();
    expect(parsed.confidence).toBe("low");
    expect(parsed.intent).toBe("unknown");
  });
});
