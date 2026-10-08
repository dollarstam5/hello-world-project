import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const script = readFileSync("scripts/test-mobile-e2e.sh", "utf8");

describe("mobile E2E contract", () => {
  it("covers every reference viewport", () => {
    for (const viewport of ["360,800", "390,844", "412,915", "768,1024"]) {
      expect(script).toContain(`"${viewport}"`);
    }
  });

  it("covers the P0 routes without authentication", () => {
    for (const route of ["/flash", "/radar", "/talents", "/espace"]) {
      expect(script).toContain(`"${route}"`);
    }
  });

  it("waits for the main application container", () => {
    expect(script).toContain('--wait-for-selector="#main"');
  });
});
