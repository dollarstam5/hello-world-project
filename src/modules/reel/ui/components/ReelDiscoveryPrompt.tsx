import { MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n/useI18n";
import type { useReelProximityController } from "@/domains/presence/model/useReelProximityController";

type ReelController = ReturnType<typeof useReelProximityController>;

export function ReelDiscoveryPrompt({ controller }: { controller: ReelController }) {
  const { t } = useI18n();
  const {
    discoveryEnabled,
    discoveryAccess,
    canUseMemberReel,
    access,
    locationMessage,
    requestDiscovery,
    guestSessionLoading,
    beginGuestSession,
    guestSessionMessage,
    ignoreLocation,
  } = controller;
  if (discoveryEnabled) return null;

  return (
    <section
      className={"reel-location-card reel-location-card--" + discoveryAccess}
      aria-label={t("reel.ui.location")}
    >
      <div className="reel-location-card__icon">
        <MapPin aria-hidden="true" />
      </div>
      <div className="reel-location-card__copy">
        <strong>
          {discoveryAccess === "prompt" && !canUseMemberReel
            ? access.mode === "guest"
              ? t("reel.ui.guestTitle")
              : access.mode === "visitor"
                ? t("reel.ui.visitorTitle")
                : t("reel.ui.noAccessTitle")
            : discoveryAccess === "prompt"
              ? t("reel.ui.promptTitle")
              : discoveryAccess === "requesting"
                ? t("reel.ui.requestingTitle")
                : discoveryAccess === "denied"
                  ? t("reel.ui.privateTitle")
                  : t("reel.ui.calmTitle")}
        </strong>
        <p>
          {discoveryAccess === "prompt" && !canUseMemberReel
            ? access.mode === "guest"
              ? t("reel.ui.guestDescription")
              : access.mode === "visitor"
                ? t("reel.ui.visitorDescription")
                : t("reel.ui.noAccessDescription")
            : discoveryAccess === "prompt"
              ? t("reel.ui.permissionDescription")
              : discoveryAccess === "requesting"
                ? t("reel.ui.waitingDescription")
                : locationMessage || t("reel.ui.locationPausedDescription")}
        </p>
        <div className="reel-location-card__actions">
          {(canUseMemberReel || access.mode === "guest") &&
            (discoveryAccess === "prompt" ||
              discoveryAccess === "ignored" ||
              discoveryAccess === "denied") && (
              <button
                type="button"
                className="reel-location-card__primary"
                onClick={() => void requestDiscovery()}
              >
                {discoveryAccess === "prompt" ? t("reel.ui.seeNearby") : t("reel.ui.retry")}
              </button>
            )}
          {access.mode === "visitor" && (
            <button
              type="button"
              className="reel-location-card__primary"
              disabled={guestSessionLoading}
              onClick={() => void beginGuestSession()}
            >
              {guestSessionLoading ? t("reel.ui.guestLoading") : t("reel.ui.guestContinue")}
            </button>
          )}
          {guestSessionMessage && <p role="status">{guestSessionMessage}</p>}
          {discoveryAccess === "prompt" && (
            <button
              type="button"
              className="reel-location-card__secondary"
              onClick={ignoreLocation}
            >
              {t("reel.ui.notNow")}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
