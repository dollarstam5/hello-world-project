import { describe, expect, it } from "vitest";
import { messages } from "@/lib/i18n/messages";

const engines = ["flash", "scan", "reel", "radar"] as const;

describe("Home journey guidance", () => {
  it.each(engines)("provides a clear example in French and English for %s", (engine) => {
    expect(messages.fr[`home.engine.${engine}.example`]).toBeTruthy();
    expect(messages.en[`home.engine.${engine}.example`]).toBeTruthy();
  });

  it("does not claim that Scan works without using the chosen area", () => {
    expect(messages.fr["home.engine.scan.desc"]).toContain("zone que vous choisissez");
    expect(messages.fr["home.engine.scan.desc"]).not.toContain("sans partager votre position");
    expect(messages.en["home.engine.scan.desc"]).toContain("area you choose");
  });
});
