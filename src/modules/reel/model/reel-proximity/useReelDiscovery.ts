import { useEffect, useRef, useState } from "react";
import { requestReelLocation } from "@/modules/reel/api/reel-location.client";
import { resolveReelZone } from "@/modules/reel/api/reel-zone.functions";
import { discoverReelGuestNearby } from "@/modules/reel/api/reel-guest-session.functions";
import {
  listReelNearbyPresence,
  listReelNearbyGuestPresence,
} from "@/modules/reel/api/reel-presence.client";
import type {
  Person,
  RawNearbyPerson,
  PresenceCacheEntry,
} from "@/modules/reel/model/reel-proximity/reel-proximity.types";
import { CACHE_TTL_MS } from "@/modules/reel/model/reel-proximity/reel-proximity.constants";
import { distributePeopleHarmoniously } from "@/modules/reel/model/reel-proximity/reel-proximity.helpers";
import type { MessageKey } from "@/lib/i18n/messages";

// Shared cache preserved from the original controller-level module scope.
let presenceCache: PresenceCacheEntry | null = null;

type DiscoveryAccess = "prompt" | "requesting" | "granted" | "ignored" | "denied";

export function useReelDiscovery({
  access,
  t,
  guestAreaLabel,
  isPageVisible,
  setIsOnline,
  setIsRefreshingDiscovery,
  discoveryRequestId,
}: {
  access: { loading: boolean; mode: string };
  t: (key: MessageKey) => string;
  guestAreaLabel: string;
  isPageVisible: boolean;
  setIsOnline: (online: boolean) => void;
  setIsRefreshingDiscovery: (refreshing: boolean) => void;
  discoveryRequestId: { current: number };
}) {
  const [discoveryAccess, setDiscoveryAccess] = useState<DiscoveryAccess>("prompt");
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [discoveredPeople, setDiscoveredPeople] = useState<Person[]>([]);

  const requestDiscovery = async (forceRefresh = false) => {
    if (access.loading || !isPageVisible || (typeof navigator !== "undefined" && !navigator.onLine))
      return;

    const mode = access.mode === "guest" ? "guest" : "member";
    const cacheIsFresh =
      presenceCache?.mode === mode && Date.now() - presenceCache.timestamp < CACHE_TTL_MS;
    if (!forceRefresh && presenceCache?.mode === mode) {
      // SWR: display cached nearby profiles immediately, then refresh if stale.
      setDiscoveredPeople(presenceCache.people);
      setDiscoveryAccess("granted");
      if (cacheIsFresh) return;
    }

    const requestId = ++discoveryRequestId.current;
    setIsRefreshingDiscovery(true);
    if (!presenceCache || presenceCache.mode !== mode) setDiscoveryAccess("requesting");
    setLocationMessage(null);

    try {
      const fix = await requestReelLocation();
      if (!isPageVisible || requestId !== discoveryRequestId.current) return;
      let rawList: RawNearbyPerson[] = [];
      let areaLabel = "";

      if (access.mode === "guest") {
        rawList = await discoverReelGuestNearby({
          data: { latitude: fix.latitude, longitude: fix.longitude },
        });
        areaLabel = guestAreaLabel;
      } else {
        const zone = await resolveReelZone({
          data: {
            latitude: fix.latitude,
            longitude: fix.longitude,
            purpose: "discover",
            consent: true,
          },
        });
        areaLabel = zone.areaLabel;
        const [members, guests] = await Promise.all([
          listReelNearbyPresence(),
          listReelNearbyGuestPresence(),
        ]);
        rawList = [...members, ...guests];
      }

      if (!isPageVisible || requestId !== discoveryRequestId.current) return;
      const formatted = distributePeopleHarmoniously(rawList, areaLabel, t);
      presenceCache = { people: formatted, timestamp: Date.now(), mode };
      setDiscoveredPeople(formatted);
      setDiscoveryAccess("granted");
    } catch (error) {
      if (!isPageVisible || requestId !== discoveryRequestId.current) return;
      // Keep cached content on refresh failure; only mark denied when no usable cache exists.
      if (!presenceCache || presenceCache.mode !== mode) setDiscoveryAccess("denied");
      setLocationMessage(error instanceof Error ? error.message : "Localisation indisponible");
    } finally {
      if (requestId === discoveryRequestId.current) setIsRefreshingDiscovery(false);
    }
  };
  const discoveryRunner = useRef<((forceRefresh?: boolean) => Promise<void>) | null>(null);
  discoveryRunner.current = requestDiscovery;
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (discoveryAccess === "granted") void discoveryRunner.current?.(true);
    };
    const handleOffline = () => {
      setIsOnline(false);
      discoveryRequestId.current += 1;
      setIsRefreshingDiscovery(false);
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [discoveryAccess]);
  useEffect(() => {
    if (isPageVisible && discoveryAccess === "granted") void discoveryRunner.current?.(true);
  }, [isPageVisible, discoveryAccess]);

  const ignoreLocation = () => {
    presenceCache = null;
    discoveryRequestId.current += 1;
    setDiscoveryAccess("ignored");
    setDiscoveredPeople([]);
    setLocationMessage(null);
  };

  const discoveryEnabled = discoveryAccess === "granted";
  const availablePeople = discoveryEnabled ? discoveredPeople : [];

  return {
    discoveryAccess,
    locationMessage,
    discoveredPeople,
    discoveryEnabled,
    availablePeople,
    requestDiscovery,
    ignoreLocation,
  };
}
