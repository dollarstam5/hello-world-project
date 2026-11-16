import { X } from "lucide-react";
import { useI18n } from "@/lib/i18n/useI18n";

export function ReelSettingsHelp({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  if (!open) return null;
  return (
    <div className="reel-settings-help-backdrop">
      <section className="reel-settings-help" role="dialog" aria-modal="true" aria-labelledby="reel-settings-help-title">
        <div className="reel-settings-help__header">
          <div><span>{t("reel.ui.settingsHelpEyebrow")}</span><h2 id="reel-settings-help-title">{t("reel.ui.settingsHelpTitle")}</h2></div>
          <button type="button" onClick={onClose} aria-label={t("reel.ui.close")}><X aria-hidden="true" /></button>
        </div>
        <div className="reel-settings-help__content">
          <article><h3>{t("reel.ui.helpDiscoveryTitle")}</h3><p>{t("reel.ui.helpDiscoveryBody")}</p></article>
          <article><h3>{t("reel.ui.helpPresenceTitle")}</h3><p>{t("reel.ui.helpPresenceBody")}</p></article>
          <article><h3>{t("reel.ui.helpRadarTitle")}</h3><p>{t("reel.ui.helpRadarBody")}</p></article>
          <article><h3>{t("reel.ui.helpRadiusTitle")}</h3><p>{t("reel.ui.helpRadiusBody")}</p></article>
          <article><h3>{t("reel.ui.helpPrivacyTitle")}</h3><p>{t("reel.ui.helpPrivacyBody")}</p></article>
        </div>
        <button type="button" className="reel-panel__primary" onClick={onClose}>{t("reel.ui.finish")}</button>
      </section>
    </div>
  );
}
