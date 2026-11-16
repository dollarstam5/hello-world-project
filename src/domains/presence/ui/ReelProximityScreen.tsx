import { useEffect, useState } from "react";
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
import { useReelProximityController } from "@/domains/presence/model/useReelProximityController";
import { RingPerson, SelfRadarIdentity } from "./components/ReelRadarIdentity";
import { ReelGuidedTour } from "./components/ReelGuidedTour";
import { ReelSettingsHelp } from "./components/ReelSettingsHelp";
import { ReelProfileSheet } from "./components/ReelProfileSheet";
import { ReelSettingsPanel } from "./components/ReelSettingsPanel";
import { ReelActivityPanel } from "./components/ReelActivityPanel";
import { ReelHeader } from "./components/ReelHeader";
import { ReelDiscoveryPrompt } from "./components/ReelDiscoveryPrompt";
import { ReelNearbyPreview } from "./components/ReelNearbyPreview";
import "./reel-proximity.css";

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
      <ReelHeader controller={controller} onOpenTour={openTour} />
      <ReelGuidedTour
        open={tourOpen}
        step={tourStep}
        onClose={closeTour}
        onStepChange={setTourStep}
      />

      <ReelDiscoveryPrompt controller={controller} />

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
            title={isPresenceActive ? t("reel.ui.hideMyPresence") : t("reel.ui.showMyPresence")}
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

      <ReelNearbyPreview controller={controller} />

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
