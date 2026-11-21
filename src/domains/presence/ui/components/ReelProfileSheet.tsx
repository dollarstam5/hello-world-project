import { RadioTower, X } from "lucide-react";
import type { Person } from "@/domains/presence/model/useReelProximityController";
import { PersonAvatar } from "./ReelRadarIdentity";
import { useI18n } from "@/lib/i18n/useI18n";
import { hapticFeedback } from "@/platform/device/haptics";

export function ReelProfileSheet({
  person,
  isPresenceActive,
  onClose,
  onSendBip,
}: {
  person: Person | null;
  isPresenceActive: boolean;
  onClose: () => void;
  onSendBip: () => void;
}) {
  const { t } = useI18n();
  if (!person) return null;

  return (
    <div
      className="reel-profile-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
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
          onClick={onClose}
          aria-label={t("reel.ui.closeProfile")}
        >
          <X aria-hidden="true" />
        </button>
        <PersonAvatar person={person} size="me" />
        <h2 id="reel-profile-title">{person.name}</h2>
        {person.category && <p className="reel-profile-sheet__category">{person.category}</p>}
        {person.distanceLabel && (
          <p className="reel-profile-sheet__distance">{person.distanceLabel}</p>
        )}
        {person.description ? (
          <p className="reel-profile-sheet__description">{person.description}</p>
        ) : (
          <p className="reel-profile-sheet__empty">{t("reel.ui.noExtraProfile")}</p>
        )}
        {person.locationLabel && (
          <div className="reel-profile-sheet__details">
            <span>{person.locationLabel}</span>
          </div>
        )}
        {isPresenceActive && (
          <button type="button" className="reel-profile-sheet__primary" onClick={() => { hapticFeedback.pulse(); onSendBip(); }}>
            <RadioTower aria-hidden="true" /> Faire signe
          </button>
        )}
      </section>
    </div>
  );
}
