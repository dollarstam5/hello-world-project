import script from "../scripts/test-mobile-e2e.sh?raw";
import { describe, expect, it } from "vitest";

describe("mobile visual smoke contract", () => {
  it("covers the four agreed responsive reference viewports", () => {
    for (const viewport of ["320,720", "360,800", "390,844", "412,915", "768,1024", "1024,768", "1280,800", "844,390"]) {
      expect(script).toContain(`"${viewport}"`);
    }
  });

  it("captures all five primary destinations and the profile entry", () => {
    for (const route of ["/flash", "/scan", "/reel", "/radar", "/espace"]) {
      expect(script).toContain(`"${route}"`);
    }
  });

  it("waits for rendered application content and verifies screenshot artifacts", () => {
    expect(script).toContain('--wait-for-selector="#main"');
    expect(script).toContain('test -s "$output"');
  });
});
