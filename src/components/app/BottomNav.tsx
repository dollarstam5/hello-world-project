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
  { key: "reel", to: "/", icon: UsersRound, labelKey: "nav.reel" },
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
 * Floating primary navigation for Réel, Flash, Scan and Radar.
 * The Menu button opens the secondary navigation sheet.
 * This component is presentation-only and does not own domain behavior.
 */
export function BottomNav({ onOpenMenu, menuOpen }: BottomNavProps) {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const reduce = useReducedMotion();

  return (
    <nav
      aria-label={t("nav.primary")}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[max(env(safe-area-inset-bottom),0.75rem)]"
    >
      <ul className="glass pointer-events-auto flex w-[min(100%,24rem)] items-end justify-between gap-1 rounded-full border border-border-soft px-2 py-1.5 shadow-[var(--shadow-float)]">
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
                  "flex h-12 w-12 items-center justify-center rounded-full border transition-colors motion-safe:transition-transform motion-safe:hover:scale-105 motion-safe:active:scale-95",
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-[var(--glow-soft)]"
                    : "border-primary/30 bg-primary-soft text-primary",
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span
                className={cn(
                  "text-[11px] font-medium leading-tight",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </span>
          ) : (
            <span
              className={cn(
                "relative flex min-h-12 min-w-12 flex-col items-center justify-center gap-0.5 rounded-full px-1 py-1.5 transition-colors",
                "text-muted-foreground hover:text-foreground",
                active && "text-primary-foreground",
              )}
            >
              {active &&
                (reduce ? (
                  <span className="absolute inset-0 rounded-full bg-primary" aria-hidden="true" />
                ) : (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                ))}
              <Icon className="relative h-5 w-5" aria-hidden="true" />
              <span className="relative text-[11px] font-medium leading-tight">{label}</span>
            </span>
          );

          return (
            <li key={tab.key} className="flex min-w-0 flex-1 justify-center">
              {isMenu ? (
                <button
                  type="button"
                  onClick={onOpenMenu}
                  aria-label={t("nav.open_menu")}
                  aria-haspopup="dialog"
                  aria-expanded={menuOpen}
                  className="flex min-h-12 min-w-12 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {inner}
                </button>
              ) : (
                <Link
                  to={tab.to!}
                  aria-label={label}
                  aria-current={active ? "page" : undefined}
                  className="flex min-h-12 min-w-12 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
