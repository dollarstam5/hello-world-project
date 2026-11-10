import { Link } from "@tanstack/react-router";
import { Ellipsis, Globe2, MapPinned, RadioTower, UsersRound } from "lucide-react";
import "./reel-bottom-nav.css";

interface ReelBottomNavProps {
  onOpenMenu: () => void;
  menuOpen: boolean;
}

/** Navigation propre à l'écran Réel, calquée sur la barre de la référence visuelle. */
export function ReelBottomNav({ onOpenMenu, menuOpen }: ReelBottomNavProps) {
  return (
    <nav className="reel-page-nav" aria-label="Temps Réel navigation">
      <ul className="reel-page-nav__bar">
        <li>
          <Link to="/flash" className="reel-page-nav__item" aria-label="Interactions">
            <UsersRound aria-hidden="true" />
            <span>Interactions</span>
          </Link>
        </li>
        <li>
          <Link to="/scan" className="reel-page-nav__item" aria-label="Events">
            <Globe2 aria-hidden="true" />
            <span>Events</span>
          </Link>
        </li>
        <li className="reel-page-nav__center-slot">
          <Link
            to="/reel"
            className="reel-page-nav__center"
            aria-current="page"
            aria-label="Temps Réel"
          >
            <RadioTower aria-hidden="true" />
          </Link>
        </li>
        <li>
          <Link to="/radar" className="reel-page-nav__item" aria-label="Geo-Drops">
            <MapPinned aria-hidden="true" />
            <span>Geo-Drops</span>
          </Link>
        </li>
        <li>
          <button
            type="button"
            className="reel-page-nav__item"
            onClick={onOpenMenu}
            aria-label="More"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
          >
            <Ellipsis aria-hidden="true" />
            <span>More</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
