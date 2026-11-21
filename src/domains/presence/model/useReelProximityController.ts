import { useCallback, useEffect, useRef, useState } from "react";
import { requestReelLocation } from "@/domains/presence/api/reel-location.client";
import {
  closeReelConnection,
  commandReelBip,
  listReelBips,
  listReelConnections,
  sendReelBip,
  sendReelBipToGuest,
  commandReelGuestBipMember,
  listReelGuestBipsForMember,
  listReelGuestConnectionsForMember,
  closeReelGuestConnectionForMember,
  type ReelBip,
  type ReelConnection,
  type ReelGuestBip,
  type ReelGuestConnection,
} from "@/domains/presence/api/reel-presence.client";
import { resolveReelZone } from "@/domains/presence/api/reel-zone.functions";
import {
  discoverReelGuestNearby,
  endReelGuestPresence,
  getMyReelGuestPresence,
  startReelGuestPresence,
  sendReelGuestBip,
  listMyReelGuestBips,
  commandMyReelGuestBip,
  listMyReelGuestConnections,
  closeMyReelGuestConnection,
} from "@/domains/presence/api/reel-guest-session.functions";
import {
  endReelPresence,
  getMyActiveReelPresence,
  listReelNearbyPresence,
  listReelNearbyGuestPresence,
  startReelPresence,
  type ReelPresence,
} from "@/domains/presence/api/reel-presence.client";
import { useAccessMode } from "@/domains/access-mode";
import { useReelMemberProfile } from "@/domains/presence/model/reel-proximity/useReelMemberProfile";
import { useReelLifecycle } from "@/domains/presence/model/reel-proximity/useReelLifecycle";
import { useI18n } from "@/lib/i18n/useI18n";
import { useCommunicationRuntime } from "@/lib/communication/CommunicationRuntimeProvider";
import { evaluateReelAccess } from "@/domains/presence/policy/reel-access-policy";
import {
  resetReelActivityProjection,
  useReelActivityProjection,
} from "@/domains/presence/model/reel-activity-projection";


import {
  type Person,
  type Panel,
  type ActivityTab,
  type ReelAmbiance,
  type RawNearbyPerson,
  type PresenceCacheEntry,
} from "@/domains/presence/model/reel-proximity/reel-proximity.types";
import { MAX_RING_PEOPLE, CACHE_TTL_MS } from "@/domains/presence/model/reel-proximity/reel-proximity.constants";
import { distributePeopleHarmoniously } from "@/domains/presence/model/reel-proximity/reel-proximity.helpers";
export type { Person, Panel, ActivityTab, ReelAmbiance } from "@/domains/presence/model/reel-proximity/reel-proximity.types";

