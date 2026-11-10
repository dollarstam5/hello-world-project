import script from "../scripts/test-mobile-e2e.sh?raw";
import { describe, expect, it } from "vitest";

describe("mobile visual smoke contract", () => {
  it("covers eight responsive reference viewports including compact, tablet, desktop and landscape", () => {
    for (const viewport of [
      "320,720",
      "360,800",
      "390,844",
      "412,915",
      "768,1024",
      "1024,768",
      "1280,800",
      "844,390",
    ]) {
      expect(script).toContain(`"${viewport}"`);
    }
  });

  it("uses the development-only onboarding bypass for screen captures", () => {
    expect(script).toContain("__vitalis_smoke=1");
  });

  it("captures the four engines, secondary space and profile entry", () => {
    for (const route of ["/flash", "/scan", "/reel", "/radar", "/talents", "/espace"]) {
      expect(script).toContain(`"${route}"`);
    }
  });

  it("captures the Réel engine at every reference viewport", () => {
    expect(script).toContain("vitalis-reel-${viewport//,/-}.png");
    expect(script).toContain('--wait-for-selector=".reel-proximity"');
    expect(script).toContain("$BASE_URL/reel?__vitalis_smoke=1");
  });

  it("waits for the Réel engine itself before capturing its route", () => {
    expect(script).toContain('selector=".reel-proximity"');
    expect(script).toContain('--wait-for-selector="$selector"');
  });

  it("waits for rendered application content and verifies screenshot artifacts", () => {
    expect(script).toContain('--wait-for-selector="#main"');
    expect(script).toContain('test -s "$output"');
  });
});
