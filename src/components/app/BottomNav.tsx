import { Link, useRouterState } from "@tanstack/react-router";
import { Zap, ScanLine, RadioTower, Radar, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/useI18n";
import { useReducedMotion } from "@/lib/design/useReducedMotion";
import { cn } from "@/lib/utils";
import "./reel-bottom-nav.css";

type Tab = {
  key: "flash" | "scan" | "reel" | "radar" | "menu";
  to?: "/flash" | "/scan" | "/reel" | "/radar";
  icon: React.ComponentType<{ className?: string }>;
  labelKey: "nav.flash" | "nav.scan" | "nav.reel" | "nav.radar" | "nav.menu";
};

const TABS: Tab[] = [
  { key: "flash", to: "/flash", icon: Zap, labelKey: "nav.flash" },
  { key: "scan", to: "/scan", icon: ScanLine, labelKey: "nav.scan" },
  { key: "reel", to: "/reel", icon: RadioTower, labelKey: "nav.reel" },
  { key: "radar", to: "/radar", icon: Radar, labelKey: "nav.radar" },
  { key: "menu", icon: LayoutGrid, labelKey: "nav.menu" },
];

interface BottomNavProps {
  onOpenMenu: () => void;
  menuOpen: boolean;
}

/** Five-point navigation with Réel centered; all existing destinations are preserved. */
export function BottomNav({ onOpenMenu, menuOpen }: BottomNavProps) {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const reduce = useReducedMotion();

  return (
    <nav
      aria-label={t("nav.primary")}
      className={cn(
        "reel-bottom-nav pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center",
        pathname === "/reel" && "is-proximity",
      )}
    >
      <ul className="reel-bottom-nav__bar pointer-events-auto flex w-full items-end justify-between">
        {TABS.map((tab) => {
          const isMenu = tab.key === "menu";
          const isCenter = tab.key === "reel";
          const active = isMenu ? menuOpen : tab.to === pathname;
          const Icon = tab.icon;
          const label = t(tab.labelKey);

          const inner = isCenter ? (
            <span className="reel-bottom-nav__center-wrap">
              <span className="reel-bottom-nav__center">
                <Icon aria-hidden="true" />
              </span>
              <span className="reel-bottom-nav__center-label">{label}</span>
            </span>
          ) : (
            <span className={cn("reel-bottom-nav__item", active && "is-active")}>
              {active &&
                (reduce ? (
                  <span className="reel-bottom-nav__active" aria-hidden="true" />
                ) : (
                  <motion.span
                    layoutId="reel-nav-active"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="reel-bottom-nav__active"
                    aria-hidden="true"
                  />
                ))}
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </span>
          );

          return (
            <li key={tab.key} className="reel-bottom-nav__slot">
              {isMenu ? (
                <button
                  type="button"
                  onClick={onOpenMenu}
                  aria-label={t("nav.open_menu")}
                  aria-haspopup="dialog"
                  aria-expanded={menuOpen}
                  className="reel-bottom-nav__control min-h-12 min-w-12"
                >
                  {inner}
                </button>
              ) : (
                <Link
                  to={tab.to!}
                  aria-label={label}
                  aria-current={active ? "page" : undefined}
                  className="reel-bottom-nav__control min-h-12 min-w-12"
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
