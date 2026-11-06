import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (path: string) => readFileSync(resolve(path), "utf8");

describe("Vitalis engine navigation boundaries", () => {
  it("keeps the app brand and PWA launch target on Home", () => {
    expect(read("src/components/experience/AppHeader.tsx")).toContain('<Link to="/"');
    expect(read("public/manifest.webmanifest")).toContain('"start_url": "/"');
    expect(read("src/routes/index.tsx")).toContain('createFileRoute("/")');
  });

  it("routes each primary engine to its own public domain space", () => {
    expect(read("src/components/app/BottomNav.tsx")).toContain('to: "/reel"');
    expect(read("src/components/app/BottomNav.tsx")).toContain('to: "/flash"');
    expect(read("src/components/app/BottomNav.tsx")).toContain('to: "/scan"');
    expect(read("src/components/app/BottomNav.tsx")).toContain('to: "/radar"');
    expect(read("src/routes/reel.tsx")).toContain("@/domains/reel\"");
    expect(read("src/routes/flash.tsx")).toContain("@/domains/flash\"");
    expect(read("src/routes/scan.tsx")).toContain("@/domains/scan\"");
    expect(read("src/routes/radar.tsx")).toContain("@/domains/radar\"");
    expect(read("src/domains/flash/index.ts")).toContain("export { FlashSpace }");
    expect(read("src/domains/scan/index.ts")).toContain("export { ScanSpace }");
    expect(read("src/domains/radar/index.ts")).toContain("export { RadarSpace }");
    expect(read("src/domains/reel/index.ts")).toContain("export { ReelSpace }");
  });

  it("keeps route links as navigation, not ARIA tabs", () => {
    const nav = read("src/components/app/BottomNav.tsx");
    expect(nav).toContain('aria-label={t("nav.primary")}');
    expect(nav).not.toContain('role="tablist"');
  });

  it("shows onboarding before the explanatory Home and preserves the existing identification route", () => {
    const onboarding = read("src/components/experience/OnboardingSheet.tsx");
    expect(onboarding).toContain("markCompleted");
    expect(onboarding).not.toContain("dismiss");
    const home = read("src/components/experience/HomeFoundation.tsx");
    expect(home).toContain('to="/auth"');
    expect(home).toContain("useAuth");
  });

  it("documents the domain ownership and integration boundary", () => {
    const domains = read("src/domains/README.md");
    expect(domains).toContain("Les domaines ne consultent jamais les détails internes");
    expect(domains).toContain("contrats partagés");
  });
});
