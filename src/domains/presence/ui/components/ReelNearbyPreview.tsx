import { ChevronDown, UsersRound } from "lucide-react";
import { useI18n } from "@/lib/i18n/useI18n";
import type { useReelProximityController } from "@/domains/presence/model/useReelProximityController";
import { PersonAvatar } from "./ReelRadarIdentity";

type ReelController = ReturnType<typeof useReelProximityController>;

export function ReelNearbyPreview({ controller }: { controller: ReelController }) {
  const { t } = useI18n();
  const { discoveryEnabled, availablePeople, setPanel, openProfile } = controller;

  if (discoveryEnabled && availablePeople.length > 0) {
    return (
      <section className="reel-nearby-preview" aria-label={t("reel.ui.peopleNearby")}>
        <div className="reel-nearby-preview__header">
          <div>
            <p>{t("reel.ui.peopleNearby")}</p>
            <strong>{availablePeople.length}</strong>
          </div>
          <button type="button" onClick={() => setPanel("people")}>
            {t("reel.ui.allNearby")}
            <ChevronDown aria-hidden="true" />
          </button>
        </div>
        <div className="reel-nearby-preview__list">
          {availablePeople.slice(0, 3).map((person) => (
            <button
              type="button"
              className="reel-nearby-preview__person"
              key={person.id}
              onClick={() => openProfile(person)}
              aria-label={"Voir le profil de " + person.name}
            >
              <PersonAvatar person={person} size="small" />
              <span>
                <strong>{person.name}</strong>
                <small>{person.description || person.category || t("reel.ui.nearbyProfile")}</small>
              </span>
              <ChevronDown aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>
    );
  }

  if (discoveryEnabled) {
    return (
      <section className="reel-live-empty" aria-live="polite">
        <UsersRound aria-hidden="true" />
        <div>
          <strong>{t("reel.ui.noNearby")}</strong>
          <p>{t("reel.ui.noProfilesHint")}</p>
        </div>
      </section>
    );
  }

  return null;
}
