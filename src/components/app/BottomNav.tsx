import { Link, useRouterState } from "@tanstack/react-router";
import { UsersRound, Zap, ScanLine, Radar, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/useI18n";
import { useReducedMotion } from "@/lib/design/useReducedMotion";
import { cn } from "@/lib/utils";

type Tab = {
  key: "reel" | "flash" | "scan" | "radar" | "menu";
  to?: string;
  icon: React.ComponentType<{ className?: string }>;
  labelKey: "nav.reel" | "nav.flash" | "nav.scan" | "nav.radar" | "nav.menu";
};

const TABS: Tab[] = [
  { key: "reel", to: "/reel", icon: UsersRound, labelKey: "nav.reel" },
  { key: "flash", to: "/flash", icon: Zap, labelKey: "nav.flash" },
  { key: "scan", to: "/scan", icon: ScanLine, labelKey: "nav.scan" },
  { key: "radar", to: "/radar", icon: Radar, labelKey: "nav.radar" },
  { key: "menu", icon: LayoutGrid, labelKey: "nav.menu" },
];

interface BottomNavProps {
  onOpenMenu: () => void;
  menuOpen: boolean;
}

/**
 * Floating bottom navigation — calm, glassy, breathing.
 * Réel, Flash, Scan, Radar + a 2x2 grid that opens the MenuSheet.
 * 2026 pattern: icon + visible label, Scan elevated as the center action.
 * Pure presentation; no business logic.
 */
export function BottomNav({ onOpenMenu, menuOpen }: BottomNavProps) {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const reduce = useReducedMotion();

  return (
    <nav
      aria-label={t("nav.primary")}
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[max(env(safe-area-inset-bottom),0.75rem)] pointer-events-none"
    >
      <ul
        className="glass pointer-events-auto flex items-end gap-1 rounded-full border border-border-soft px-2 py-1.5 shadow-[var(--shadow-float)]"
      >
        {TABS.map((tab) => {
          const isMenu = tab.key === "menu";
          const isCenter = tab.key === "scan";
          const active = isMenu ? menuOpen : tab.to === pathname;
          const Icon = tab.icon;
          const label = t(tab.labelKey);

          const inner = isCenter ? (
            <span className="flex flex-col items-center gap-0.5">
              <span
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--glow-soft)] transition-transform",
                  "hover:scale-105 active:scale-95",
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium leading-none",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </span>
          ) : (
            <span
              className={cn(
                "relative flex min-w-14 flex-col items-center gap-0.5 rounded-full px-3 py-1.5 transition-colors",
                "text-muted-foreground hover:text-foreground",
                active && "text-primary-foreground",
              )}
            >
              {active &&
                (reduce ? (
                  <span className="absolute inset-0 rounded-full bg-primary" aria-hidden />
                ) : (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-primary"
                    aria-hidden
                  />
                ))}
              <Icon className="relative h-5 w-5" aria-hidden />
              <span className="relative text-[10px] font-medium leading-none">{label}</span>
            </span>
          );

          return (
            <li key={tab.key}>
              {isMenu ? (
                <button
                  type="button"
                  onClick={onOpenMenu}
                  aria-label={t("nav.open_menu")}
                  aria-haspopup="dialog"
                  aria-expanded={menuOpen}
                  className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {inner}
                </button>
              ) : (
                <Link
                  to={tab.to!}
                  aria-label={label}
                  aria-current={active ? "page" : undefined}
                  className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
