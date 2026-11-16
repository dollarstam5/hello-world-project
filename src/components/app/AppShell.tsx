import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { BottomNav } from "./BottomNav";
import { useExperienceBoot } from "@/lib/experience/orchestrator";
import { OfflineBanner } from "@/components/experience/OfflineBanner";
import { AppHeader } from "@/components/experience/AppHeader";
import { InstallBanner } from "@/components/experience/InstallBanner";
import { UpdateBanner } from "@/components/experience/UpdateBanner";
import { useResponsive } from "@/lib/platform/useResponsive";
import { useAssistantPreferences } from "@/lib/app/assistant-preferences";
import { AssistantNoticeLayer } from "@/components/experience/AssistantNoticeLayer";
import { useOnboarding } from "@/lib/experience/onboarding";
import { SyncEngineLoader } from "./SyncEngineLoader";

const ReelBottomNav = lazy(() =>
  import("@/domains/presence/ui/ReelBottomNav").then((module) => ({
    default: module.ReelBottomNav,
  })),
);
const MenuSheet = lazy(() =>
  import("./MenuSheet").then((module) => ({ default: module.MenuSheet })),
);
const CommunicationSheet = lazy(() =>
  import("@/components/experience/CommunicationSheet").then((module) => ({
    default: module.CommunicationSheet,
  })),
);
const OnboardingSheet = lazy(() =>
  import("@/components/experience/OnboardingSheet").then((module) => ({
    default: module.OnboardingSheet,
  })),
);

/**
 * AppShell — single mount-point that boots foundation services
 * (theme, i18n, onboarding hydration) and provides the calm canvas:
 *  - primary engine navigation on Home, Flash, Scan and Radar
 *  - dedicated navigation on Réel, with its own header and menu access
 *  - Flash owns its own engine header; the shared primary navigation remains
 *  - optional assistant access, controlled by the person
 *  - offline awareness
 *  - first-run guided Vitalis onboarding
 *  - low-end / reduced-motion gating (Phase 5/5)
 */
export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [communicationOpen, setCommunicationOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const responsive = useResponsive();
  const onboardingReady = useOnboarding((state) => state.hydrated && state.shouldShow);

  useExperienceBoot();

  useEffect(() => {
    useAssistantPreferences.getState().hydrate();
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.toggle("low-end", responsive.shouldReduceEffects);
  }, [responsive.shouldReduceEffects]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const bareChrome = pathname.startsWith("/admin") || pathname.startsWith("/auth");
  const isReelRoute = pathname === "/reel" || pathname.startsWith("/reel/");
  const isFlashRoute = pathname === "/flash" || pathname.startsWith("/flash/");
  const routeOwnsHeader = isReelRoute || isFlashRoute;
  const hasBottomNavigation = !isReelRoute;

  const reduce = responsive.shouldReduceMotion;
  if (bareChrome) {
    return (
      <>
        <SyncEngineLoader />
        <div className="relative min-h-dvh bg-background text-foreground antialiased">
          {children}
        </div>
      </>
    );
  }

  return (
    <div className="relative min-h-dvh bg-background text-foreground antialiased">
      <SyncEngineLoader />
      <AssistantNoticeLayer />
      <OfflineBanner />
      {!routeOwnsHeader && <AppHeader onOpenCommunication={() => setCommunicationOpen(true)} />}
      <main
        id="main"
        className={`mx-auto w-full max-w-screen-md ${hasBottomNavigation ? "pb-28" : "pb-0"}`}
        style={{
          paddingBottom: hasBottomNavigation ? "calc(8rem + var(--safe-bottom))" : 0,
        }}
      >
        <div key={pathname} className={reduce ? undefined : "motion-rise-in"}>
          {children}
        </div>
      </main>

      {hasBottomNavigation && (
        <BottomNav onOpenMenu={() => setMenuOpen(true)} menuOpen={menuOpen} />
      )}
      {isReelRoute && (
        <Suspense fallback={null}>
          <ReelBottomNav onOpenMenu={() => setMenuOpen(true)} menuOpen={menuOpen} />
        </Suspense>
      )}
      {menuOpen && (
        <Suspense fallback={null}>
          <MenuSheet open={menuOpen} onOpenChange={setMenuOpen} />
        </Suspense>
      )}
      {communicationOpen && (
        <Suspense fallback={null}>
          <CommunicationSheet open={communicationOpen} onOpenChange={setCommunicationOpen} />
        </Suspense>
      )}
      <InstallBanner />
      <UpdateBanner />
      {onboardingReady && (
        <Suspense fallback={null}>
          <OnboardingSheet />
        </Suspense>
      )}
    </div>
  );
}
