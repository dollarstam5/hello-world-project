import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/useI18n";
import { ChevronDown, Globe, History, WifiOff, X } from "lucide-react";
import { useReelProximityController } from "@/domains/presence/model/useReelProximityController";
import { haptic } from "@/platform/device/haptics";
import { RingPerson, SelfRadarIdentity } from "./components/ReelRadarIdentity";
import { ReelGuidedTour } from "./components/ReelGuidedTour";
import { ReelSettingsHelp } from "./components/ReelSettingsHelp";
import { ReelProfileSheet } from "./components/ReelProfileSheet";
import { ReelSettingsPanel } from "./components/ReelSettingsPanel";
import { ReelActivityPanel } from "./components/ReelActivityPanel";
import { ReelHeader } from "./components/ReelHeader";
import { ReelAtmospherePill } from "./components/ReelAtmospherePill";
import { ReelDiscoveryPrompt } from "./components/ReelDiscoveryPrompt";
import { ReelNearbyPreview } from "./components/ReelNearbyPreview";
import { ReelGlobalPanel } from "./components/ReelGlobalPanel";
import { ReelPeoplePanel } from "./components/ReelPeoplePanel";
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
    selectedPerson,
    panel,
    setPanel,
    presenceConsent,
    guestPresenceConsent,
    guestDisplayName,
    guestAreaLabel,
    guestAvatarKey,
    guestPresence,
    presenceDescription,
    presenceLoading,
    currentPresence,
    canUseMemberReel,
    discoveryEnabled,
    visiblePeople,
    sendBipToSelectedPerson,
    pendingConnectionEnd,
    confirmEndConnection,
    cancelEndConnection,
    activatePresence,
    activateGuestPresence,
    stopGuestPresence,
    stopPresence,
    openProfile,
    closeProfile,
    openActivity,
  } = controller;
  const isPresenceActive = Boolean(currentPresence || guestPresence);

  return (
    <section className="reel-proximity" aria-label={t("reel.ui.screenLabel")}>
      <ReelHeader controller={controller} onOpenTour={openTour} />
      <ReelAtmospherePill
        ambiance={controller.ambiance}
        onClickPrompt={() => setPanel(controller.ambiance.count > 0 ? "people" : "settings")}
      />
      {!controller.isOnline && (
        <div className="reel-offline-banner" role="status" aria-live="polite">
          <WifiOff size={14} aria-hidden="true" />
          <span>{t("reel.network.standby")}</span>
        </div>
      )}
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
        <div className="reel-radar__sweep" aria-hidden="true" />
        <div className="reel-radar__core">
          <button
            type="button"
            className={`reel-radar__me${isPresenceActive ? " is-presence-active" : ""}`}
            onClick={() => {
              if (currentPresence) {
                haptic.tap();
                void stopPresence();
              } else if (guestPresence) {
                haptic.tap();
                void stopGuestPresence();
              } else if (
                access.mode === "guest" &&
                guestPresenceConsent &&
                guestDisplayName.trim() &&
                guestAreaLabel.trim() &&
                presenceDescription.trim()
              ) {
                haptic.toggle();
                void activateGuestPresence();
              } else if (
                access.mode === "member" &&
                canUseMemberReel &&
                presenceConsent &&
                presenceDescription.trim()
              ) {
                haptic.toggle();
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
        {visiblePeople.map((person, idx) => (
          <RingPerson
            key={person.id}
            person={person}
            index={idx}
            onSelect={(p) => {
              haptic.tap();
              openProfile(p);
            }}
            onQuickBip={(p) => {
              openProfile(p);
              void sendBipToSelectedPerson(p);
            }}
          />
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

      <ReelSettingsHelp
        open={settingsHelpOpen && panel === "settings"}
        onClose={() => setSettingsHelpOpen(false)}
      />

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

            {panel === "settings" && (
              <ReelSettingsPanel
                controller={controller}
                onOpenHelp={() => setSettingsHelpOpen(true)}
                onClose={() => setPanel(null)}
              />
            )}

            {panel === "global" && <ReelGlobalPanel />}

            {panel === "activity" && <ReelActivityPanel controller={controller} />}

            {panel === "people" && <ReelPeoplePanel controller={controller} />}
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
                {t("reel.ui.end")}
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
