import script from "../scripts/test-mobile-e2e.sh?raw";
import { describe, expect, it } from "vitest";

describe("mobile visual smoke contract", () => {
  it("covers the five core routes at the compact phone, reference phone and tablet viewports", () => {
    for (const viewport of ["360,800", "390,844", "768,1024"]) {
      expect(script).toContain(`"${viewport}"`);
    }
    for (const route of ['"/"', '"/flash"', '"/scan"', '"/reel"', '"/radar"']) {
      expect(script).toContain(route);
    }
  });

  it("uses the development-only onboarding bypass for screen captures", () => {
    expect(script).toContain("__vitalis_smoke=1");
  });

  it("waits for rendered content on the home and each engine route", () => {
    expect(script).toContain('selector="#home-engines-title"');
    expect(script).toContain('"/flash") selector="main h1"');
    expect(script).toContain('"/scan") selector="#scan-radius"');
    expect(script).toContain('"/reel") selector=".reel-proximity"');
    expect(script).toContain('"/radar") selector="#radar-query"');
    expect(script).toContain('--wait-for-selector="$selector"');
    expect(script).toContain('test -s "$output"');
  });

  it("builds the app before browser checks and confirms every screenshot exists", () => {
    expect(script).toContain("bun run build:check");
    expect(script).toContain("test -s "$output"");
  });
});
