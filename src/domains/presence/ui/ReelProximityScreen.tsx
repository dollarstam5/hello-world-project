import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n/useI18n";
import {
  Bell,
  Bluetooth,
  ChevronDown,
  CircleHelp,
  Globe,
  History,
  Home,
  Eye,
  EyeOff,
  MapPin,
  RadioTower,
  SlidersHorizontal,
  UsersRound,
  X,
} from "lucide-react";
import {
  useReelProximityController,
} from "@/domains/presence/model/useReelProximityController";
import { PersonAvatar, RingPerson, SelfRadarIdentity } from "./components/ReelRadarIdentity";
import { ReelGuidedTour } from "./components/ReelGuidedTour";
import { ReelSettingsHelp } from "./components/ReelSettingsHelp";
import { ReelProfileSheet } from "./components/ReelProfileSheet";
import { ReelSettingsPanel } from "./components/ReelSettingsPanel";
import { ReelActivityPanel } from "./components/ReelActivityPanel";
import "./reel-proximity.css";

const DURATIONS = ["30 min", "1 h", "2 h", "3 h", "6 h", "12 h", "24 h"];
const RADII = ["10 m", "25 m", "50 m", "100 m", "1 km"];
export function ReelProximityScreen() {
  const { t } = useI18n();
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [settingsHelpOpen, setSettingsHelpOpen] = useState(false);
  useEffect(() => {
    try {
      setTourOpen(window.localStorage.getItem("vitalis-reel-tour-seen") !== "true");
    } catch {
      setTourOpen(true);
    }
  }, []);
  const closeTour = () => {
    setTourOpen(false);
    try {
      window.localStorage.setItem("vitalis-reel-tour-seen", "true");
    } catch {
      // The guide remains dismissible for this visit when storage is unavailable.
    }
  };
  const openTour = () => {
    setTourStep(0);
    setTourOpen(true);
  };
  const controller = useReelProximityController();
  const {
    access,
    memberAvatarUrl,
    discoveryAccess,
    locationMessage,
    guestSessionLoading,
    guestSessionMessage,
    selectedPerson,
    panel,
    setPanel,
    activityTab,
    setActivityTab,
    radius,
    setRadius,
    duration,
    setDuration,
    presenceConsent,
    setPresenceConsent,
    guestPresenceConsent,
    setGuestPresenceConsent,
    guestDisplayName,
    setGuestDisplayName,
    guestAreaLabel,
    setGuestAreaLabel,
    guestAvatarKey,
    setGuestAvatarKey,
    guestPresence,
    presenceDescription,
    setPresenceDescription,
    presenceLoading,
    presenceMessage,
    receivedBips,
    receivedGuestBips,
    bipsLoading,
    bipsMessage,
    connections,
    guestConnections,
    connectionsLoading,
    connectionsMessage,
    currentPresence,
    canUseMemberReel,
    discoveryEnabled,
    activityEnabled,
    availablePeople,
    visiblePeople,
    refreshBips,
    refreshConnections,
    endConnection,
    sendBipToSelectedPerson,
    resolveReceivedBip,
    resolveGuestBip,
    endGuestConnection,
    pendingConnectionEnd,
    confirmEndConnection,
    cancelEndConnection,
    activatePresence,
    activateGuestPresence,
    stopGuestPresence,
    stopPresence,
    beginGuestSession,
    requestDiscovery,
    ignoreLocation,
    openProfile,
    closeProfile,
    openActivity,
  } = controller;
  const isPresenceActive = Boolean(currentPresence || guestPresence);

  return (
    <section className="reel-proximity" aria-label={t("reel.ui.screenLabel")}>
      <header className="reel-proximity__header">
        <div className="reel-proximity__heading">
          <RadioTower aria-hidden="true" />
          <div className="reel-proximity__heading-copy">
            <h1>En direct</h1>
            <p>{t("reel.ui.screenLabel")}</p>
          </div>
          {isPresenceActive && (
            <span className="reel-proximity__live-indicator" aria-hidden="true" />
          )}
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
            className={`reel-proximity__header-action reel-proximity__discovery-toggle${discoveryEnabled ? " is-active" : ""}`}
            onClick={() => {
              if (discoveryEnabled) ignoreLocation();
              else void requestDiscovery();
            }}
            disabled={discoveryAccess === "requesting" || (!canUseMemberReel && access.mode !== "guest")}
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
            onClick={openTour}
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
      <ReelGuidedTour open={tourOpen} step={tourStep} onClose={closeTour} onStepChange={setTourStep} />

      {!discoveryEnabled && (
        <section
          className={`reel-location-card reel-location-card--${discoveryAccess}`}
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
                  Pas maintenant
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      <div
        className={`reel-proximity__radar${discoveryEnabled ? "" : " reel-proximity__radar--calm"}`}
      >
        <div className="reel-radar__outer-halo" aria-hidden="true" />
        <div className="reel-radar__outer-ring" aria-hidden="true" />
        <div className="reel-radar__inner-ring" aria-hidden="true" />
        <div className="reel-radar__core">
          <button
            type="button"
            className={`reel-radar__me${isPresenceActive ? " is-presence-active" : ""}`}
            onClick={() => {
              if (currentPresence) void stopPresence();
              else if (guestPresence) void stopGuestPresence();
              else if (
                access.mode === "guest" &&
                guestPresenceConsent &&
                guestDisplayName.trim() &&
                guestAreaLabel.trim() &&
                presenceDescription.trim()
              ) {
                void activateGuestPresence();
              } else if (
                access.mode === "member" &&
                canUseMemberReel &&
                presenceConsent &&
                presenceDescription.trim()
              ) {
                void activatePresence();
              } else {
                setPanel("settings");
              }
            }}
            disabled={presenceLoading}
            aria-pressed={isPresenceActive}
            aria-label={
              isPresenceActive ? t("reel.ui.hideMyPresence") : t("reel.ui.showMyPresence")
            }
            title={
              isPresenceActive ? t("reel.ui.hideMyPresence") : t("reel.ui.showMyPresence")
            }
          >
            <SelfRadarIdentity
              accessMode={access.mode}
              guestAvatarKey={guestAvatarKey}
              guestDisplayName={guestDisplayName}
              memberAvatarUrl={memberAvatarUrl}
              meLabel={t("reel.ui.me")}
            />
          </button>
        </div>
        {visiblePeople.map((person) => (
          <RingPerson key={person.id} person={person} onSelect={openProfile} />
        ))}
      </div>

      {discoveryEnabled && availablePeople.length > 0 ? (
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
                aria-label={`Voir le profil de ${person.name}`}
              >
                <PersonAvatar person={person} size="small" />
                <span>
                  <strong>{person.name}</strong>
                  <small>
                    {person.description || person.category || t("reel.ui.nearbyProfile")}
                  </small>
                </span>
                <ChevronDown aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>
      ) : discoveryEnabled ? (
        <section className="reel-live-empty" aria-live="polite">
          <UsersRound aria-hidden="true" />
          <div>
            <strong>{t("reel.ui.noNearby")}</strong>
            <p>{t("reel.ui.noProfilesHint")}</p>
          </div>
        </section>
      ) : null}

      {!discoveryEnabled && discoveryAccess !== "prompt" && discoveryAccess !== "requesting" && (
        <div className="reel-calm-shortcuts" aria-label={t("reel.ui.otherWays")}>
          <button type="button" onClick={() => setPanel("global")}>
            <Globe aria-hidden="true" />
            <span>
              <strong>{t("reel.ui.global")}</strong>
              <small>{t("reel.ui.discoverPrivate")}</small>
            </span>
            <ChevronDown aria-hidden="true" />
          </button>
          <button type="button" onClick={() => openActivity("connections")}>
            <History aria-hidden="true" />
            <span>
              <strong>{t("reel.ui.pastActivity")}</strong>
              <small>{t("reel.ui.pastActivityHint")}</small>
            </span>
            <ChevronDown aria-hidden="true" />
          </button>
        </div>
      )}

      <ReelSettingsHelp open={settingsHelpOpen && panel === "settings"} onClose={() => setSettingsHelpOpen(false)} />

      {panel && (
        <div
          className="reel-panel-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPanel(null);
          }}
        >
          <section
            className="reel-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reel-panel-title"
          >
            <button
              type="button"
              className="reel-panel__close"
              onClick={() => {
                setSettingsHelpOpen(false);
                setPanel(null);
              }}
              aria-label={t("reel.ui.close")}
            >
              <X aria-hidden="true" />
            </button>

            {panel === "settings" && <ReelSettingsPanel controller={controller} onOpenHelp={() => setSettingsHelpOpen(true)} onClose={() => setPanel(null)} />}

            {panel === "global" && (
              <>
                <div className="reel-panel__eyebrow">
                  <Globe aria-hidden="true" /> {t("reel.ui.global")}
                </div>
                <h2 id="reel-panel-title">{t("reel.ui.global")}</h2>
                <div className="reel-panel__empty">
                  <Globe aria-hidden="true" />
                  <strong>{t("reel.ui.globalDiscoveries")}</strong>
                  <span>
                    {t("reel.ui.globalPaused")}
                    {t("reel.ui.globalUnavailable")}
                  </span>
                </div>
              </>
            )}

            {panel === "activity" && <ReelActivityPanel controller={controller} />}

            {panel === "people" && (
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
                          <small className="reel-people-list__distance">
                            {person.distanceLabel}
                          </small>
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
            )}
          </section>
        </div>
      )}

      {pendingConnectionEnd && (
        <div
          className="reel-panel-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) cancelEndConnection();
          }}
        >
          <section
            className="reel-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reel-close-connection-title"
          >
            <h2 id="reel-close-connection-title">{t("reel.ui.closeConnection")}</h2>
            <p className="reel-panel__intro">{t("reel.ui.endConnectionNotice")}</p>
            <div className="reel-panel__actions">
              <button type="button" className="reel-panel__secondary" onClick={cancelEndConnection}>
                {t("reel.ui.keepConnection")}
              </button>
              <button
                type="button"
                className="reel-panel__primary"
                onClick={() => void confirmEndConnection()}
              >
                Terminer
              </button>
            </div>
          </section>
        </div>
      )}

      <ReelProfileSheet
        person={selectedPerson}
        isPresenceActive={Boolean(currentPresence || guestPresence)}
        onClose={closeProfile}
        onSendBip={sendBipToSelectedPerson}
      />
    </section>
  );
}
