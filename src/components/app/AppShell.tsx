import { useEffect, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { initTheme } from "@/lib/app/theme";
import { initI18n } from "@/lib/i18n/useI18n";
import { BottomNav } from "./BottomNav";
import { MenuSheet } from "./MenuSheet";

/**
 * AppShell — the single mount-point that boots foundation services
 * (theme, i18n) and provides the calm canvas + global navigation
 * (floating bottom nav + menu sheet) for every page.
 *
 * Pages render through children (root <Outlet />). They should NOT
 * add their own bottom nav or full-page wrapper.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    initTheme();
    initI18n();
  }, []);

  // Close menu on route change for clean continuity.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="relative min-h-dvh bg-background text-foreground antialiased">
      <main
        id="main"
        className="mx-auto w-full max-w-screen-md pb-28"
        // pb-28 keeps content above the floating nav.
      >
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

      <BottomNav onOpenMenu={() => setMenuOpen(true)} menuOpen={menuOpen} />
      <MenuSheet open={menuOpen} onOpenChange={setMenuOpen} />
    </div>
  );
}
