import { useEffect, useState } from "react";
import { StatusBanner } from "@/components/app/StatusBanner";
import { useNetworkStatus } from "@/lib/platform/useNetworkStatus";
import { useSyncStatus } from "@/platform/offline";
import { useI18n } from "@/lib/i18n/useI18n";

/**
 * Shows connection loss and real worker synchronization states.
 * Never displays a success state or pending count that the worker did not report.
 */
export function OfflineBanner() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const net = useNetworkStatus();
  const sync = useSyncStatus();
  const { t } = useI18n();

  const isOffline = !net.online;
  const hasSyncActivity = sync.phase !== "idle" || sync.pendingCount > 0;

  if (!mounted || (!isOffline && !hasSyncActivity)) return null;

  const description =
    sync.pendingCount === 1
      ? t("sync.pending.one")
      : sync.pendingCount > 1
        ? `${sync.pendingCount} ${t("sync.pending.many")}`
        : isOffline
          ? t("offline.banner.desc")
          : undefined;

  return (
    <div className="px-4 pt-3">
      <StatusBanner
        status={isOffline || sync.phase === "offline" || sync.phase === "error" ? "warning" : "info"}
        title={isOffline ? t("offline.banner.title") : t(sync.messageKey)}
        description={description}
      />
    </div>
  );
}
