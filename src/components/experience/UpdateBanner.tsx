import { useState } from "react";
import { RefreshCw, X } from "lucide-react";
import { canApplyUpdate, useAppUpdate } from "@/platform/pwa";
import { countPending, requestSyncNow, useSyncStatus, useSyncStatusStore } from "@/platform/offline";
import { useI18n } from "@/lib/i18n/useI18n";

/** Tells the person a newer version is ready and reloads on demand. */
export function UpdateBanner() {
  const { t } = useI18n();
  const { ready, applying, failed, apply } = useAppUpdate();
  const sync = useSyncStatus();
  const [dismissed, setDismissed] = useState(false);
  const [checking, setChecking] = useState(false);
  const [freshPendingCount, setFreshPendingCount] = useState<number | null>(null);
  const [freshPendingSyncTimestamp, setFreshPendingSyncTimestamp] = useState<number | null>(null);
  const [checkFailed, setCheckFailed] = useState(false);
  const freshPendingStillApplies =
    freshPendingCount !== null &&
    !(
      sync.isSettled &&
      (freshPendingCount === 0 || sync.lastSyncedAt !== freshPendingSyncTimestamp)
    );
  const safeToApply = canApplyUpdate(
    sync.phase,
    Math.max(sync.pendingCount, freshPendingStillApplies ? (freshPendingCount ?? 0) : 0),
  );

  async function handleApply() {
    if (applying || checking || !safeToApply) return;
    setChecking(true);
    setCheckFailed(false);
    try {
      const pendingCount = await countPending();
      const latestSync = useSyncStatusStore.getState();
      setFreshPendingCount(pendingCount);
      setFreshPendingSyncTimestamp(latestSync.lastSyncedAt);
      if (!canApplyUpdate(latestSync.phase, pendingCount)) {
        requestSyncNow();
        return;
      }
      apply();
    } catch {
      setCheckFailed(true);
    } finally {
      setChecking(false);
    }
  }

  if (!ready || dismissed) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-3 z-50 rounded-2xl border border-border/60 bg-background/95 p-3 shadow-lg backdrop-blur"
      style={{ bottom: "calc(6.5rem + var(--safe-bottom))" }}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <RefreshCw aria-hidden className={applying ? "size-4 animate-spin" : "size-4"} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{t("update.title")}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{t("update.subtitle")}</p>
          {!safeToApply ? (
            <p className="mt-1 text-xs text-muted-foreground">
{t("update.waitingForSync")}
            </p>
          ) : null}
          {checkFailed ? (
            <p role="alert" className="mt-1 text-xs text-destructive">
              {t("update.checkFailed")}
            </p>
          ) : null}
          {failed ? (
            <p role="alert" className="mt-1 text-xs text-destructive">
              {t("update.failed")}
            </p>
          ) : null}
          <button
            type="button"
            onClick={handleApply}
            disabled={applying || checking || !safeToApply}
            className="mt-2 inline-flex min-h-12 items-center rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          >
            {checking
              ? t("update.checking")
              : applying
                ? t("update.applying")
                : failed
                  ? t("update.retry")
                  : t("update.action")}
          </button>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label={t("update.dismiss")}
          className="flex min-h-12 min-w-12 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
