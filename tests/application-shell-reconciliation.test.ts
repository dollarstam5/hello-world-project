import { describe, expect, it } from "vitest";
import appShellSource from "../src/app/shell/AppShell.tsx?raw";
import appHeaderSource from "../src/components/experience/AppHeader.tsx?raw";
import bottomNavSource from "../src/app/navigation/BottomNav.tsx?raw";
import homeSource from "../src/composition/experiences/home/HomeFoundation.tsx?raw";
import homeEngineCardSource from "../src/composition/experiences/home/HomeEngineCard.tsx?raw";
import onboardingSource from "../src/components/experience/OnboardingSheet.tsx?raw";

describe("application shell reconciliation", () => {
  it("keeps the realtime presence bridge out of the initial shell bundle", () => {
    expect(appShellSource).toContain("const ReelCommunicationBridge = lazy(");
    expect(appShellSource).toContain("<Suspense fallback={null}>");
    expect(appShellSource).toContain("<ReelCommunicationBridge />");
  });

  it("keeps the optional assistant notice UI out of the initial bundle until a notice exists", () => {
    expect(appShellSource).toContain("const AssistantNoticeLayer = lazy(");
    expect(appShellSource).toContain("const assistantNotice = useAssistantNotices(");
    expect(appShellSource).toContain("{assistantNotice && (");
    expect(appShellSource).toContain("<AssistantNoticeLayer />");
  });

  it("loads the profile preview only when the person opens it", () => {
    expect(appHeaderSource).toContain("{profileOpen && (");
    expect(appHeaderSource).toContain("<ProfileQuickPreview open={profileOpen}");
  });

  it("preserves the five primary destinations and centered En direct entry", () => {
    for (const route of ['to: "/flash"', 'to: "/scan"', 'to: "/reel"', 'to: "/radar"']) {
      expect(bottomNavSource).toContain(route);
    }
    expect(bottomNavSource).toContain('key: "menu"');
    expect(bottomNavSource).toContain("const isCenter = tab.key === \"reel\"");
  });

  it("keeps four engine entry cards on the home screen", () => {
    for (const route of ['to="/flash"', 'to="/scan"', 'to="/reel"', 'to="/radar"']) {
      expect(homeSource).toContain(route);
    }
    expect(homeEngineCardSource).toContain("export function HomeEngineCard");
  });

  it("keeps the five-step optional introduction without auto-selecting an engine", () => {
    expect(onboardingSource).toContain("const isLastStep = step === 4");
    expect(onboardingSource).toContain("const handleSkip = () =>");
    expect(onboardingSource).toContain('navigate({ to: "/" })');
    expect(onboardingSource).not.toContain('navigate({ to: "/flash" })');
    expect(onboardingSource).not.toContain('navigate({ to: "/scan" })');
    expect(onboardingSource).not.toContain('navigate({ to: "/reel" })');
    expect(onboardingSource).not.toContain('navigate({ to: "/radar" })');
  });
});
