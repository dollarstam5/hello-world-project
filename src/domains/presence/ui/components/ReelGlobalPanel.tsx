import { Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n/useI18n";

export function ReelGlobalPanel() {
  const { t } = useI18n();

  return (
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
  );
}
