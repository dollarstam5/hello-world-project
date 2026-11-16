import { type CSSProperties, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n/useI18n";
import {
  Bell,
  Bluetooth,
  Check,
  ChevronDown,
  CircleUserRound,
  CircleHelp,
  Globe,
  History,
  Home,
  Eye,
  EyeOff,
  MapPin,
  RadioTower,
  Settings2,
  SlidersHorizontal,
  UsersRound,
  X,
} from "lucide-react";
import {
  useReelProximityController,
  type Person,
} from "@/domains/presence/model/useReelProximityController";
import "./reel-proximity.css";

const DURATIONS = ["30 min", "1 h", "2 h", "3 h", "6 h", "12 h", "24 h"];
const RADII = ["10 m", "25 m", "50 m", "100 m", "1 km"];

function PersonAvatar({
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

function RingPerson({ person, onSelect }: { person: Person; onSelect: (person: Person) => void }) {
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

function SelfRadarIdentity({
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

export function ReelProximityScreen() {
  const { t } = useI18n();
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  useEffect(() => {
    setTourOpen(window.localStorage.getItem("vitalis-reel-tour-seen") !== "true");
  }, []);
  const closeTour = () => {
    setTourOpen(false);
    window.localStorage.setItem("vitalis-reel-tour-seen", "true");
  };
  const openTour = () => { setTourStep(0); setTourOpen(true); };
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
  } = useReelProximityController();
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
          <span className="reel-proximity__live-indicator" aria-hidden="true" />
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
            className={`reel-proximity__header-action reel-proximity__presence-toggle${isPresenceActive ? " is-active" : ""}`}
            onClick={() => {
              if (currentPresence) void stopPresence();
              else if (guestPresence) void stopGuestPresence();
              else setPanel("settings");
            }}
            disabled={presenceLoading}
            aria-pressed={isPresenceActive}
            aria-label={
              isPresenceActive ? t("reel.ui.hideMyPresence") : t("reel.ui.showMyPresence")
            }
            title={isPresenceActive ? t("reel.ui.hideMyPresence") : t("reel.ui.showMyPresence")}
          >
            {isPresenceActive ? <Eye aria-hidden="true" /> : <EyeOff aria-hidden="true" />}
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
      {tourOpen && (
        <div className="reel-tour-backdrop">
          <section className="reel-tour" role="dialog" aria-modal="true" aria-labelledby="reel-tour-title" aria-describedby="reel-tour-description">
            <div className="reel-tour__topline">
              <span>{t("reel.ui.tour.eyebrow")}</span>
              <button type="button" onClick={closeTour} aria-label={t("reel.ui.tour.close")}><X aria-hidden="true" /></button>
            </div>
            <div className="reel-tour__progress" aria-label={t("reel.ui.tour.progress", { current: tourStep + 1, total: 4 })}>
              {[0, 1, 2, 3].map((step) => <span key={step} className={step <= tourStep ? "is-active" : ""} />)}
            </div>
            <p className="reel-tour__step">{t("reel.ui.tour.step", { current: tourStep + 1, total: 4 })}</p>
            <h2 id="reel-tour-title">{t(([ "reel.ui.tour.title1", "reel.ui.tour.title2", "reel.ui.tour.title3", "reel.ui.tour.title4" ][tourStep]) as never)}</h2>
            <p id="reel-tour-description">{t(([ "reel.ui.tour.description1", "reel.ui.tour.description2", "reel.ui.tour.description3", "reel.ui.tour.description4" ][tourStep]) as never)}</p>
            <div className="reel-tour__actions">
              <button type="button" className="reel-tour__skip" onClick={closeTour}>{t("reel.ui.tour.skip")}</button>
              <div>
                {tourStep > 0 && <button type="button" className="reel-tour__back" onClick={() => setTourStep((step) => step - 1)}>{t("reel.ui.tour.back")}</button>}
                <button type="button" className="reel-tour__next" onClick={() => tourStep === 3 ? closeTour() : setTourStep((step) => step + 1)}>{tourStep === 3 ? t("reel.ui.tour.finish") : t("reel.ui.tour.next")}</button>
              </div>
            </div>
          </section>
        </div>
      )}


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
          {access.mode === "member" ? (
            <Link
              to="/espace/profil"
              className="reel-radar__me"
              aria-label={t("profile.title")}
              title={t("profile.title")}
            >
              <SelfRadarIdentity
                accessMode={access.mode}
                guestAvatarKey={guestAvatarKey}
                guestDisplayName={guestDisplayName}
                memberAvatarUrl={memberAvatarUrl}
                meLabel={t("reel.ui.me")}
              />
            </Link>
          ) : (
            <button
              type="button"
              className="reel-radar__me"
              onClick={() => setPanel("settings")}
              aria-label={t("reel.ui.managePresence")}
              title={t("reel.ui.managePresence")}
            >
              <SelfRadarIdentity
                accessMode={access.mode}
                guestAvatarKey={guestAvatarKey}
                guestDisplayName={guestDisplayName}
                memberAvatarUrl={memberAvatarUrl}
                meLabel={t("reel.ui.me")}
              />
            </button>
          )}
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
                  <small>{
                  person.description || person.category || t("reel.ui.nearbyProfile")
                }</small>
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
              onClick={() => setPanel(null)}
              aria-label={t("reel.ui.close")}
            >
              <X aria-hidden="true" />
            </button>

            {panel === "settings" && (
              <>
                <div className="reel-panel__eyebrow">
                  <Settings2 aria-hidden="true" /> {t("reel.ui.personalization")}
                </div>
                <h2 id="reel-panel-title">{t("reel.ui.settingsHeading")}</h2>
                <p className="reel-panel__intro">{t("reel.ui.settingsIntro")}</p>

                <div className="reel-panel__section">
                  <h3>{t("reel.ui.discovery")}</h3>
                  <p className="reel-panel__note">
                    {discoveryEnabled
                      ? t("reel.ui.discoveryActive")
                      : t("reel.ui.discoveryInactive")}
                  </p>
                  {!discoveryEnabled && (
                    <button
                      type="button"
                      className="reel-panel__primary"
                      onClick={() => void requestDiscovery()}
                    >
                      {t("reel.ui.enableDiscovery")}
                    </button>
                  )}
                </div>

                <div className="reel-panel__section">
                  <h3>{t("reel.ui.radius")}</h3>
                  <div className="reel-choice-grid">
                    {RADII.map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={radius === value ? "is-selected" : ""}
                        onClick={() => setRadius(value)}
                      >
                        {value}
                        {radius === value && <Check aria-hidden="true" />}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="reel-panel__note">{t("reel.ui.radiusApplied")}</p>
                {currentPresence && (
                  <p className="reel-panel__note">{t("reel.ui.guestPresenceActive")}</p>
                )}

                <div className="reel-panel__section">
                  <h3>{t("reel.ui.duration")}</h3>
                  {access.mode === "guest" && (
                    <p className="reel-panel__note">{t("reel.ui.guestActiveDuration")}</p>
                  )}
                  <div className="reel-choice-grid reel-choice-grid--duration">
                    {DURATIONS.filter(
                      (value) => access.mode !== "guest" || value === "30 min" || value === "1 h",
                    ).map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={duration === value ? "is-selected" : ""}
                        onClick={() => setDuration(value)}
                      >
                        {value}
                        {duration === value && <Check aria-hidden="true" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="reel-panel__section">
                  <h3>{t("reel.ui.visibility")}</h3>
                  <p className="reel-panel__note">{t("reel.ui.visibilityNote")}</p>
                  {access.mode === "guest" ? (
                    guestPresence ? (
                      <>
                        <p className="reel-panel__status">
                          {t("reel.ui.guestPresenceSummary")
                            .replace("{name}", guestPresence.display_name)
                            .replace("{area}", guestPresence.area_label)}
                        </p>
                        <button
                          type="button"
                          className="reel-panel__secondary"
                          disabled={presenceLoading}
                          onClick={() => void stopGuestPresence()}
                        >
                          {t("reel.ui.stopPresence")}
                        </button>
                      </>
                    ) : (
                      <>
                        <label className="reel-setting-row reel-setting-row--stacked">
                          <span>
                            <strong>{t("reel.ui.displayName")}</strong>
                            <small>{t("reel.ui.displayNameHint")}</small>
                          </span>
                          <input
                            type="text"
                            autoComplete="nickname"
                            maxLength={40}
                            value={guestDisplayName}
                            onChange={(event) => setGuestDisplayName(event.target.value)}
                            placeholder={t("reel.ui.namePlaceholder")}
                          />
                        </label>
                        <label className="reel-setting-row reel-setting-row--stacked">
                          <span>
                            <strong>{t("reel.ui.area")}</strong>
                            <small>{t("reel.ui.areaHint")}</small>
                          </span>
                          <input
                            type="text"
                            maxLength={80}
                            value={guestAreaLabel}
                            onChange={(event) => setGuestAreaLabel(event.target.value)}
                            placeholder={t("reel.ui.areaPlaceholder")}
                          />
                        </label>
                        <label className="reel-setting-row reel-setting-row--stacked">
                          <span>
                            <strong>{t("reel.ui.avatar")}</strong>
                            <small>{t("reel.ui.avatarHint")}</small>
                          </span>
                          <select
                            value={guestAvatarKey}
                            onChange={(event) => setGuestAvatarKey(event.target.value)}
                          >
                            <option value="avatar-blue">{t("reel.ui.blue")}</option>
                            <option value="avatar-violet">{t("reel.ui.violet")}</option>
                            <option value="avatar-green">{t("reel.ui.green")}</option>
                            <option value="avatar-orange">{t("reel.ui.orange")}</option>
                          </select>
                        </label>
                        <label className="reel-setting-row reel-setting-row--stacked">
                          <span>
                            <strong>{t("reel.ui.publicDescription")}</strong>
                            <small>{t("reel.ui.publicDescriptionHint")}</small>
                          </span>
                          <textarea
                            maxLength={180}
                            value={presenceDescription}
                            onChange={(event) => setPresenceDescription(event.target.value)}
                            rows={2}
                          />
                        </label>
                        <label className="reel-setting-row">
                          <span>
                            <strong>{t("reel.ui.visibleConsent")}</strong>
                            <small>{t("reel.ui.privatePosition")}</small>
                          </span>
                          <input
                            type="checkbox"
                            checked={guestPresenceConsent}
                            onChange={(event) => setGuestPresenceConsent(event.target.checked)}
                          />
                        </label>
                        <button
                          type="button"
                          className="reel-panel__primary"
                          disabled={
                            presenceLoading ||
                            !guestPresenceConsent ||
                            !guestDisplayName.trim() ||
                            !guestAreaLabel.trim() ||
                            !presenceDescription.trim()
                          }
                          onClick={() => void activateGuestPresence()}
                        >
                          {presenceLoading
                            ? t("reel.ui.activateLoading")
                            : t("reel.ui.makeVisible")}
                        </button>
                      </>
                    )
                  ) : !canUseMemberReel ? (
                    <p className="reel-panel__note">{t("reel.ui.guestStartPresence")}</p>
                  ) : currentPresence ? (
                    <>
                      <p className="reel-panel__status">{t("reel.ui.presenceActiveUntil")}</p>
                      <button
                        type="button"
                        className="reel-panel__secondary"
                        disabled={presenceLoading}
                        onClick={() => void stopPresence()}
                      >
                        {t("reel.ui.stopPresence")}
                      </button>
                    </>
                  ) : (
                    <>
                      <label className="reel-setting-row reel-setting-row--stacked">
                        <span>
                          <strong>{t("reel.ui.publicDescription")}</strong>
                          <small>{t("reel.ui.publicDescriptionHint")}</small>
                        </span>
                        <textarea
                          maxLength={180}
                          value={presenceDescription}
                          onChange={(event) => setPresenceDescription(event.target.value)}
                          rows={2}
                        />
                      </label>
                      <label className="reel-setting-row">
                        <span>
                          <strong>{t("reel.ui.visibleConsent")}</strong>
                          <small>{t("reel.ui.visiblePosition")}</small>
                        </span>
                        <input
                          type="checkbox"
                          checked={presenceConsent}
                          onChange={(event) => setPresenceConsent(event.target.checked)}
                        />
                      </label>
                      <button
                        type="button"
                        className="reel-panel__primary"
                        disabled={
                          presenceLoading || !presenceConsent || !presenceDescription.trim()
                        }
                        onClick={() => void activatePresence()}
                      >
                        {presenceLoading ? t("reel.ui.activateLoading") : t("reel.ui.activate")}
                      </button>
                    </>
                  )}
                  {presenceMessage && (
                    <p className="reel-panel__note" role="status">
                      {presenceMessage}
                    </p>
                  )}
                </div>

                <p className="reel-panel__note">{t("reel.ui.visibilityConfirmed")}</p>
                <button
                  type="button"
                  className="reel-panel__primary"
                  onClick={() => setPanel(null)}
                >
                  {t("reel.ui.finish")}
                </button>
              </>
            )}

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

            {panel === "activity" && (
              <>
                <div className="reel-panel__eyebrow">
                  <Bell aria-hidden="true" /> {t("reel.ui.activity")}
                </div>
                <h2 id="reel-panel-title">{t("reel.ui.activityHeading")}</h2>
                <div className="reel-panel__tabs" role="tablist" aria-label={t("reel.ui.activity")}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activityTab === "notifications"}
                    aria-disabled={!activityEnabled}
                    disabled={!activityEnabled}
                    className={activityTab === "notifications" ? "is-active" : ""}
                    onClick={() => setActivityTab("notifications")}
                  >
                    Alertes
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activityTab === "bips"}
                    aria-disabled={!currentPresence && !guestPresence}
                    disabled={!currentPresence && !guestPresence}
                    className={activityTab === "bips" ? "is-active" : ""}
                    onClick={() => setActivityTab("bips")}
                  >
                    {t("reel.ui.receivedBips")}
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activityTab === "connections"}
                    className={activityTab === "connections" ? "is-active" : ""}
                    onClick={() => setActivityTab("connections")}
                  >
                    {t("reel.ui.connectionsTab")}
                  </button>
                </div>
                {activityTab === "bips" ? (
                  <div className="reel-people-list" aria-live="polite">
                    {bipsLoading && <p className="reel-panel__note">{t("reel.ui.bipsLoading")}</p>}
                    {!canUseMemberReel && access.mode !== "guest" && (
                      <p className="reel-panel__note">{t("reel.ui.publishToReceive")}</p>
                    )}
                    {(canUseMemberReel || access.mode === "guest") &&
                      !bipsLoading &&
                      receivedBips.length === 0 &&
                      receivedGuestBips.length === 0 && (
                        <div className="reel-panel__empty">
                          <RadioTower aria-hidden="true" />
                          <strong>{t("reel.ui.noBips")}</strong>
                          <span>{t("reel.ui.noBipsHint")}</span>
                        </div>
                      )}
                    {receivedBips.map((bip) => (
                      <div className="reel-people-list__item" key={bip.id}>
                        <span className="reel-avatar reel-avatar--small">
                          <CircleUserRound aria-hidden="true" />
                        </span>
                        <span>
                          <strong>{t("reel.ui.someoneSignaled")}</strong>
                          <small>{t("reel.ui.acceptOrDecline")}</small>
                        </span>
                        <button
                          type="button"
                          onClick={() => void resolveReceivedBip(bip, "accept")}
                        >
                          {t("reel.ui.accept")}
                        </button>
                        <button
                          type="button"
                          onClick={() => void resolveReceivedBip(bip, "decline")}
                        >
                          {t("reel.ui.decline")}
                        </button>
                      </div>
                    ))}
                    {receivedGuestBips.map((bip) => (
                      <div className="reel-people-list__item" key={bip.id}>
                        <span className="reel-avatar reel-avatar--small">
                          <CircleUserRound aria-hidden="true" />
                        </span>
                        <span>
                          <strong>{t("reel.ui.someoneSignaled")}</strong>
                          <small>{t("reel.ui.acceptOrDecline")}</small>
                        </span>
                        <button type="button" onClick={() => void resolveGuestBip(bip, "accept")}>
                          {t("reel.ui.accept")}
                        </button>
                        <button type="button" onClick={() => void resolveGuestBip(bip, "decline")}>
                          {t("reel.ui.decline")}
                        </button>
                      </div>
                    ))}
                    {bipsMessage && (
                      <p className="reel-panel__note" role="status">
                        {bipsMessage}
                      </p>
                    )}
                  </div>
                ) : activityTab === "connections" ? (
                  <div className="reel-people-list" aria-live="polite">
                    {connectionsLoading && (
                      <p className="reel-panel__note">{t("reel.ui.connectionsLoading")}</p>
                    )}
                    {access.mode === "visitor" && (
                      <p className="reel-panel__note">{t("reel.ui.connectToView")}</p>
                    )}
                    {access.mode === "member" && !canUseMemberReel && (
                      <p className="reel-panel__note">{t("reel.ui.memberNotActive")}</p>
                    )}
                    {access.mode === "guest" &&
                      !connectionsLoading &&
                      guestConnections.length === 0 && (
                        <div className="reel-panel__empty">
                          <UsersRound aria-hidden="true" />
                          <strong>{t("reel.ui.guestNoConnections")}</strong>
                          <span>{t("reel.ui.guestConnectionsHint")}</span>
                        </div>
                      )}
                    {canUseMemberReel &&
                      !connectionsLoading &&
                      connections.length === 0 &&
                      guestConnections.length === 0 && (
                        <div className="reel-panel__empty">
                          <UsersRound aria-hidden="true" />
                          <strong>{t("reel.ui.noConnections")}</strong>
                          <span>{t("reel.ui.noConnectionsHint")}</span>
                        </div>
                      )}
                    {connections.map((connection) => (
                      <div className="reel-people-list__item" key={connection.connection_id}>
                        <span className="reel-avatar reel-avatar--small">
                          <CircleUserRound aria-hidden="true" />
                        </span>
                        <span>
                          <strong>{connection.partner_display_name}</strong>
                          <small>
                            {connection.status === "active"
                              ? t("reel.ui.activeConnection")
                              : t("reel.ui.endedConnection")}
                          </small>
                        </span>
                        {connection.status === "active" && (
                          <button type="button" onClick={() => void endConnection(connection)}>
                            {t("reel.ui.end")}
                          </button>
                        )}
                      </div>
                    ))}
                    {guestConnections.map((connection) => (
                      <div className="reel-people-list__item" key={connection.connection_id}>
                        <span className="reel-avatar reel-avatar--small">
                          <CircleUserRound aria-hidden="true" />
                        </span>
                        <span>
                          <strong>
                            {connection.partner_display_name || t("reel.ui.temporaryConnection")}
                          </strong>
                          <small>
                            {connection.status === "active"
                              ? t("reel.ui.guestConnectionActive")
                              : t("reel.ui.connectionEnded")}
                          </small>
                        </span>
                        {connection.status === "active" && (
                          <button type="button" onClick={() => void endGuestConnection(connection)}>
                            {t("reel.ui.end")}
                          </button>
                        )}
                      </div>
                    ))}
                    {connectionsMessage && (
                      <p className="reel-panel__note" role="status">
                        {connectionsMessage}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="reel-people-list" aria-live="polite">
                    {(bipsLoading || connectionsLoading) && (
                      <p className="reel-panel__note">{t("reel.ui.bipsLoading")}</p>
                    )}
                    {access.mode === "visitor" && (
                      <p className="reel-panel__note">{t("reel.ui.connectToView")}</p>
                    )}
                    {access.mode === "member" && !canUseMemberReel && (
                      <p className="reel-panel__note">{t("reel.ui.memberNotActive")}</p>
                    )}
                    {receivedBips.map((bip) => (
                      <div className="reel-people-list__item" key={`member-bip-${bip.id}`}>
                        <span className="reel-avatar reel-avatar--small">
                          <RadioTower aria-hidden="true" />
                        </span>
                        <span>
                          <strong>{t("reel.ui.someoneSignaled")}</strong>
                          <small>{t("reel.ui.acceptOrDecline")}</small>
                        </span>
                      </div>
                    ))}
                    {receivedGuestBips.map((bip) => (
                      <div className="reel-people-list__item" key={`guest-bip-${bip.id}`}>
                        <span className="reel-avatar reel-avatar--small">
                          <RadioTower aria-hidden="true" />
                        </span>
                        <span>
                          <strong>{t("reel.ui.someoneSignaled")}</strong>
                          <small>{t("reel.ui.acceptOrDecline")}</small>
                        </span>
                      </div>
                    ))}
                    {connections
                      .filter((connection) => connection.status === "active")
                      .map((connection) => (
                        <div
                          className="reel-people-list__item"
                          key={`member-connection-${connection.connection_id}`}
                        >
                          <span className="reel-avatar reel-avatar--small">
                            <UsersRound aria-hidden="true" />
                          </span>
                          <span>
                            <strong>{connection.partner_display_name}</strong>
                            <small>{t("reel.ui.activeConnection")}</small>
                          </span>
                        </div>
                      ))}
                    {guestConnections
                      .filter((connection) => connection.status === "active")
                      .map((connection) => (
                        <div
                          className="reel-people-list__item"
                          key={`guest-connection-${connection.connection_id}`}
                        >
                          <span className="reel-avatar reel-avatar--small">
                            <UsersRound aria-hidden="true" />
                          </span>
                          <span>
                            <strong>
                              {connection.partner_display_name || t("reel.ui.temporaryConnection")}
                            </strong>
                            <small>{t("reel.ui.guestConnectionActive")}</small>
                          </span>
                        </div>
                      ))}
                    {!bipsLoading &&
                      !connectionsLoading &&
                      receivedBips.length === 0 &&
                      receivedGuestBips.length === 0 &&
                      !connections.some((connection) => connection.status === "active") &&
                      !guestConnections.some((connection) => connection.status === "active") && (
                        <div className="reel-panel__empty">
                          <Bell aria-hidden="true" />
                          <strong>{t("reel.ui.noNotifications")}</strong>
                          <span>{t("reel.ui.notificationsHint")}</span>
                        </div>
                      )}
                    {bipsMessage && (
                      <p className="reel-panel__note" role="status">
                        {bipsMessage}
                      </p>
                    )}
                    {connectionsMessage && (
                      <p className="reel-panel__note" role="status">
                        {connectionsMessage}
                      </p>
                    )}
                  </div>
                )}
                {!activityEnabled && activityTab === "notifications" && (
                  <p className="reel-panel__note">{t("reel.ui.calmNotifications")}</p>
                )}
              </>
            )}

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

      {selectedPerson && (
        <div
          className="reel-profile-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeProfile();
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
              onClick={closeProfile}
              aria-label={t("reel.ui.closeProfile")}
            >
              <X aria-hidden="true" />
            </button>
            <PersonAvatar person={selectedPerson} size="me" />
            <h2 id="reel-profile-title">{selectedPerson.name}</h2>
            {selectedPerson.category && (
              <p className="reel-profile-sheet__category">{selectedPerson.category}</p>
            )}
            {selectedPerson.distanceLabel && (
              <p className="reel-profile-sheet__distance">{selectedPerson.distanceLabel}</p>
            )}
            {selectedPerson.description ? (
              <p className="reel-profile-sheet__description">{selectedPerson.description}</p>
            ) : (
              <p className="reel-profile-sheet__empty">{t("reel.ui.noExtraProfile")}</p>
            )}
            {selectedPerson.locationLabel && (
              <div className="reel-profile-sheet__details">
                <span>{selectedPerson.locationLabel}</span>
              </div>
            )}
            {(currentPresence || guestPresence) && (
              <button
                type="button"
                className="reel-profile-sheet__primary"
                onClick={() => void sendBipToSelectedPerson()}
              >
                <RadioTower aria-hidden="true" /> Faire signe
              </button>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
