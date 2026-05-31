import { useEffect, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { BottomNav } from "./BottomNav";
import { MenuSheet } from "./MenuSheet";
import { useExperienceBoot } from "@/lib/experience/orchestrator";
import { OfflineBanner } from "@/components/experience/OfflineBanner";
import { AILayer } from "@/components/experience/AILayer";
import { OnboardingSheet } from "@/components/experience/OnboardingSheet";

/**
 * AppShell — single mount-point that boots foundation services
 * (theme, i18n, onboarding hydration) and provides the calm canvas:
 *  - global navigation (floating bottom nav + menu sheet)
 *  - ambient AI layer
 *  - offline awareness
 *  - first-run onboarding sheet
 *
 * Pages render through children (root <Outlet />).
 */
export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useExperienceBoot();

  // Close menu on route change for clean continuity.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="relative min-h-dvh bg-background text-foreground antialiased">
      <OfflineBanner />
      <main id="main" className="mx-auto w-full max-w-screen-md pb-28">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <AILayer />
      <BottomNav onOpenMenu={() => setMenuOpen(true)} menuOpen={menuOpen} />
      <MenuSheet open={menuOpen} onOpenChange={setMenuOpen} />
      <OnboardingSheet />
    </div>
  );
}
