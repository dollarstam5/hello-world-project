import { Radio, Users, Sparkles, Moon } from "lucide-react";
import type { ReelAmbiance } from "../../model/useReelProximityController";
import { useI18n } from "@/lib/i18n/useI18n";

interface ReelAtmospherePillProps {
  ambiance: ReelAmbiance;
  onClickPrompt?: () => void;
}

export function ReelAtmospherePill({ ambiance, onClickPrompt }: ReelAtmospherePillProps) {
  const { t } = useI18n();
  const icon = (() => {
    switch (ambiance.status) {
      case "scanning":
        return <Radio size={14} className="reel-atmosphere__icon reel-atmosphere__icon--spin" aria-hidden="true" />;
      case "dense":
        return <Users size={14} className="reel-atmosphere__icon" aria-hidden="true" />;
      case "live":
        return <Sparkles size={14} className="reel-atmosphere__icon" aria-hidden="true" />;
      default:
        return <Moon size={14} className="reel-atmosphere__icon" aria-hidden="true" />;
    }
  })();

  const label = ambiance.status === "dense" && ambiance.labelKey === "reel.ambiance.dense"
    ? t("reel.ambiance.dense").replace("{count}", String(ambiance.count))
    : t(ambiance.labelKey);

  return (
    <button
      type="button"
      className={`reel-atmosphere-pill reel-atmosphere-pill--${ambiance.status}`}
      onClick={onClickPrompt}
      disabled={!onClickPrompt}
      aria-live="polite"
    >
      <span className="reel-atmosphere-pill__pulse" aria-hidden="true" />
      {icon}
      <span className="reel-atmosphere-pill__text">{label}</span>
    </button>
  );
}
