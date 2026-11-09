import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const scriptPath = resolve(process.cwd(), "scripts/test-mobile-e2e.sh");
const script = readFileSync(scriptPath, "utf8");

describe("mobile visual smoke contract", () => {
  it("covers the four agreed responsive reference viewports", () => {
    for (const viewport of ["360,800", "390,844", "412,915", "768,1024"]) {
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
