import { MapPin } from "lucide-react";
import { haptic } from "@/platform/device/haptics";
import { useI18n } from "@/lib/i18n/useI18n";
import { RADII, RADII_CONFIG } from "./reel-settings.config";

export function ReelRadiusSettings({
  radius,
  setRadius,
  currentPresence,
}: {
  radius: string;
  setRadius: (value: string) => void;
  currentPresence: boolean;
}) {
  const { t } = useI18n();
  const handleSelectRadius = (value: string) => {
    haptic.tap();
    setRadius(value);
  };

  return (
    <>
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
    </>
  );
}
