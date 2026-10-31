import { describe, expect, it } from "vitest";
import { parseFlashIntent } from "@eco/core-logic";

const NOW = 1_760_000_000_000;

describe("parseFlashIntent", () => {
  it("understands a French need with place and date", () => {
    const intent = parseFlashIntent("J'ai besoin de deux serveurs pour demain à Bonanjo", NOW);
    expect(intent.kind).toBe("need");
    expect(intent.timeSlot).toBe("tomorrow");
    expect(intent.expiresAt).toBe(NOW + 2 * 24 * 3_600_000);
  });

  it("defaults to an offer when no need keyword is present", () => {
    const intent = parseFlashIntent("Je propose mes services de plombier", NOW);
    expect(intent.kind).toBe("offer");
    expect(intent.category).toBe("home");
  });

  it("detects English needs and categories", () => {
    const intent = parseFlashIntent("Looking for a taxi driver tonight", NOW);
    expect(intent.kind).toBe("need");
    expect(intent.category).toBe("transport");
    expect(intent.timeSlot).toBe("today");
  });

  it("maps urgent requests to the shortest lifetime", () => {
    const intent = parseFlashIntent("Urgent : salle disponible maintenant", NOW);
    expect(intent.timeSlot).toBe("now");
    expect(intent.expiresAt).toBe(NOW + 6 * 3_600_000);
  });

  it("falls back to other/today for unclear text", () => {
    const intent = parseFlashIntent("Quelque chose de vague", NOW);
    expect(intent.category).toBe("other");
    expect(intent.timeSlot).toBe("today");
    expect(intent.expiresAt).toBe(NOW + 24 * 3_600_000);
  });

  it("is deterministic: same text, same result", () => {
    const a = parseFlashIntent("Je cherche un cours de cuisine cette semaine", NOW);
    const b = parseFlashIntent("Je cherche un cours de cuisine cette semaine", NOW);
    expect(a).toEqual(b);
    expect(a.category).toBe("food");
    expect(a.timeSlot).toBe("this_week");
  });
});
