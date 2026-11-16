import { Link } from "@tanstack/react-router";
import {
  Bell,
  Bluetooth,
  CircleHelp,
  Eye,
  EyeOff,
  Home,
  RadioTower,
  SlidersHorizontal,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/useI18n";
import type { useReelProximityController } from "@/domains/presence/model/useReelProximityController";

type ReelController = ReturnType<typeof useReelProximityController>;

export function ReelHeader({
  controller,
  onOpenTour,
}: {
  controller: ReelController;
  onOpenTour: () => void;
}) {
  const { t } = useI18n();
  const {
    currentPresence,
    guestPresence,
    activityEnabled,
    openActivity,
    setPanel,
    discoveryEnabled,
    ignoreLocation,
    requestDiscovery,
    discoveryAccess,
    canUseMemberReel,
    access,
  } = controller;
  const isPresenceActive = Boolean(currentPresence || guestPresence);

  return (
    <header className="reel-proximity__header">
      <div className="reel-proximity__heading">
        <RadioTower aria-hidden="true" />
        <div className="reel-proximity__heading-copy">
          <h1>En direct</h1>
          <p>{t("reel.ui.screenLabel")}</p>
        </div>
        {isPresenceActive && <span className="reel-proximity__live-indicator" aria-hidden="true" />}
      </div>
      <nav className="reel-proximity__header-actions" aria-label={t("reel.ui.screenLabel")}>
        <Link
          to="/"
          className="reel-proximity__header-action"
          aria-label={t("reel.ui.home")}
          title={t("reel.ui.homeTitle")}
        >
          <Home aria-hidden="true" />
        </Link>
        <button
          type="button"
          className="reel-proximity__header-action reel-proximity__notification"
          onClick={() => openActivity("notifications")}
          disabled={!activityEnabled}
          aria-label={
            activityEnabled ? t("reel.ui.notifications") : t("reel.ui.notificationsPaused")
          }
          title={activityEnabled ? t("reel.ui.activity") : t("reel.ui.notificationsPausedShort")}
        >
          <Bell aria-hidden="true" />
        </button>
        <button
          type="button"
          className="reel-proximity__header-action"
          onClick={() => setPanel("settings")}
          aria-label={t("reel.ui.preferences")}
          title={t("reel.ui.preferencesTitle")}
        >
          <SlidersHorizontal aria-hidden="true" />
        </button>
        <button
          type="button"
          className={
            "reel-proximity__header-action reel-proximity__discovery-toggle" +
            (discoveryEnabled ? " is-active" : "")
          }
          onClick={() => {
            if (discoveryEnabled) ignoreLocation();
            else void requestDiscovery();
          }}
          disabled={
            discoveryAccess === "requesting" || (!canUseMemberReel && access.mode !== "guest")
          }
          aria-pressed={discoveryEnabled}
          aria-label={
            discoveryEnabled ? t("reel.ui.disableDiscovery") : t("reel.ui.enableDiscovery")
          }
          title={discoveryEnabled ? t("reel.ui.disableDiscovery") : t("reel.ui.enableDiscovery")}
        >
          {discoveryEnabled ? <Eye aria-hidden="true" /> : <EyeOff aria-hidden="true" />}
        </button>
        <button
          type="button"
          className="reel-proximity__header-action reel-proximity__tour-trigger"
          onClick={onOpenTour}
          aria-label={t("reel.ui.tour.open")}
          title={t("reel.ui.tour.open")}
        >
          <CircleHelp aria-hidden="true" />
        </button>
        <button
          type="button"
          className="reel-proximity__header-action reel-proximity__bluetooth"
          disabled
          aria-label={t("reel.ui.bluetooth")}
          title={t("reel.ui.bluetoothTitle")}
        >
          <Bluetooth aria-hidden="true" />
          <span className="reel-proximity__bluetooth-label">V3</span>
        </button>
      </nav>
    </header>
  );
}
