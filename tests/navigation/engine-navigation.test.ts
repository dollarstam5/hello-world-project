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
    expect(read("src/components/app/BottomNav.tsx")).toContain("PRIMARY_ENGINES");
    expect(read("src/components/experience/HomeFoundation.tsx")).toContain("PRIMARY_ENGINES");
    const engines = read("src/lib/navigation/primary-engines.ts");
    expect(engines).toContain('to: "/reel"');
    expect(engines).toContain('to: "/flash"');
    expect(engines).toContain('to: "/scan"');
    expect(engines).toContain('to: "/radar"');
    const categories = read("src/lib/navigation/secondary-spaces.ts");
    expect(categories).toContain('to: "/espace"');
    expect(categories).toContain('to: "/talents"');
    expect(read("src/components/app/MenuSheet.tsx")).toContain("SECONDARY_SPACES");
    expect(read("src/routes/reel.tsx")).toContain('@/domains/reel"');
    expect(read("src/routes/flash.tsx")).toContain('@/domains/flash"');
    expect(read("src/routes/scan.tsx")).toContain('@/domains/scan"');
    expect(read("src/routes/radar.tsx")).toContain('@/domains/radar"');
    expect(read("src/domains/flash/index.ts")).toContain("export { FlashSpace }");
    expect(read("src/domains/scan/index.ts")).toContain("export { ScanSpace }");
    expect(read("src/domains/radar/index.ts")).toContain("export { RadarSpace }");
    expect(read("src/domains/reel/index.ts")).toContain("export { ReelSpace }");
  });

  it("makes French and English selectable on the first screen and in the app header", () => {
    const switcher = read("src/components/experience/LanguageSwitcher.tsx");
    expect(switcher).toContain('role="group"');
    expect(switcher).toContain("aria-pressed={locale === option}");
    expect(switcher).toContain("option.toUpperCase()");
    expect(read("src/components/experience/OnboardingSheet.tsx")).toContain("<LanguageSwitcher />");
    expect(read("src/components/experience/OnboardingSheet.tsx")).toContain(
      "showCloseButton={false}",
    );
    expect(read("src/components/experience/OnboardingSheet.tsx")).toContain(
      'navigate({ to: "/" })',
    );
    expect(read("src/components/app/Sheet.tsx")).toContain("showCloseButton?: boolean");
    expect(read("src/components/experience/AppHeader.tsx")).toContain("<LanguageSwitcher />");
    expect(read("src/lib/i18n/useI18n.ts")).toContain("document.documentElement.lang = locale");
    expect(read("src/lib/i18n/messages.ts")).toContain('"app.language.fr": "Français"');
    expect(read("src/lib/i18n/messages.ts")).toContain('"app.language.en": "English"');
  });

  it("opens the notification tab from the notification bell and lazy-loads Vita", () => {
    expect(read("src/components/experience/CommunicationSheet.tsx")).toContain(
      '<Tabs defaultValue="notifications">',
    );
    const assistantLayer = read("src/components/experience/AILayer.tsx");
    expect(assistantLayer).toContain("lazy(() =>");
    expect(assistantLayer).toContain("<Suspense");
    expect(read("src/domains/assistant/ui/AssistantTab.tsx")).not.toContain(
      "inputRef.current?.focus()",
    );
  });

  it("boots the service worker and Web Vitals once from the app shell", () => {
    const shell = read("src/components/app/AppShell.tsx");
    expect(shell).toContain("registerServiceWorker()");
    expect(shell).toContain("startWebVitalsMonitoring");
    const root = read("src/routes/__root.tsx");
    expect(root).not.toContain("registerServiceWorker()");
    expect(root).not.toContain("startWebVitalsMonitoring");
    const pwa = read("src/platform/pwa/install.ts");
    expect(pwa).toContain("serviceWorkerRegistrationStarted");
    expect(pwa).toContain('document.readyState === "complete"');
  });

  it("keeps route links as navigation, not ARIA tabs", () => {
    const nav = read("src/components/app/BottomNav.tsx");
    expect(nav).toContain('aria-label={t("nav.primary")}');
    expect(nav).not.toContain('role="tablist"');
  });

  it("shows onboarding before the explanatory Home and preserves the existing identification route", () => {
    const onboarding = read("src/components/experience/OnboardingSheet.tsx");
    expect(onboarding).toContain("markCompleted");
    expect(onboarding).toContain('navigate({ to: "/" })');
    expect(onboarding).not.toContain("dismiss");
    const onboardingStore = read("src/lib/experience/onboarding.ts");
    expect(onboardingStore).toContain('localStorage.setItem(STORAGE_KEY, "1")');
    expect(onboardingStore).toContain("catch");
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
