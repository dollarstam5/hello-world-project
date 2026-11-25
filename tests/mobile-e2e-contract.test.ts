import script from "../tooling/scripts/test-mobile-e2e.sh?raw";
import { describe, expect, it } from "vitest";

describe("mobile visual smoke contract", () => {
  it("covers the five core routes at the compact phone, reference phone and tablet viewports", () => {
    for (const viewport of ["360,800", "390,844", "412,915", "768,1024"]) {
      expect(script).toContain('"' + viewport + '"');
    }
    for (const route of ['"/"', '"/flash"', '"/scan"', '"/reel"', '"/radar"']) {
      expect(script).toContain(route);
    }
  });

  it("serves the generated production Worker rather than a development server", () => {
    expect(script).toContain("bun run build:check");
    expect(script).toContain('test -s ".output/server/wrangler.json"');
    expect(script).toContain("bunx wrangler dev");
    expect(script).toContain('--config ".output/server/wrangler.json"');
    expect(script).not.toContain("bun run dev");
    expect(script).not.toContain("bun run preview");
    expect(script).not.toContain("bunx nitro preview");
  });

  it("keeps the 390 by 844 reference viewport and waits for route content", () => {
    expect(script).toContain('"390,844"');
    expect(script).toContain('selector="#home-engines-title"');
    expect(script).toContain('"/flash") selector="main h1"');
    expect(script).toContain('"/scan") selector="#scan-need"');
    expect(script).toContain('"/reel") selector=".reel-proximity"');
    expect(script).toContain('"/radar") selector="main h1"');
    expect(script).toContain('--wait-for-selector="$selector"');
    expect(script).toContain('test -s "$output"');
  });

  it("asserts bottom-scroll clearance above the fixed navigation for Flash and Scan", () => {
    expect(script).toContain("tooling/scripts/check-mobile-scroll.mjs");
    expect(script).toContain("bottom-scroll clearance assertions");
  });
});
