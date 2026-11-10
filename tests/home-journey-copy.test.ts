import { describe, expect, it } from "vitest";
import { messages } from "@/lib/i18n/messages";

const engines = ["flash", "scan", "reel", "radar"] as const;

describe("Home journey guidance", () => {
  it.each(engines)("provides a clear example in French and English for %s", (engine) => {
    expect(messages.fr[`home.engine.${engine}.example`]).toBeTruthy();
    expect(messages.en[`home.engine.${engine}.example`]).toBeTruthy();
  });

  it("provides a clearly labelled teaching example for Talents in both languages", () => {
    expect(messages.fr["page.talents.example.title"]).toBeTruthy();
    expect(messages.fr["page.talents.example.desc"]).toContain("Exemple");
    expect(messages.en["page.talents.example.title"]).toBeTruthy();
    expect(messages.en["page.talents.example.desc"]).toContain("Example");
  });

  it("keeps the four communication areas understandable without inventing activity", () => {
    expect(messages.fr["communication.notifications.empty"]).toContain("sans faux compteur");
    expect(messages.fr["communication.messages.empty"]).toContain("mise en relation");
    expect(messages.fr["communication.reel.empty"]).toContain("Aucun bip fictif");
    expect(messages.en["communication.notifications.empty"]).toContain("artificial counters");
    expect(messages.en["communication.reel.empty"]).toContain("No sample signals");
  });

  it("does not claim that Scan works without using the chosen area", () => {
    expect(messages.fr["home.engine.scan.desc"]).toContain("zone que vous choisissez");
    expect(messages.fr["home.engine.scan.desc"]).not.toContain("sans partager votre position");
    expect(messages.en["home.engine.scan.desc"]).toContain("area you choose");
  });
  it("provides complete personal-space navigation in both languages", () => {
    const personalSections = [
      "space.card.profile.title",
      "space.card.info.title",
      "space.card.profileSettings.title",
      "space.card.preview.title",
      "space.card.settings.title",
    ] as const;

    for (const key of personalSections) {
      expect(messages.fr[key]).toBeTruthy();
      expect(messages.en[key]).toBeTruthy();
    }

    expect(messages.fr["profile.visibility.private.desc"]).toContain("Aucun réglage");
    expect(messages.en["profile.visibility.private.desc"]).toContain("No visibility setting");
    expect(messages.fr["profile.preview.unavailable.desc"]).toContain("Aucun aperçu fictif");
    expect(messages.en["profile.preview.unavailable.desc"]).toContain("No made-up preview");
  });

  it("keeps engine management states honest and localized", () => {
    expect(messages.fr["flash.mine.empty.title"]).toBeTruthy();
    expect(messages.en["flash.mine.empty.title"]).toBeTruthy();
    expect(messages.fr["scan.history.desc"]).toContain("pas encore enregistrées");
    expect(messages.en["scan.history.desc"]).toContain("not saved yet");
    expect(messages.fr["reel.section.unavailable"]).toContain("Aucune présence");
    expect(messages.en["reel.section.unavailable"]).toContain("No presence");
    expect(messages.fr["radar.section.unavailable"]).toContain("Aucun résultat");
    expect(messages.en["radar.section.unavailable"]).toContain("No results");
  });
});
