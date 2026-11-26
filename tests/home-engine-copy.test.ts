import { describe, expect, it } from "vitest";
import { messages } from "@/platform/internationalization/messages";

describe("Home engine explanations", () => {
  it("describes Radar as a saved private draft, not an active tracking service", () => {
    expect(messages.fr["home.engine.radar.desc"]).toContain("brouillon");
    expect(messages.fr["home.engine.radar.example"]).toContain("Préparer un brouillon");
    expect(messages.fr["home.engine.radar.example"]).not.toMatch(/suivre|suivi/i);

    expect(messages.en["home.engine.radar.desc"]).toContain("draft");
    expect(messages.en["home.engine.radar.example"]).toContain("Prepare a private");
    expect(messages.en["home.engine.radar.example"]).not.toMatch(/keep track|tracking/i);
  });
});
