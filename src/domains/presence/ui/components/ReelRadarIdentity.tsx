import { type CSSProperties } from "react";
import { CircleUserRound } from "lucide-react";
import type { Person } from "@/domains/presence/model/useReelProximityController";

export function PersonAvatar({
  person,
  size = "person",
}: {
  person: Person;
  size?: "person" | "small" | "me";
}) {
  return (
    <span
      className={`reel-avatar reel-avatar--${size} ${person.avatarKey ? `reel-avatar--${person.avatarKey}` : ""}`}
      aria-label={person.name}
    >
      {person.avatarUrl ? (
        <img
          src={person.avatarUrl}
          alt=""
          aria-hidden="true"
          onError={(event) => {
            event.currentTarget.hidden = true;
            event.currentTarget.parentElement?.classList.add("reel-avatar--failed");
          }}
        />
      ) : person.initials ? (
        <span className="reel-avatar__initials" aria-hidden="true">
          {person.initials}
        </span>
      ) : (
        <CircleUserRound className="reel-avatar__silhouette" aria-hidden="true" />
      )}
    </span>
  );
}

export function RingPerson({ person, onSelect }: { person: Person; onSelect: (person: Person) => void }) {
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

export function SelfRadarIdentity({
  accessMode,
  guestAvatarKey,
  guestDisplayName,
  memberAvatarUrl,
  meLabel,
}: {
  accessMode: "member" | "guest" | "visitor";
  guestAvatarKey: string;
  guestDisplayName: string;
  memberAvatarUrl: string | null;
  meLabel: string;
}) {
  const guestName = guestDisplayName.trim();
  const initials = guestName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase();

  return (
    <>
      <span
        className={`reel-radar__me-avatar${accessMode === "guest" ? ` reel-avatar--${guestAvatarKey}` : ""}`}
        aria-hidden="true"
      >
        {accessMode === "guest" && guestName ? (
          <span className="reel-avatar__initials">{initials}</span>
        ) : (
          <CircleUserRound />
        )}
        {accessMode === "member" && memberAvatarUrl ? (
          <img
            src={memberAvatarUrl}
            alt=""
            aria-hidden="true"
            onError={(event) => {
              event.currentTarget.hidden = true;
            }}
          />
        ) : null}
      </span>
      <span className="reel-radar__me-label">
        {accessMode === "guest" && guestName ? guestName : meLabel}
      </span>
    </>
  );
}
