import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { CircleUserRound, Zap, User, MapPin } from "lucide-react";
import type { Person } from "@/modules/reel/model/useReelProximityController";
import { haptic } from "@/platform/device/haptics";
import { useI18n } from "@/lib/i18n/useI18n";

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

export function RingPerson({
  person,
  index = 0,
  onSelect,
  onQuickBip,
}: {
  person: Person;
  index?: number;
  onSelect: (person: Person) => void;
  onQuickBip?: (person: Person) => void;
}) {
  const { t } = useI18n();
  const [showPeek, setShowPeek] = useState(false);
  const peekRef = useRef<HTMLDivElement>(null);
  const orbitTiers = [32, 39, 44];
  const orbit = orbitTiers[index % orbitTiers.length] ?? 39;
  const radians = ((Number.isFinite(person.angle) ? person.angle : 0) * Math.PI) / 180;
  const position = {
    left: `${50 + orbit * Math.cos(radians)}%`,
    top: `${50 + orbit * Math.sin(radians)}%`,
    animationDelay: `${(index * 0.45) % 2.5}s`,
  } as CSSProperties;

  useEffect(() => {
    if (!showPeek) return;
    const handleOutside = (event: PointerEvent) => {
      if (peekRef.current && !peekRef.current.contains(event.target as Node)) setShowPeek(false);
    };
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, [showPeek]);

  const handleAvatarClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    haptic.tap();
    setShowPeek((open) => !open);
  };
  const handleOpenProfile = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowPeek(false);
    onSelect(person);
  };
  const handleQuickBip = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    haptic.pulse();
    setShowPeek(false);
    if (onQuickBip) {
      onQuickBip(person);
    } else {
      onSelect(person);
    }
  };
  const isGuest = person.actorKind === "guest";

  return (
    <div
      ref={peekRef}
      className={`reel-ring-person reel-ring-person--floating ${showPeek ? "is-peek-open" : ""}`}
      style={position}
    >
      <button
        type="button"
        className={`reel-ring-person__btn ${isGuest ? "reel-ring-person__btn--guest" : "reel-ring-person__btn--member"}`}
        onClick={handleAvatarClick}
        aria-expanded={showPeek}
        aria-label={`${t("reel.quickPeek.options")} ${person.name}`}
      >
        <PersonAvatar person={person} />
        <span className="reel-ring-person__status-dot" aria-hidden="true" />
      </button>
      <span className="reel-ring-person__name">{person.name}</span>
      {showPeek && (
        <div
          className="reel-person-peek"
          role="dialog"
          aria-label={`${t("reel.quickPeek.title")} ${person.name}`}
        >
          <div className="reel-person-peek__header">
            <strong>{person.name}</strong>
            <span className={`reel-person-peek__badge ${isGuest ? "is-guest" : "is-member"}`}>
              {isGuest ? t("reel.quickPeek.guest") : t("reel.quickPeek.member")}
            </span>
          </div>
          {person.locationLabel && (
            <p className="reel-person-peek__loc">
              <MapPin size={11} aria-hidden="true" /> {person.locationLabel}
            </p>
          )}
          {person.description && <p className="reel-person-peek__desc">{person.description}</p>}
          <div className="reel-person-peek__actions">
            <button type="button" className="reel-person-peek__bip-btn" onClick={handleQuickBip}>
              <Zap size={13} aria-hidden="true" /> {t("reel.quickPeek.bip")}
            </button>
            <button
              type="button"
              className="reel-person-peek__more-btn"
              onClick={handleOpenProfile}
              aria-label={t("reel.quickPeek.fullProfile")}
            >
              <User size={13} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
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
