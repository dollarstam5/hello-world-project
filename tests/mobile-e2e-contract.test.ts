import script from "../scripts/test-mobile-e2e.sh?raw";
import scrollCheck from "../scripts/check-mobile-scroll.mjs?raw";
import workflow from "../.github/workflows/reel-validation.yml?raw";
import { describe, expect, it } from "vitest";

describe("mobile visual smoke contract", () => {
  it("smoke-tests the public routes at the reference phone viewport and delegates viewport coverage to the scroll check", () => {
    expect(script).toContain('"390,844"');
    for (const route of ['"/"', '"/flash"', '"/scan"', '"/reel"', '"/radar"']) {
      expect(script).toContain(route);
    }
    expect(script).toContain("scripts/check-mobile-scroll.mjs");
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
    expect(script).toContain('"/scan") selector="#scan-radius"');
    expect(script).toContain('"/reel") selector=".reel-proximity"');
    expect(script).toContain('"/radar") selector="main h1"');
    expect(script).toContain('--wait-for-selector="$selector"');
    expect(script).toContain('test -s "$output"');
  });

  it("does not cancel active validation and avoids fixed port collisions", () => {
    expect(workflow).toContain("cancel-in-progress: false");
    expect(script).toContain("PORT=\"$(python3");
    expect(script).toContain("setsid bunx wrangler dev");
    expect(script).toContain('kill -- "-$SERVER_PID"');
    expect(script).toContain("trap cleanup EXIT");
    expect(script).not.toContain('PORT="4173"');
    expect(scrollCheck).toContain("--remote-debugging-port=0");
    expect(scrollCheck).toContain("DevToolsActivePort");
    expect(scrollCheck).toContain("detached: true");
    expect(scrollCheck).toContain("process.kill(-chrome.pid");
    expect(scrollCheck).not.toContain("9222");
  });

  it("asserts bottom-scroll clearance above the fixed navigation for Flash and Scan", () => {
    expect(script).toContain("scripts/check-mobile-scroll.mjs");
    expect(script).toContain("bottom-scroll clearance assertions");
  });
});
