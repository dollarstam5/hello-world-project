import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import type { PublicFlash } from "@eco/core-contracts";
import { useI18n } from "@/lib/i18n/useI18n";
import { useLiveFlashes } from "../data";
import { getPublicFlashFeed } from "../api/flash.functions";

export type FlashFeedSource = "remote" | "offline";

export function useFlashFeed() {
  const { t } = useI18n();
  const localRows = useLiveFlashes() ?? [];
  const loadRemote = useServerFn(getPublicFlashFeed);
  const [remoteRows, setRemoteRows] = useState<PublicFlash[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const offlineRows = useMemo<PublicFlash[]>(
    () =>
      localRows.map((flash) => ({
        id: flash.id,
        kind: flash.kind ?? "offer",
        category: flash.category ?? "other",
        title: flash.title,
        timeSlot: flash.timeSlot ?? "now",
        areaLabel: flash.areaLabel ?? "",
        expiresAt: flash.expiresAt ?? 0,
        createdAt: flash.createdAt,
      })),
    [localRows],
  );

  useEffect(() => {
    let active = true;

    const refresh = async () => {
      if (typeof navigator !== "undefined" && !navigator.onLine) return;
      setLoading(true);
      try {
        const rows = await loadRemote();
        if (active) {
          setRemoteRows(rows);
          setError(undefined);
        }
      } catch {
        if (active) setError(t("flash.feed.error"));
      } finally {
        if (active) setLoading(false);
      }
    };

    void refresh();
    window.addEventListener("online", refresh);
    return () => {
      active = false;
      window.removeEventListener("online", refresh);
    };
  }, [loadRemote]);

  return {
    rows: remoteRows ?? offlineRows,
    source: remoteRows ? ("remote" as const) : ("offline" as const),
    loading,
    error,
  };
}
