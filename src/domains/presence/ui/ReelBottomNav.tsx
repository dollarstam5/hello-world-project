import { Link } from "@tanstack/react-router";
import { LayoutGrid, RadioTower, Radar, ScanLine, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n/useI18n";
import "./reel-bottom-nav.css";

interface ReelBottomNavProps {
  onOpenMenu: () => void;
  menuOpen: boolean;
}

/** Navigation propre à l'écran Réel, calquée sur la barre de la référence visuelle. */
export function ReelBottomNav({ onOpenMenu, menuOpen }: ReelBottomNavProps) {
  const { t } = useI18n();

  return (
    <nav className="reel-page-nav" aria-label={t("nav.primary")}>
      <ul className="reel-page-nav__bar">
        <li>
          <Link to="/flash" className="reel-page-nav__item" aria-label={t("nav.flash")}>
            <Zap aria-hidden="true" />
            <span>{t("nav.flash")}</span>
          </Link>
        </li>
        <li>
          <Link to="/scan" className="reel-page-nav__item" aria-label={t("nav.scan")}>
            <ScanLine aria-hidden="true" />
            <span>{t("nav.scan")}</span>
          </Link>
        </li>
        <li className="reel-page-nav__center-slot">
          <Link
            to="/reel"
            className="reel-page-nav__center"
            aria-current="page"
            aria-label={t("nav.reel")}
          >
            <RadioTower aria-hidden="true" />
          </Link>
        </li>
        <li>
          <Link to="/radar" className="reel-page-nav__item" aria-label={t("nav.radar")}>
            <Radar aria-hidden="true" />
            <span>{t("nav.radar")}</span>
          </Link>
        </li>
        <li>
          <button
            type="button"
            className="reel-page-nav__item"
            onClick={onOpenMenu}
            aria-label={t("nav.open_menu")}
            title={t("nav.menu")}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
          >
            <LayoutGrid aria-hidden="true" />
            <span>{t("nav.menu")}</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
