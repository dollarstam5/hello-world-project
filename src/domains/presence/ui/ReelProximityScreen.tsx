import { useMemo, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Bluetooth, ChevronDown, CircleUserRound, ScanLine } from "lucide-react";
import "./reel-proximity.css";

export interface Person {
  id: string;
  name: string;
  avatarUrl: string | null;
  initials: string;
  angle: number;
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

function RingPerson({ person }: { person: Person }) {
  const position = useMemo(() => {
    const radians = (person.angle * Math.PI) / 180;
    return {
      left: `calc(50% + var(--reel-ring-radius) * ${Math.cos(radians)})`,
      top: `calc(50% + var(--reel-ring-radius) * ${Math.sin(radians)})`,
    } satisfies CSSProperties;
  }, [person.angle]);

  return (
    <div className="reel-ring-person" style={position}>
      <PersonAvatar person={person} />
      <span className="reel-ring-person__name">{person.name}</span>
    </div>
  );
}

export function ReelProximityScreen({ people }: ReelProximityScreenProps) {
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
        {visiblePeople.map((person) => <RingPerson key={person.id} person={person} />)}
      </div>

      <div className="reel-nearby">
        <p className="reel-nearby__title">All people nearby</p>
        <div className="reel-nearby__row">
          <div className="reel-nearby__avatars">
            {nearbyPeople.map((person) => <PersonAvatar key={person.id} person={person} size="small" />)}
            <span className="reel-nearby__count">+{additionalCount}</span>
          </div>
          <button className="reel-nearby__bluetooth" type="button" aria-label="Bluetooth">
            <Bluetooth aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
