import { Link, useRouterState } from "@tanstack/react-router";
import { Bluetooth, CircleGauge, Ellipsis, Globe2, MapPinned, UsersRound } from "lucide-react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/design/useReducedMotion";
import { cn } from "@/lib/utils";
import "./reel-bottom-nav.css";

type Tab = {
  key: "interactions" | "events" | "reel" | "geo-drops" | "more";
  to?: "/flash" | "/scan" | "/reel" | "/radar";
  icon: React.ComponentType<{ className?: string }>;
  label: string;
};

const TABS: Tab[] = [
  { key: "interactions", to: "/flash", icon: UsersRound, label: "Interactions" },
  { key: "events", to: "/scan", icon: Globe2, label: "Events" },
  { key: "reel", to: "/reel", icon: CircleGauge, label: "" },
  { key: "geo-drops", to: "/radar", icon: MapPinned, label: "Geo-Drops" },
  { key: "more", icon: Ellipsis, label: "More" },
];

interface BottomNavProps {
  onOpenMenu: () => void;
  menuOpen: boolean;
}

/**
 * Réel proximity navigation presentation.
 * Existing destinations remain unchanged; only this navigation's presentation
 * follows the approved proximity-screen reference.
 */
export function BottomNav({ onOpenMenu, menuOpen }: BottomNavProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const reduce = useReducedMotion();

  return (
    <nav
      aria-label="Primary navigation"
      className={cn("reel-bottom-nav pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center", pathname === "/reel" && "is-proximity") }
    >
      <ul className="reel-bottom-nav__bar pointer-events-auto flex w-full items-end justify-between">
        {TABS.map((tab) => {
          const isMenu = tab.key === "more";
          const isCenter = tab.key === "reel";
          const active = isMenu ? menuOpen : tab.to === pathname;
          const Icon = tab.icon;

          const inner = isCenter ? (
            <span className="reel-bottom-nav__center-wrap">
              <span className="reel-bottom-nav__center">
                <Icon aria-hidden="true" />
              </span>
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
              <span>{tab.label}</span>
            </span>
          );

          return (
            <li key={tab.key} className="reel-bottom-nav__slot">
              {isMenu ? (
                <button
                  type="button"
                  onClick={onOpenMenu}
                  aria-label="More"
                  aria-haspopup="dialog"
                  aria-expanded={menuOpen}
                  className="reel-bottom-nav__control"
                >
                  {inner}
                </button>
              ) : (
                <Link
                  to={tab.to!}
                  aria-label={isCenter ? "Temps Réel" : tab.label}
                  aria-current={active ? "page" : undefined}
                  className="reel-bottom-nav__control"
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
