import { lazy, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { BottomNav } from "@/app/navigation";
import { useExperienceBoot } from "@/app/bootstrap";
import { OfflineBanner } from "@/platform/offline/ui/OfflineBanner";
import { AppHeader } from "@/components/experience/AppHeader";
import { InstallBanner } from "@/platform/pwa/ui/InstallBanner";
import { UpdateBanner } from "@/platform/pwa/ui/UpdateBanner";
import { useResponsive } from "@/lib/platform/useResponsive";
import { useAssistantPreferences } from "@/lib/app/assistant-preferences";
import { AssistantNoticeLayer } from "@/components/experience/AssistantNoticeLayer";
import { useOnboarding } from "@/lib/experience/onboarding";
import { SyncEngineLoader } from "@/components/app/SyncEngineLoader";
import { CommunicationRuntimeProvider } from "@/lib/communication/CommunicationRuntimeProvider";
import { useAuth } from "@/modules/auth";
import { useI18n } from "@/lib/i18n/useI18n";
import { resetReelActivityProjection } from "@/modules/reel/model/reel-activity-projection";
import { useAccessMode } from "@/modules/access-mode";

const ReelCommunicationBridge = lazy(() =>
  import("@/modules/reel/model/ReelCommunicationBridge").then((module) => ({
    default: module.ReelCommunicationBridge,
  })),
);
const ReelBottomNav = lazy(() =>
  import("@/modules/reel/ui/ReelBottomNav").then((module) => ({
    default: module.ReelBottomNav,
  })),
);
const MenuSheet = lazy(() =>
  import("@/app/navigation/MenuSheet").then((module) => ({ default: module.MenuSheet })),
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
 * (theme, i18n, onboarding hydration) and provides the calm canvas.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [communicationOpen, setCommunicationOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const responsive = useResponsive();
  const onboardingReady = useOnboarding((state) => state.hydrated && state.shouldShow);
  const { user, loading: authLoading } = useAuth();
  const access = useAccessMode();
  const { locale } = useI18n();
  const assistantEnabled = useAssistantPreferences((state) => state.enabled);
  const assistantPreferencesHydrated = useAssistantPreferences((state) => state.hydrated);
  const communicationContext = useMemo(
    () => ({
      identity: authLoading
        ? ("loading" as const)
        : user
          ? ("member" as const)
          : ("guest" as const),
      pathname,
      locale,
      assistantEnabled: assistantPreferencesHydrated ? assistantEnabled : null,
    }),
    [assistantEnabled, assistantPreferencesHydrated, authLoading, locale, pathname, user],
  );

  const previousProjectionIdentity = useRef<string | undefined>(undefined);
  const projectionIdentity = access.loading
    ? "loading"
    : access.mode === "member"
      ? `member:${access.memberId ?? "unavailable"}`
      : access.mode === "guest"
        ? `guest:${access.guest?.startedAt ?? "pending"}`
        : "visitor";

  useEffect(() => {
    if (
      previousProjectionIdentity.current !== undefined &&
      previousProjectionIdentity.current !== projectionIdentity
    ) {
      resetReelActivityProjection();
    }
    previousProjectionIdentity.current = projectionIdentity;
  }, [projectionIdentity]);

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
      <CommunicationRuntimeProvider
        context={communicationContext}
        sessionIdentityKey={authLoading ? "loading" : (user?.id ?? "guest")}
      >
        <>
          <SyncEngineLoader />
          <div className="relative min-h-dvh bg-background text-foreground antialiased">
            {children}
          </div>
        </>
      </CommunicationRuntimeProvider>
    );
  }

  return (
    <CommunicationRuntimeProvider
      context={communicationContext}
      sessionIdentityKey={authLoading ? "loading" : (user?.id ?? "guest")}
    >
      <div className="relative min-h-dvh bg-background text-foreground antialiased">
        <SyncEngineLoader />
        <Suspense fallback={null}>
          <ReelCommunicationBridge />
        </Suspense>
        <AssistantNoticeLayer />
        <OfflineBanner />
        {!routeOwnsHeader && <AppHeader onOpenCommunication={() => setCommunicationOpen(true)} />}
        <main
          id="main"
          className={`mx-auto w-full max-w-screen-md ${hasBottomNavigation ? "pb-28" : "pb-0"}`}
          style={{
            paddingBottom: hasBottomNavigation ? "calc(9rem + var(--safe-bottom))" : 0,
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
    </CommunicationRuntimeProvider>
  );
}
