import { describe, expect, it } from "vitest";
import { interpretScanRequest, normalizeScanText } from "../../packages/core-logic/src/scan-interpreter";

describe("Scan interpreter", () => {
  it("normalizes accents and whitespace", () => {
    expect(normalizeScanText("  MÉCANICIEN   près de moi  ")).toBe("mecanicien pres de moi");
  });

  it("recognizes urgent repair requests", () => {
    const parsed = interpretScanRequest("Je cherche un mécanicien urgent pour une crevaison maintenant");
    expect(parsed.intent).toBe("repair");
    expect(parsed.category).toBe("home");
    expect(parsed.urgency).toBe("immediate");
    expect(parsed.confidence).toBe("high");
  });

  it("recognizes employment needs and time context", () => {
    const parsed = interpretScanRequest("Je cherche du travail de serveur ce soir");
    expect(parsed.intent).toBe("work");
    expect(parsed.category).toBe("professional");
    expect(parsed.timeContext).toBe("ce soir");
  });

  it("recognizes transport needs", () => {
    const parsed = interpretScanRequest("Je cherche un taxi pour l'aéroport demain matin");
    expect(parsed.intent).toBe("transport");
    expect(parsed.category).toBe("transport");
    expect(parsed.urgency).toBe("soon");
  });

  it("leaves vague requests unclassified and low-confidence", () => {
    const parsed = interpretScanRequest("Je cherche quelqu'un");
    expect(parsed.intent).toBe("unknown");
    expect(parsed.confidence).toBe("low");
  });

  it("returns a safe empty interpretation for empty input", () => {
    const parsed = interpretScanRequest("");
    expect(parsed.primaryNeed).toBeNull();
    expect(parsed.confidence).toBe("low");
    expect(parsed.intent).toBe("unknown");
  });
});
