import { UsersRound } from "lucide-react";
import { useI18n } from "@/lib/i18n/useI18n";
import { useReelProximityController } from "@/domains/presence/model/useReelProximityController";
import { PersonAvatar } from "./ReelRadarIdentity";

type ReelController = ReturnType<typeof useReelProximityController>;

export function ReelPeoplePanel({ controller }: { controller: ReelController }) {
  const { t } = useI18n();
  const { discoveryEnabled, availablePeople, openProfile } = controller;

  return (
    <>
      <div className="reel-panel__eyebrow">
        <UsersRound aria-hidden="true" /> {t("reel.ui.peopleNearby")}
      </div>
      <h2 id="reel-panel-title">{t("reel.ui.allNearby")}</h2>
      {discoveryEnabled && availablePeople.length ? (
        <div className="reel-people-list">
          {availablePeople.map((person) => (
            <button
              type="button"
              className="reel-people-list__item"
              key={person.id}
              onClick={() => openProfile(person)}
            >
              <PersonAvatar person={person} size="small" />
              <span>
                <strong>{person.name}</strong>
                <small>
                  {person.description || person.category || t("reel.ui.nearbyProfile")}
                </small>
              </span>
              {person.distanceLabel && (
                <small className="reel-people-list__distance">{person.distanceLabel}</small>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="reel-panel__empty">
          <UsersRound aria-hidden="true" />
          <strong>{t("reel.ui.noPeople")}</strong>
          <span>{t("reel.ui.noProfilesHint")}</span>
        </div>
      )}
    </>
  );
}
