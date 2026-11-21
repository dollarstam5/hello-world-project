import { CircleHelp, Settings2, ShieldCheck, MapPin, Clock } from "lucide-react";
import { haptic } from "@/platform/device/haptics";
import { useI18n } from "@/lib/i18n/useI18n";
import type { useReelProximityController } from "@/domains/presence/model/useReelProximityController";

type ReelController = ReturnType<typeof useReelProximityController>;
const DURATIONS = ["30 min", "1 h", "2 h", "3 h", "6 h", "12 h", "24 h"];
const RADII = ["10 m", "25 m", "50 m", "100 m", "1 km"];
const RADII_CONFIG: Record<string, { contextKey: string }> = {
  "10 m": { contextKey: "reel.settings.radius.10" },
  "25 m": { contextKey: "reel.settings.radius.25" },
  "50 m": { contextKey: "reel.settings.radius.50" },
  "100 m": { contextKey: "reel.settings.radius.100" },
  "1 km": { contextKey: "reel.settings.radius.1000" },
};
const DURATIONS_CONFIG: Record<string, { badgeKey: string; color: string }> = {
  "30 min": { badgeKey: "reel.settings.duration.30", color: "#22c55e" },
  "1 h": { badgeKey: "reel.settings.duration.60", color: "#22c55e" },
  "2 h": { badgeKey: "reel.settings.duration.120", color: "#38bdf8" },
  "3 h": { badgeKey: "reel.settings.duration.180", color: "#38bdf8" },
  "6 h": { badgeKey: "reel.settings.duration.360", color: "#eab308" },
  "12 h": { badgeKey: "reel.settings.duration.720", color: "#f97316" },
  "24 h": { badgeKey: "reel.settings.duration.1440", color: "#ef4444" },
};

export function ReelSettingsPanel({
  controller,
  onOpenHelp,
  onClose,
}: {
  controller: ReelController;
  onOpenHelp: () => void;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const { access, discoveryEnabled, ignoreLocation } = controller;
  const { canUseMemberReel, requestDiscovery, radius } = controller;
  const { setRadius, currentPresence, duration } = controller;
  const { setDuration, guestPresence, presenceLoading } = controller;
  const { stopGuestPresence, guestDisplayName, setGuestDisplayName } = controller;
  const { guestAreaLabel, setGuestAreaLabel, guestAvatarKey } = controller;
  const { setGuestAvatarKey, presenceDescription, setPresenceDescription } = controller;
  const { guestPresenceConsent, setGuestPresenceConsent, activateGuestPresence } = controller;
  const { presenceConsent, setPresenceConsent, stopPresence } = controller;
  const { activatePresence, presenceMessage } = controller;
  const handleSelectRadius = (value: string) => {
    haptic.tap();
    setRadius(value);
  };
  const handleSelectDuration = (value: string) => {
    haptic.tap();
    setDuration(value);
  };

  return (
    <>
      <div className="reel-panel__eyebrow">
        <Settings2 aria-hidden="true" /> {t("reel.ui.personalization")}
      </div>
      <h2 id="reel-panel-title">{t("reel.ui.settingsHeading")}</h2>
      <p className="reel-panel__intro">{t("reel.ui.settingsIntro")}</p>
      <button type="button" className="reel-panel__help-trigger" onClick={onOpenHelp}>
        <CircleHelp aria-hidden="true" />
        {t("reel.ui.settingsHelp")}
      </button>

      <div className="reel-panel__section">
        <h3>{t("reel.ui.discovery")}</h3>
        <p className="reel-panel__note">
          {discoveryEnabled ? t("reel.ui.discoveryActive") : t("reel.ui.discoveryInactive")}
        </p>
        {discoveryEnabled ? (
          <button type="button" className="reel-panel__secondary" onClick={ignoreLocation}>
            {t("reel.ui.disableDiscovery")}
          </button>
        ) : (
          <button
            type="button"
            className="reel-panel__primary"
            onClick={() => void requestDiscovery()}
            disabled={!canUseMemberReel && access.mode !== "guest"}
          >
            {t("reel.ui.enableDiscovery")}
          </button>
        )}
      </div>

      <div className="reel-panel__section">
        <div className="reel-setting-header">
          <div className="reel-setting-header__title">
            <MapPin size={16} aria-hidden="true" />
            <h3>{t("reel.ui.radius")}</h3>
          </div>
          <span className="reel-setting-header__active-badge">{radius}</span>
        </div>
        <p className="reel-setting-caption">
          {t("reel.settings.radiusContext")}{" "}
          <strong>{t(RADII_CONFIG[radius]?.contextKey ?? "reel.ui.radius")}</strong>
        </p>
        <div className="reel-segment-slider" role="radiogroup" aria-label={t("reel.ui.radius")}>
          {RADII.map((value) => {
            const isSelected = radius === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`reel-segment-btn ${isSelected ? "is-selected" : ""}`}
                onClick={() => handleSelectRadius(value)}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>

      <p className="reel-panel__note">{t("reel.ui.radiusApplied")}</p>
      {currentPresence && <p className="reel-panel__note">{t("reel.ui.guestPresenceActive")}</p>}

      <div className="reel-panel__section">
        <div className="reel-setting-header">
          <div className="reel-setting-header__title">
            <Clock size={16} aria-hidden="true" />
            <h3>{t("reel.ui.duration")}</h3>
          </div>
          <span
            className="reel-duration-badge"
            style={{
              borderColor: DURATIONS_CONFIG[duration]?.color ?? "#38bdf8",
              color: DURATIONS_CONFIG[duration]?.color ?? "#38bdf8",
            }}
          >
            <ShieldCheck size={12} aria-hidden="true" />{" "}
            {t(DURATIONS_CONFIG[duration]?.badgeKey ?? "reel.settings.duration.active")}
          </span>
        </div>
        {access.mode === "guest" && (
          <p className="reel-panel__note">{t("reel.ui.guestActiveDuration")}</p>
        )}
        <div className="reel-duration-grid">
          {DURATIONS.filter(
            (value) => access.mode !== "guest" || value === "30 min" || value === "1 h",
          ).map((value) => {
            const isSelected = duration === value;
            const conf = DURATIONS_CONFIG[value];
            return <button key={value} type="button" className={`reel-duration-card ${isSelected ? "is-selected" : ""}`} aria-pressed={isSelected} onClick={() => handleSelectDuration(value)}><strong>{value}</strong><small>{t(conf?.badgeKey ?? "reel.settings.duration.active")}</small>{isSelected && <span className="reel-duration-card__dot" aria-hidden="true" />}</button>;
          })}
        </div>
        <p className="reel-panel__hint">{t("reel.settings.duration.hint")}</p>
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
                {presenceLoading ? t("reel.ui.activateLoading") : t("reel.ui.makeVisible")}
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
              disabled={presenceLoading || !presenceConsent || !presenceDescription.trim()}
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
      <button type="button" className="reel-panel__primary" onClick={onClose}>
        {t("reel.ui.finish")}
      </button>
    </>
  );
}