export function useReelProximityController() {
  const { t } = useI18n();
  const access = useAccessMode();
  const communication = useCommunicationRuntime();
  const communicationRevision = communication.getSnapshot();
  const processedReelEvents = useRef(new Set<string>());
  const { memberAvatarUrl } = useReelMemberProfile(access);
  const {
    isPageVisible,
    isOnline,
    setIsOnline,
    isRefreshingDiscovery,
    setIsRefreshingDiscovery,
    discoveryRequestId,
  } = useReelLifecycle();
  const [discoveryAccess, setDiscoveryAccess] = useState<
    "prompt" | "requesting" | "granted" | "ignored" | "denied"
  >("prompt");
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [guestSessionLoading, setGuestSessionLoading] = useState(false);
  const [guestSessionMessage, setGuestSessionMessage] = useState<string | null>(null);
  const [discoveredPeople, setDiscoveredPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [activityTab, setActivityTab] = useState<ActivityTab>("notifications");
  const [radius, setRadius] = useState("100 m");
  const [duration, setDuration] = useState("2 h");
  const [loadedPresence, setLoadedPresence] = useState<{
    memberId: string;
    presence: ReelPresence | null;
  } | null>(null);
  const [presenceConsent, setPresenceConsent] = useState(false);
  const [guestPresenceConsent, setGuestPresenceConsent] = useState(false);
  const [guestDisplayName, setGuestDisplayName] = useState("");
  const [guestAreaLabel, setGuestAreaLabel] = useState(t("reel.controller.nearby"));
  const [guestAvatarKey, setGuestAvatarKey] = useState("avatar-blue");
  const [guestPresence, setGuestPresence] = useState<{
    id: string;
    display_name: string;
    avatar_key: string;
    area_label: string;
    description: string;
    radius_m: number;
    started_at: string;
    expires_at: string;
  } | null>(null);
  const [presenceDescription, setPresenceDescription] = useState(
    t("reel.controller.presenceDescription"),
  );
  const [presenceLoading, setPresenceLoading] = useState(false);
  const [presenceMessage, setPresenceMessage] = useState<string | null>(null);
  const [receivedBips, setReceivedBips] = useState<ReelBip[]>([]);
  const [bipsLoadedForIdentity, setBipsLoadedForIdentity] = useState<string | null>(null);
  const [receivedGuestBips, setReceivedGuestBips] = useState<ReelGuestBip[]>([]);
  const [bipsLoading, setBipsLoading] = useState(false);
  const [bipsMessage, setBipsMessage] = useState<string | null>(null);
  const [connections, setConnections] = useState<ReelConnection[]>([]);
  const [connectionsLoadedForIdentity, setConnectionsLoadedForIdentity] = useState<string | null>(
    null,
  );
  const [guestConnections, setGuestConnections] = useState<ReelGuestConnection[]>([]);
  const [connectionsLoading, setConnectionsLoading] = useState(false);
  const [connectionsMessage, setConnectionsMessage] = useState<string | null>(null);
  const [pendingConnectionEnd, setPendingConnectionEnd] = useState<
    | { kind: "member"; connection: ReelConnection }
    | { kind: "guest"; connection: ReelGuestConnection }
    | null
  >(null);
  const currentPresence =
    access.mode === "member" &&
    access.memberProfileState === "active" &&
    loadedPresence?.memberId === access.memberId
      ? loadedPresence.presence
      : null;
  const canUseMemberReel =
    access.mode === "member" && access.memberProfileState === "active" && !access.loading;
  const activityIdentity =
    access.mode === "member" && canUseMemberReel && access.memberId
      ? `member:${access.memberId}`
      : access.mode === "guest" && access.guest
        ? `guest:${access.guest.startedAt}`
        : null;

  useEffect(() => {
    if (access.loading || access.mode !== "guest") {
      if (access.mode !== "guest") setGuestPresence(null);
      return;
    }
    let cancelled = false;
    setDuration("1 h");
    void getMyReelGuestPresence()
      .then((presence) => {
        if (cancelled) return;
        setGuestPresence(presence);
        if (presence) {
          setGuestDisplayName(presence.display_name);
          setGuestAreaLabel(presence.area_label);
          setGuestAvatarKey(presence.avatar_key);
          setPresenceDescription(presence.description);
          const radiusLabel = presence.radius_m === 1000 ? "1 km" : `${presence.radius_m} m`;
          setRadius(radiusLabel);
          const remainingMinutes = Math.max(
            0,
            Math.round((Date.parse(presence.expires_at) - Date.now()) / 60_000),
          );
          const durationLabel =
            remainingMinutes <= 30
              ? "30 min"
              : remainingMinutes <= 60
                ? "1 h"
                : remainingMinutes <= 120
                  ? "2 h"
                  : remainingMinutes <= 180
                    ? "3 h"
                    : remainingMinutes <= 360
                      ? "6 h"
                      : remainingMinutes <= 720
                        ? "12 h"
                        : "24 h";
          setDuration(durationLabel);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setPresenceMessage(
            error instanceof Error ? error.message : t("reel.controller.guestPresenceMissing"),
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [access.loading, access.mode, access.guest?.startedAt, t]);

  useEffect(() => {
    let cancelled = false;
    const memberId = access.memberId;
    if (
      access.mode !== "member" ||
      access.memberProfileState !== "active" ||
      access.loading ||
      !memberId
    )
      return;
    void getMyActiveReelPresence()
      .then((presence) => {
        if (!cancelled) setLoadedPresence({ memberId, presence });
      })
      .catch(() => {
        if (!cancelled) setPresenceMessage(t("reel.controller.presenceCheckFailed"));
      });
    return () => {
      cancelled = true;
    };
  }, [access.mode, access.memberProfileState, access.loading, access.memberId, t]);

  const refreshBips = useCallback(async () => {
    if (access.loading) return;
    if (access.mode === "guest") {
      setBipsLoading(true);
      try {
        const rows = await listMyReelGuestBips();
        setReceivedGuestBips(
          rows.filter((bip: ReelGuestBip) => bip.is_recipient && bip.status === "pending"),
        );
        setReceivedBips([]);
        setBipsLoadedForIdentity(activityIdentity);
        setBipsMessage(null);
      } catch (error) {
        setBipsMessage(
          error instanceof Error ? error.message : t("reel.controller.bipsLoadFailed"),
        );
      } finally {
        setBipsLoading(false);
      }
      return;
    }
    if (!canUseMemberReel || !access.memberId) return;
    setBipsLoading(true);
    try {
      const [rows, crossModeRows] = await Promise.all([
        listReelBips(),
        listReelGuestBipsForMember(),
      ]);
      setReceivedBips(
        rows.filter((bip) => bip.recipient_id === access.memberId && bip.status === "pending"),
      );
      setReceivedGuestBips(
        crossModeRows.filter((bip) => bip.is_recipient && bip.status === "pending"),
      );
      setBipsLoadedForIdentity(activityIdentity);
      setBipsMessage(null);
    } catch (error) {
      setBipsMessage(error instanceof Error ? error.message : t("reel.controller.bipsLoadFailed"));
    } finally {
      setBipsLoading(false);
    }
  }, [access.loading, access.mode, access.memberId, canUseMemberReel, activityIdentity, t]);

  const refreshConnections = useCallback(async () => {
    if (access.loading) return;
    setConnectionsLoading(true);
    try {
      if (access.mode === "guest") {
        const rows = await listMyReelGuestConnections();
        setConnections([]);
        setGuestConnections(rows);
        setConnectionsLoadedForIdentity(activityIdentity);
        setConnectionsMessage(null);
        return;
      }
      if (!canUseMemberReel || !access.memberId) return;
      const [rows, crossModeRows] = await Promise.all([
        listReelConnections(),
        listReelGuestConnectionsForMember(),
      ]);
      setConnections(rows);
      setGuestConnections(crossModeRows);
      setConnectionsLoadedForIdentity(activityIdentity);
      setConnectionsMessage(null);
    } catch (error) {
      setConnectionsMessage(
        error instanceof Error ? error.message : t("reel.controller.connectionsLoadFailed"),
      );
    } finally {
      setConnectionsLoading(false);
    }
  }, [access.loading, access.mode, canUseMemberReel, access.memberId, activityIdentity, t]);

  // The app-scoped bridge owns the single member Realtime subscription.
  // Guests have no Realtime channel: refresh on app/network return and use a
  // low-frequency safety check only while their activity panel is visible.
  const guestActivityRefreshInFlight = useRef(false);
  useEffect(() => {
    if (panel !== "activity" || (!canUseMemberReel && access.mode !== "guest")) {
      return;
    }

    const refreshVisibleActivity = async () => {
      if (access.mode === "guest" && document.visibilityState !== "visible") return;
      if (access.mode === "guest" && guestActivityRefreshInFlight.current) return;

      if (access.mode === "guest") guestActivityRefreshInFlight.current = true;
      try {
        if (activityTab === "bips") {
          await refreshBips();
        } else if (activityTab === "connections") {
          await refreshConnections();
        } else {
          await Promise.all([refreshBips(), refreshConnections()]);
        }
      } finally {
        if (access.mode === "guest") guestActivityRefreshInFlight.current = false;
      }
    };

    void refreshVisibleActivity();
    if (access.mode !== "guest") {
      window.addEventListener("vitalis:reel-activity-reconnected", refreshVisibleActivity);
      return () => {
        window.removeEventListener("vitalis:reel-activity-reconnected", refreshVisibleActivity);
      };
    }

    const refreshWhenAvailable = () => {
      if (document.visibilityState === "visible") void refreshVisibleActivity();
    };
    document.addEventListener("visibilitychange", refreshWhenAvailable);
    window.addEventListener("focus", refreshWhenAvailable);
    window.addEventListener("online", refreshWhenAvailable);

    // 30 s safety refresh (down from 3 s); event/lifecycle driven refreshes
    // remain immediate and are coalesced while a read is already in flight.
    const poll = window.setInterval(() => {
      if (document.visibilityState === "visible") void refreshVisibleActivity();
    }, 30_000);

    return () => {
      window.clearInterval(poll);
      document.removeEventListener("visibilitychange", refreshWhenAvailable);
      window.removeEventListener("focus", refreshWhenAvailable);
      window.removeEventListener("online", refreshWhenAvailable);
      guestActivityRefreshInFlight.current = false;
    };
  }, [panel, activityTab, refreshBips, refreshConnections, canUseMemberReel, access.mode]);

  useEffect(() => {
    const incoming = communication
      .getEvents()
      .filter((event) => event.source === "reel" && !processedReelEvents.current.has(event.id));
    if (incoming.length === 0) return;
    incoming.forEach((event) => processedReelEvents.current.add(event.id));
    if (panel !== "activity") return;

    const refreshBipsNeeded = incoming.some(
      (event) =>
        event.messageKey === "communication.event.reel.bipReceived" ||
        event.messageKey === "communication.event.reel.bipAccepted" ||
        event.messageKey === "communication.event.reel.bipDeclined",
    );
    const refreshConnectionsNeeded = incoming.some(
      (event) =>
        event.messageKey === "communication.event.reel.bipAccepted" ||
        event.messageKey === "communication.event.reel.connectionClosed",
    );

    if (refreshBipsNeeded && (activityTab === "bips" || activityTab === "notifications")) {
      void refreshBips();
    }
    if (
      refreshConnectionsNeeded &&
      (activityTab === "connections" || activityTab === "notifications")
    ) {
      void refreshConnections();
    }
  }, [communicationRevision, communication, panel, activityTab, refreshBips, refreshConnections]);

  const endConnection = (connection: ReelConnection) => {
    if (connection.status === "active") {
      setPendingConnectionEnd({ kind: "member", connection });
    }
  };

  const sendBipToSelectedPerson = async (person?: Person) => {
    const targetPerson = person ?? selectedPerson;
    if (!targetPerson) return;
    try {
      const requestId = globalThis.crypto?.randomUUID?.();
      if (!requestId) throw new Error(t("reel.controller.deviceSecurityUnavailable"));
      if (access.mode === "guest") {
        if (!guestPresence) throw new Error(t("reel.controller.publishBeforeBip"));
        await sendReelGuestBip({
          data: {
            recipientActorKind: targetPerson.actorKind === "guest" ? "guest" : "member",
            recipientPresenceId: targetPerson.id,
            clientRequestId: requestId,
          },
        });
      } else if (canUseMemberReel && currentPresence) {
        if (targetPerson.actorKind === "guest") {
          await sendReelBipToGuest(targetPerson.id, requestId);
        } else {
          await sendReelBip(targetPerson.id, requestId);
        }
      } else {
        throw new Error(t("reel.controller.presenceBeforeBip"));
      }
      setBipsMessage(t("reel.controller.bipSent"));
      setSelectedPerson(null);
    } catch (error) {
      setBipsMessage(error instanceof Error ? error.message : t("reel.controller.bipSendFailed"));
    }
  };

  const resolveReceivedBip = async (bip: ReelBip, action: "accept" | "decline") => {
    try {
      await commandReelBip(bip.id, action);
      await Promise.all([
        refreshBips(),
        action === "accept" ? refreshConnections() : Promise.resolve(),
      ]);
      setBipsMessage(
        action === "accept"
          ? t("reel.controller.connectionEstablished")
          : t("reel.controller.bipDeclined"),
      );
    } catch (error) {
      setBipsMessage(error instanceof Error ? error.message : t("reel.controller.actionFailed"));
    }
  };

  const resolveGuestBip = async (bip: ReelGuestBip, action: "accept" | "decline") => {
    try {
      if (access.mode === "guest") {
        await commandMyReelGuestBip({ data: { bipId: bip.id, action } });
      } else {
        await commandReelGuestBipMember(bip.id, action);
      }
      await Promise.all([
        refreshBips(),
        action === "accept" ? refreshConnections() : Promise.resolve(),
      ]);
      setBipsMessage(
        action === "accept"
          ? t("reel.controller.connectionEstablished")
          : t("reel.controller.bipDeclined"),
      );
    } catch (error) {
      setBipsMessage(error instanceof Error ? error.message : "Cette action n’a pas pu aboutir.");
    }
  };

  const endGuestConnection = (connection: ReelGuestConnection) => {
    if (connection.status === "active") {
      setPendingConnectionEnd({ kind: "guest", connection });
    }
  };

  const confirmEndConnection = async () => {
    if (!pendingConnectionEnd) return;
    try {
      if (pendingConnectionEnd.kind === "member") {
        await closeReelConnection(pendingConnectionEnd.connection.connection_id);
      } else if (access.mode === "guest") {
        await closeMyReelGuestConnection({
          data: { connectionId: pendingConnectionEnd.connection.connection_id },
        });
      } else {
        await closeReelGuestConnectionForMember(pendingConnectionEnd.connection.connection_id);
      }
      await refreshConnections();
      setConnectionsMessage(t("reel.controller.connectionEnded"));
      setPendingConnectionEnd(null);
    } catch (error) {
      setConnectionsMessage(
        error instanceof Error ? error.message : t("reel.controller.connectionCloseFailed"),
      );
    }
  };

  useEffect(() => {
    processedReelEvents.current.clear();
    setReceivedBips([]);
    setReceivedGuestBips([]);
    setConnections([]);
    setGuestConnections([]);
    setBipsLoadedForIdentity(null);
    setConnectionsLoadedForIdentity(null);
    resetReelActivityProjection();
  }, [activityIdentity]);

  useEffect(() => {
    const mode = access.mode === "guest" ? "guest" : canUseMemberReel ? "member" : null;
    if (!mode || !activityIdentity || bipsLoadedForIdentity !== activityIdentity) return;
    useReelActivityProjection
      .getState()
      .publishBips(
        mode,
        mode === "guest"
          ? receivedGuestBips.length
          : receivedBips.length + receivedGuestBips.length,
      );
  }, [
    access.mode,
    canUseMemberReel,
    activityIdentity,
    bipsLoadedForIdentity,
    receivedBips,
    receivedGuestBips,
  ]);

  useEffect(() => {
    const mode = access.mode === "guest" ? "guest" : canUseMemberReel ? "member" : null;
    if (!mode || !activityIdentity || connectionsLoadedForIdentity !== activityIdentity) return;
    useReelActivityProjection
      .getState()
      .publishConnections(
        mode,
        mode === "guest"
          ? guestConnections.filter((connection) => connection.status === "active").length
          : connections.filter((connection) => connection.status === "active").length +
              guestConnections.filter((connection) => connection.status === "active").length,
      );
  }, [
    access.mode,
    canUseMemberReel,
    activityIdentity,
    connectionsLoadedForIdentity,
    connections,
    guestConnections,
  ]);

  const cancelEndConnection = () => setPendingConnectionEnd(null);

  const activatePresence = async () => {
    const decision = evaluateReelAccess(
      {
        access,
        presenceConsent: true,
        consents: ["reel_presence"],
        online: typeof navigator === "undefined" ? false : navigator.onLine,
      },
      "start_presence",
    );
    if (decision.status !== "server_check" || !presenceConsent) {
      setPresenceMessage(
        !presenceConsent ? t("reel.controller.consentRequired") : decision.message,
      );
      return;
    }

    setPresenceLoading(true);
    setPresenceMessage(null);
    try {
      const fix = await requestReelLocation();
      const zone = await resolveReelZone({
        data: {
          latitude: fix.latitude,
          longitude: fix.longitude,
          purpose: "presence",
          consent: true,
        },
      });
      if (!zone.grantId) throw new Error(t("reel.controller.presencePermissionFailed"));
      const radiusMeters = radius === "1 km" ? 1000 : Number.parseInt(radius, 10);
      const durationMinutes: Record<string, number> = {
        "30 min": 30,
        "1 h": 60,
        "2 h": 120,
        "3 h": 180,
        "6 h": 360,
        "12 h": 720,
        "24 h": 1440,
      };
      const presence = await startReelPresence({
        zoneGrantId: zone.grantId,
        areaLabel: zone.areaLabel,
        description: presenceDescription,
        radiusMeters: radiusMeters as 10 | 25 | 50 | 100 | 1000,
        durationMinutes: durationMinutes[duration] as 30 | 60 | 120 | 180 | 360 | 720 | 1440,
        consent: true,
      });
      if (access.memberId) setLoadedPresence({ memberId: access.memberId, presence });
      setPresenceMessage(t("reel.controller.presenceVisible"));
    } catch (error) {
      setPresenceMessage(
        error instanceof Error ? error.message : t("reel.controller.presenceActivationFailed"),
      );
    } finally {
      setPresenceLoading(false);
    }
  };

  const activateGuestPresence = async () => {
    if (access.mode !== "guest" || !guestPresenceConsent) {
      setPresenceMessage(t("reel.controller.visibilityConsent"));
      return;
    }
    const displayName = guestDisplayName.trim();
    const areaLabel = guestAreaLabel.trim();
    const description = presenceDescription.trim();
    if (!displayName || !areaLabel || !description) {
      setPresenceMessage(t("reel.controller.guestFieldsRequired"));
      return;
    }
    setPresenceLoading(true);
    setPresenceMessage(null);
    try {
      const fix = await requestReelLocation();
      const radiusMeters = radius === "1 km" ? 1000 : Number.parseInt(radius, 10);
      const durationMinutes: Record<string, number> = {
        "30 min": 30,
        "1 h": 60,
        "2 h": 120,
        "3 h": 180,
        "6 h": 360,
        "12 h": 720,
        "24 h": 1440,
      };
      const result = await startReelGuestPresence({
        data: {
          displayName,
          avatarKey: guestAvatarKey,
          areaLabel,
          description,
          radiusM: radiusMeters as 10 | 25 | 50 | 100 | 1000,
          latitude: fix.latitude,
          longitude: fix.longitude,
          durationMinutes: Math.min(durationMinutes[duration], 60) as 30 | 60,
          consent: true,
        },
      });
      const nextPresence = await getMyReelGuestPresence();
      if (!nextPresence || nextPresence.id !== result.presenceId) {
        throw new Error(t("reel.controller.presenceConfirmFailed"));
      }
      setGuestPresence(nextPresence);
      setGuestPresenceConsent(false);
      setPresenceMessage(t("reel.controller.presenceVisibleNearby"));
    } catch (error) {
      setPresenceMessage(
        error instanceof Error ? error.message : t("reel.controller.presenceActivationFailed"),
      );
    } finally {
      setPresenceLoading(false);
    }
  };

  const stopGuestPresence = async () => {
    if (!guestPresence) return;
    setPresenceLoading(true);
    setPresenceMessage(null);
    try {
      const result = await endReelGuestPresence({
        data: { presenceId: guestPresence.id },
      });
      if (!result.ended) throw new Error(t("reel.controller.presenceNotActive"));
      setGuestPresence(null);
      setPresenceMessage(t("reel.controller.presenceHidden"));
    } catch (error) {
      setPresenceMessage(
        error instanceof Error ? error.message : t("reel.controller.presenceStopFailed"),
      );
    } finally {
      setPresenceLoading(false);
    }
  };

  const stopPresence = async () => {
    if (!currentPresence) return;
    setPresenceLoading(true);
    setPresenceMessage(null);
    try {
      const ended = await endReelPresence(currentPresence.id);
      if (access.memberId)
        setLoadedPresence({
          memberId: access.memberId,
          presence: ended.status === "active" ? ended : null,
        });
      setPresenceMessage(t("reel.controller.presenceHidden"));
    } catch (error) {
      setPresenceMessage(
        error instanceof Error ? error.message : t("reel.controller.presenceStopFailed"),
      );
    } finally {
      setPresenceLoading(false);
    }
  };

  const beginGuestSession = async () => {
    setGuestSessionLoading(true);
    setGuestSessionMessage(null);
    try {
      await access.startGuestSession();
      setGuestSessionMessage(t("reel.controller.guestSessionReady"));
    } catch (error) {
      setGuestSessionMessage(
        error instanceof Error ? error.message : t("reel.controller.guestSessionOpenFailed"),
      );
    } finally {
      setGuestSessionLoading(false);
    }
  };

  const requestDiscovery = async (forceRefresh = false) => {
    if (access.loading || !isPageVisible || (typeof navigator !== "undefined" && !navigator.onLine)) return;

    const mode = access.mode === "guest" ? "guest" : "member";
    const cacheIsFresh = presenceCache?.mode === mode && Date.now() - presenceCache.timestamp < CACHE_TTL_MS;
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
          data: { latitude: fix.latitude, longitude: fix.longitude, purpose: "discover", consent: true },
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
  const activityEnabled = discoveryEnabled || Boolean(currentPresence) || Boolean(guestPresence);
  const availablePeople = discoveryEnabled ? discoveredPeople : [];

  const openProfile = (person: Person) => {
    setPanel(null);
    setSelectedPerson(person);
  };
  const closeProfile = () => {
    setSelectedPerson(null);
  };
  const openActivity = (tab: ActivityTab) => {
    setActivityTab(tab);
    setPanel("activity");
  };

  const visiblePeople = availablePeople.slice(0, MAX_RING_PEOPLE);
  const ambiance: ReelAmbiance = (() => {
    const count = visiblePeople.length;
    const isLive = Boolean(currentPresence || guestPresence);
    if (presenceLoading || discoveryAccess === "requesting" || isRefreshingDiscovery) {
      return { status: "scanning", count, labelKey: "reel.ambiance.scanning" };
    }
    if (isLive) {
      return { status: count >= 4 ? "dense" : "live", count, labelKey: count >= 4 ? "reel.ambiance.dense" : "reel.ambiance.live" };
    }
    if (count > 0) return { status: "dense", count, labelKey: "reel.ambiance.nearbyPeople" };
    return { status: "idle", count: 0, labelKey: "reel.ambiance.calm" };
  })();
  const nearbyPeople = availablePeople.slice(0, 3);
  const additionalCount = Math.max(0, availablePeople.length - 3);

  return {
    access,
    memberAvatarUrl,
    discoveryAccess,
    isPageVisible,
    isOnline,
    ambiance,
    isRefreshingDiscovery,
    locationMessage,
    guestSessionLoading,
    guestSessionMessage,
    selectedPerson,
    panel,
    setPanel,
    activityTab,
    setActivityTab,
    radius,
    setRadius,
    duration,
    setDuration,
    presenceConsent,
    setPresenceConsent,
    guestPresenceConsent,
    setGuestPresenceConsent,
    guestDisplayName,
    setGuestDisplayName,
    guestAreaLabel,
    setGuestAreaLabel,
    guestAvatarKey,
    setGuestAvatarKey,
    guestPresence,
    presenceDescription,
    setPresenceDescription,
    presenceLoading,
    presenceMessage,
    receivedBips,
    receivedGuestBips,
    bipsLoading,
    bipsMessage,
    connections,
    guestConnections,
    connectionsLoading,
    connectionsMessage,
    currentPresence,
    canUseMemberReel,
    discoveryEnabled,
    activityEnabled,
    availablePeople,
    visiblePeople,
    nearbyPeople,
    additionalCount,
    refreshBips,
    refreshConnections,
    endConnection,
    sendBipToSelectedPerson,
    resolveReceivedBip,
    resolveGuestBip,
    endGuestConnection,
    pendingConnectionEnd,
    confirmEndConnection,
    cancelEndConnection,
    activatePresence,
    activateGuestPresence,
    stopGuestPresence,
    stopPresence,
    beginGuestSession,
    requestDiscovery,
    ignoreLocation,
    openProfile,
    closeProfile,
    openActivity,
  };
}
