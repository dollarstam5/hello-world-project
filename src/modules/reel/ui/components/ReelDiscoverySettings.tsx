import { useI18n } from "@/lib/i18n/useI18n";

export function ReelDiscoverySettings({
  enabled,
  canEnable,
  onDisable,
  onEnable,
}: {
  enabled: boolean;
  canEnable: boolean;
  onDisable: () => void;
  onEnable: () => void;
}) {
  const { t } = useI18n();

  return (
    <div className="reel-panel__section">
      <h3>{t("reel.ui.discovery")}</h3>
      <p className="reel-panel__note">
        {enabled ? t("reel.ui.discoveryActive") : t("reel.ui.discoveryInactive")}
      </p>
      {enabled ? (
        <button type="button" className="reel-panel__secondary" onClick={onDisable}>
          {t("reel.ui.disableDiscovery")}
        </button>
      ) : (
        <button
          type="button"
          className="reel-panel__primary"
          onClick={onEnable}
          disabled={!canEnable}
        >
          {t("reel.ui.enableDiscovery")}
        </button>
      )}
    </div>
  );
}
