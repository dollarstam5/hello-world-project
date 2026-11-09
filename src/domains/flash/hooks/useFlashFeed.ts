import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const activeRef = useRef(true);
  const translateRef = useRef(t);
  translateRef.current = t;

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

  const refresh = useCallback(async () => {
    if (typeof navigator !== "undefined" && !navigator.onLine) return;
    setLoading(true);
    try {
      const rows = await loadRemote();
      if (activeRef.current) {
        setRemoteRows(rows);
        setError(undefined);
      }
    } catch {
      if (activeRef.current) setError(translateRef.current("flash.feed.error"));
    } finally {
      if (activeRef.current) setLoading(false);
    }
  }, [loadRemote]);

  useEffect(() => {
    activeRef.current = true;
    void refresh();
    window.addEventListener("online", refresh);
    return () => {
      activeRef.current = false;
      window.removeEventListener("online", refresh);
    };
  }, [refresh]);

  const rows = useMemo<PublicFlash[]>(() => {
    if (!remoteRows) return offlineRows;
    const remoteIds = new Set(remoteRows.map((row) => row.id));
    const pendingLocal = offlineRows.filter((row) => !remoteIds.has(row.id));
    return [...pendingLocal, ...remoteRows];
  }, [remoteRows, offlineRows]);

  return {
    rows,
    source: remoteRows ? ("remote" as const) : ("offline" as const),
    loading,
    error,
    refresh,
  };
}
