import { useEffect, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { BottomNav } from "./BottomNav";
import { ReelBottomNav } from "@/domains/presence/ui/ReelBottomNav";
import { MenuSheet } from "./MenuSheet";
import { useExperienceBoot } from "@/lib/experience/orchestrator";
import { useSyncEngine } from "@/platform/offline";
import { OfflineBanner } from "@/components/experience/OfflineBanner";
import { AppHeader } from "@/components/experience/AppHeader";
import { CommunicationSheet } from "@/components/experience/CommunicationSheet";
import { OnboardingSheet } from "@/components/experience/OnboardingSheet";
import { InstallBanner } from "@/components/experience/InstallBanner";
import { UpdateBanner } from "@/components/experience/UpdateBanner";
import { useResponsive } from "@/lib/platform/useResponsive";
import { duration, easing } from "@/lib/design/tokens";
import { useAssistantPreferences } from "@/lib/app/assistant-preferences";
import { AssistantNoticeLayer } from "@/components/experience/AssistantNoticeLayer";

/**
 * AppShell — single mount-point that boots foundation services
 * (theme, i18n, onboarding hydration) and provides the calm canvas:
 *  - primary engine navigation on Home, Flash, Scan and Radar
 *  - dedicated navigation on Réel, with its own header and menu access
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

  useExperienceBoot();
  useSyncEngine();

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
  const routeOwnsHeader = isReelRoute;
  const hasBottomNavigation = !isReelRoute;

  const reduce = responsive.shouldReduceMotion;
  const pageTransition = reduce
    ? { duration: 0 }
    : { duration: duration.base, ease: easing.standard };

  if (bareChrome) {
    return (
      <div className="relative min-h-dvh bg-background text-foreground antialiased">{children}</div>
    );
  }

  return (
    <div className="relative min-h-dvh bg-background text-foreground antialiased">
      <AssistantNoticeLayer />
      <OfflineBanner />
      {!routeOwnsHeader && <AppHeader onOpenCommunication={() => setCommunicationOpen(true)} />}
      <main
        id="main"
        className={`mx-auto w-full max-w-screen-md ${hasBottomNavigation ? "pb-28" : "pb-0"}`}
        style={{
          paddingBottom: hasBottomNavigation ? "calc(7rem + var(--safe-bottom))" : 0,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={pageTransition}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {hasBottomNavigation && (
        <BottomNav onOpenMenu={() => setMenuOpen(true)} menuOpen={menuOpen} />
      )}
      {isReelRoute && <ReelBottomNav onOpenMenu={() => setMenuOpen(true)} menuOpen={menuOpen} />}
      <MenuSheet open={menuOpen} onOpenChange={setMenuOpen} />
      <CommunicationSheet open={communicationOpen} onOpenChange={setCommunicationOpen} />
      <InstallBanner />
      <UpdateBanner />
      <OnboardingSheet />
    </div>
  );
}
