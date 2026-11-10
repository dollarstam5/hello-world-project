import { Link } from "@tanstack/react-router";
import { RadioTower, UsersRound, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n/useI18n";
import "./reel-bottom-nav.css";

/**
 * Navigation dédiée à l'écran Réel.
 * Elle est indépendante de la barre principale de l'application.
 * Les accès vers les autres moteurs conservent leurs destinations existantes.
 */
export function ReelBottomNav() {
  const { t } = useI18n();

  return (
    <nav className="reel-page-nav" aria-label="Navigation de Temps Réel">
      <Link className="reel-page-nav__side" to="/flash" aria-label={t("nav.flash")}>
        <Zap aria-hidden="true" />
        <span>{t("nav.flash")}</span>
      </Link>

      <Link className="reel-page-nav__side" to="/scan" aria-label={t("nav.scan")}>
        <UsersRound aria-hidden="true" />
        <span>{t("nav.scan")}</span>
      </Link>

      <Link className="reel-page-nav__home" to="/reel" aria-current="page" aria-label={t("nav.reel")}>
        <RadioTower aria-hidden="true" />
      </Link>
    </nav>
  );
}
