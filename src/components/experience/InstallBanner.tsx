import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { useInstallPrompt } from "@/platform/pwa";
import { useI18n } from "@/lib/i18n/useI18n";
import { haptic } from "@/platform/device/haptics";

const STORAGE_KEY = "vitalis-install-banner-dismissed";

/** Invitation discrète et mémorisée pour installer l'application. */
export function InstallBanner() {
  const { t } = useI18n();
  const { available, install, manualInstructions } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(true);

  // Mémorise la fermeture pour ne plus harceler l'utilisateur
  useEffect(() => {
    try {
      const isDismissed = window.localStorage.getItem(STORAGE_KEY) === "true";
      setDismissed(isDismissed);
    } catch {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    haptic.tap();
    setDismissed(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignoré si le stockage privé est restreint
    }
  };

  const handleInstall = async () => {
    haptic.pulse();
    await install();
  };

  if (!available || dismissed) return null;

  return (
    <div
      role="region"
      aria-label={t("install.title")}
      className="fixed inset-x-3 z-40 rounded-2xl border border-white/10 bg-card/95 p-3 shadow-2xl backdrop-blur-xl transition-all sm:inset-x-auto sm:right-4 sm:w-96"
      style={{ bottom: "calc(5.5rem + var(--safe-bottom))" }}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Download className="size-4" aria-hidden />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-foreground">{t("install.title")}</p>
          <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground line-clamp-1">
            {manualInstructions === "ios"
              ? t("install.ios.instructions")
              : manualInstructions === "android"
                ? t("install.android.instructions")
                : t("install.subtitle")}
          </p>
        </div>

        {manualInstructions === null && (
          <button
            type="button"
            onClick={() => void handleInstall()}
            className="inline-flex items-center rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 active:scale-95"
          >
            {t("install.action")}
          </button>
        )}

        <button
          type="button"
          onClick={handleDismiss}
          aria-label={t("install.dismiss")}
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground active:scale-90"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
