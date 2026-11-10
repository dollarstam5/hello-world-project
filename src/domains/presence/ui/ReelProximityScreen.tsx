import { useMemo, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Bluetooth, ChevronDown, CircleUserRound, ScanLine, X } from "lucide-react";
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
  const position = useMemo(() => {
    const radians = (person.angle * Math.PI) / 180;
    return {
      left: `calc(50% + var(--reel-ring-radius) * ${Math.cos(radians)})`,
      top: `calc(50% + var(--reel-ring-radius) * ${Math.sin(radians)})`,
    } satisfies CSSProperties;
  }, [person.angle]);

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
          <RingPerson key={person.id} person={person} onSelect={setSelectedPerson} />
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
                onClick={() => setSelectedPerson(person)}
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
            if (event.target === event.currentTarget) setSelectedPerson(null);
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
              onClick={() => setSelectedPerson(null)}
              aria-label="Fermer le profil"
            >
              <X aria-hidden="true" />
            </button>
            <PersonAvatar person={selectedPerson} size="me" />
            <h2 id="reel-profile-title">{selectedPerson.name}</h2>
            {selectedPerson.category && (
              <p className="reel-profile-sheet__category">{selectedPerson.category}</p>
            )}
            {selectedPerson.description && (
              <p className="reel-profile-sheet__description">{selectedPerson.description}</p>
            )}
            {(selectedPerson.locationLabel || selectedPerson.distanceLabel) && (
              <div className="reel-profile-sheet__details">
                {selectedPerson.locationLabel && <span>{selectedPerson.locationLabel}</span>}
                {selectedPerson.distanceLabel && <span>{selectedPerson.distanceLabel}</span>}
              </div>
            )}
            {!selectedPerson.description && !selectedPerson.category &&
              !selectedPerson.locationLabel && !selectedPerson.distanceLabel && (
                <p className="reel-profile-sheet__empty">
                  Ce profil ne contient pas encore d’autres informations.
                </p>
              )}
            <button
              type="button"
              className="reel-profile-sheet__primary"
              onClick={() => setSelectedPerson(null)}
            >
              Fermer
            </button>
          </section>
        </div>
      )}
    </section>
  );
}
