import { useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Bell, Bluetooth, ChevronDown, CircleUserRound, ScanLine, X } from "lucide-react";
import "./reel-proximity.css";

export interface Person {
  id: string;
  name: string;
  avatarUrl: string | null;
  initials: string;
  angle: number;
  description?: string | null;
  category?: string | null;
  locationLabel?: string | null;
  distanceLabel?: string | null;
}

interface ReelProximityScreenProps {
  people: Person[];
}

const MAX_RING_PEOPLE = 9;

function PersonAvatar({ person, size = "person" }: { person: Person; size?: "person" | "small" | "me" }) {
  const hasImage = Boolean(person.avatarUrl);

  return (
    <span className={`reel-avatar reel-avatar--${size}`} aria-label={person.name}>
      {hasImage ? (
        <img
          src={person.avatarUrl ?? undefined}
          alt=""
          aria-hidden="true"
          onError={(event) => {
            event.currentTarget.hidden = true;
            event.currentTarget.parentElement?.classList.add("reel-avatar--failed");
          }}
        />
      ) : person.initials ? (
        <span className="reel-avatar__initials" aria-hidden="true">{person.initials}</span>
      ) : (
        <CircleUserRound className="reel-avatar__silhouette" aria-hidden="true" />
      )}
    </span>
  );
}

function RingPerson({ person, onSelect }: { person: Person; onSelect: (person: Person) => void }) {
  // Place each profile on a percentage-based orbit so the radar stays
  // correctly proportioned on narrow phones and larger screens.
  const radians = ((Number.isFinite(person.angle) ? person.angle : 0) * Math.PI) / 180;
  const orbit = 39;
  const position = {
    left: `${50 + orbit * Math.cos(radians)}%`,
    top: `${50 + orbit * Math.sin(radians)}%`,
  } satisfies CSSProperties;

  return (
    <button
      type="button"
      className="reel-ring-person"
      style={position}
      onClick={() => onSelect(person)}
      aria-label={`Voir le profil de ${person.name}`}
    >
      <PersonAvatar person={person} />
      <span className="reel-ring-person__name">{person.name}</span>
    </button>
  );
}

export function ReelProximityScreen({ people }: ReelProximityScreenProps) {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showFullProfile, setShowFullProfile] = useState(false);

  const openProfile = (person: Person) => {
    setSelectedPerson(person);
    setShowFullProfile(false);
  };

  const closeProfile = () => {
    setSelectedPerson(null);
    setShowFullProfile(false);
  };
  const visiblePeople = people.slice(0, MAX_RING_PEOPLE);
  const nearbyPeople = people.slice(0, 3);
  const additionalCount = Math.max(0, people.length - 3);

  return (
    <section className="reel-proximity" aria-label="Temps Réel de proximité">
      <header className="reel-proximity__header">
        <Link
          to="/scan"
          className="reel-proximity__header-action"
          aria-label="Ouvrir Scan"
        >
          <ScanLine aria-hidden="true" />
        </Link>
        <div className="reel-proximity__heading">
          <h1>TEMPS RÉEL</h1>
          <ChevronDown aria-hidden="true" />
        </div>
        <span
          className="reel-proximity__header-action"
          role="img"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell aria-hidden="true" />
        </span>
      </header>
      <div className="reel-proximity__map" aria-hidden="true" />
      <div className="reel-proximity__radar">
        <div className="reel-radar__outer-halo" aria-hidden="true" />
        <div className="reel-radar__outer-ring" aria-hidden="true" />
        <div className="reel-radar__inner-ring" aria-hidden="true" />
        <div className="reel-radar__core">
          <div className="reel-radar__me">
            <span className="reel-radar__me-avatar">
              <CircleUserRound aria-hidden="true" />
            </span>
            <span className="reel-radar__me-label">Moi</span>
          </div>
        </div>
        {visiblePeople.map((person) => (
          <RingPerson key={person.id} person={person} onSelect={openProfile} />
        ))}
      </div>

      <div className="reel-nearby">
        <p className="reel-nearby__title">All people nearby</p>
        <div className="reel-nearby__row">
          <div className="reel-nearby__avatars">
            {nearbyPeople.map((person) => (
              <button
                key={person.id}
                type="button"
                className="reel-nearby__profile"
                onClick={() => openProfile(person)}
                aria-label={`Voir le profil de ${person.name}`}
              >
                <PersonAvatar person={person} size="small" />
              </button>
            ))}
            <span className="reel-nearby__count">+{additionalCount}</span>
          </div>
          <button className="reel-nearby__bluetooth" type="button" aria-label="Bluetooth">
            <Bluetooth aria-hidden="true" />
          </button>
        </div>
      </div>

      {selectedPerson && (
        <div
          className="reel-profile-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeProfile();
          }}
        >
          <section
            className="reel-profile-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reel-profile-title"
          >
            <button
              type="button"
              className="reel-profile-sheet__close"
              onClick={closeProfile}
              aria-label="Fermer le profil"
            >
              <X aria-hidden="true" />
            </button>
            {showFullProfile && (
              <button
                type="button"
                className="reel-profile-sheet__back"
                onClick={() => setShowFullProfile(false)}
              >
                <ArrowLeft aria-hidden="true" />
                Retour à l’aperçu
              </button>
            )}
            <PersonAvatar person={selectedPerson} size="me" />
            <h2 id="reel-profile-title">{selectedPerson.name}</h2>
            {selectedPerson.category && (
              <p className="reel-profile-sheet__category">{selectedPerson.category}</p>
            )}
            {selectedPerson.distanceLabel && (
              <p className="reel-profile-sheet__distance">{selectedPerson.distanceLabel}</p>
            )}
            {showFullProfile ? (
              <>
                {selectedPerson.description && (
                  <p className="reel-profile-sheet__description">{selectedPerson.description}</p>
                )}
                {(selectedPerson.locationLabel || selectedPerson.distanceLabel) && (
                  <div className="reel-profile-sheet__details">
                    {selectedPerson.locationLabel && <span>{selectedPerson.locationLabel}</span>}
                    {selectedPerson.distanceLabel && <span>{selectedPerson.distanceLabel}</span>}
                  </div>
                )}
                {!selectedPerson.description && !selectedPerson.locationLabel && (
                  <p className="reel-profile-sheet__empty">
                    Cette personne n’a pas encore ajouté d’autres informations à son profil.
                  </p>
                )}
              </>
            ) : (
              <p className="reel-profile-sheet__description">
                {selectedPerson.description
                  ? selectedPerson.description
                  : "Consultez les informations disponibles sur ce profil."}
              </p>
            )}
            {!showFullProfile ? (
              <button
                type="button"
                className="reel-profile-sheet__primary"
                onClick={() => setShowFullProfile(true)}
              >
                Voir la fiche complète
              </button>
            ) : (
              <button
                type="button"
                className="reel-profile-sheet__primary"
                onClick={closeProfile}
              >
                Fermer
              </button>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
