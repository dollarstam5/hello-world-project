import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import type { PublicFlash, ScanQuery, ScanResult } from "@eco/core-contracts";
import { FLASH_SCOPE_RADIUS_METERS } from "@eco/core-contracts";
import { defaultLocale, messages } from "@/lib/i18n/messages";
import { useI18nStore } from "@/lib/i18n/useI18n";
import { useLiveFlashes } from "../data";
import { nearbyFlashFeed } from "../api/flash.functions";
import { selectFlashFeedItems } from "../model/demo-flashes";

export type FlashFeedSource = "remote" | "offline";

type Coordinates = Pick<ScanQuery, "latitude" | "longitude">;

function toPublicFlash(row: ScanResult): PublicFlash {
  return {
    id: row.id,
    kind: row.kind,
    category: row.category,
    title: row.title,
    timeSlot: row.timeSlot,
    areaLabel: row.areaLabel,
    expiresAt: row.expiresAt,
    createdAt: row.createdAt,
    ...(row.authorPreview ? { authorPreview: row.authorPreview } : {}),
  };
}

export function useFlashFeed() {
  const localRows = useLiveFlashes();
  const loadNearby = useServerFn(nearbyFlashFeed);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [remoteRows, setRemoteRows] = useState<PublicFlash[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [feedFailed, setFeedFailed] = useState(false);
  const activeRef = useRef(true);

  const offlineRows = useMemo<PublicFlash[]>(
    () =>
      (localRows ?? []).map((flash) => ({
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

  const searchNearby = useCallback(
    async (point: Coordinates) => {
      if (typeof navigator !== "undefined" && !navigator.onLine) return;
      setLoading(true);
      setError(undefined);
      setFeedFailed(false);
      try {
        const query: ScanQuery = {
          text: "",
          category: null,
          latitude: point.latitude,
          longitude: point.longitude,
          radiusKm: FLASH_SCOPE_RADIUS_METERS.whole_city / 1000,
          limit: 50,
        };
        const results = await loadNearby({ data: query });
        if (activeRef.current) {
          setRemoteRows(results.map(toPublicFlash));
          setError(undefined);
        }
      } catch {
        if (activeRef.current) {
          const locale = useI18nStore.getState().locale;
          setError(
            messages[locale]["flash.feed.error"] ?? messages[defaultLocale]["flash.feed.error"],
          );
          setFeedFailed(true);
        }
      } finally {
        if (activeRef.current) setLoading(false);
      }
    },
    [loadNearby],
  );

  const requestLocation = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      const locale = useI18nStore.getState().locale;
      setError(messages[locale]["flash.location.unavailable"]);
      return;
    }
    setError(undefined);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          maximumAge: 60_000,
          timeout: 12_000,
        });
      });
      const point = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      setCoordinates(point);
      await searchNearby(point);
    } catch (reason) {
      const code = (reason as GeolocationPositionError)?.code;
      const locale = useI18nStore.getState().locale;
      const key =
        code === 1
          ? "flash.location.permission"
          : code === 3
            ? "flash.location.timeout"
            : "flash.location.error";
      setError(messages[locale][key] ?? messages[defaultLocale][key]);
    }
  }, [searchNearby]);

  const refresh = useCallback(async () => {
    if (typeof navigator !== "undefined" && !navigator.onLine) return;
    if (!coordinates) {
      await requestLocation();
      return;
    }
    await searchNearby(coordinates);
  }, [coordinates, requestLocation, searchNearby]);

  useEffect(() => {
    activeRef.current = true;
    const handleOnline = () => {
      if (coordinates) void searchNearby(coordinates);
    };
    window.addEventListener("online", handleOnline);
    return () => {
      activeRef.current = false;
      window.removeEventListener("online", handleOnline);
    };
  }, [coordinates, searchNearby]);

  const isOffline = typeof navigator !== "undefined" && !navigator.onLine;
  const rows = useMemo<PublicFlash[]>(() => {
    if (!coordinates && !isOffline) return [];
    if (!remoteRows) return offlineRows;
    const remoteIds = new Set(remoteRows.map((row) => row.id));
    const pendingLocal = offlineRows.filter((row) => !remoteIds.has(row.id));
    return [...pendingLocal, ...remoteRows];
  }, [coordinates, isOffline, remoteRows, offlineRows]);

  const canShowDemo =
    !loading && localRows !== undefined && (remoteRows !== null || feedFailed || isOffline);
  const presentedRows = useMemo(() => selectFlashFeedItems(rows, canShowDemo), [rows, canShowDemo]);

  return {
    rows: presentedRows,
    source: remoteRows !== null ? ("remote" as const) : ("offline" as const),
    loading,
    error,
    needsLocation: !coordinates && !isOffline,
    hasLocation: coordinates !== null,
    requestLocation,
    refresh,
  };
}
