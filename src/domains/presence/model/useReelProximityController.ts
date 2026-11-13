import { useCallback, useEffect, useState } from "react";
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
import { evaluateReelAccess } from "@/domains/presence/policy/reel-access-policy";
import { subscribeToReelMemberActivity } from "@/domains/presence/services/reel-activity-realtime.service";
import { getMyProfileAvatarUrl } from "@/domains/profile/api/profile-avatar.client";
import { useI18n } from "@/lib/i18n/useI18n";

export interface Person {
  id: string;
  name: string;
  avatarUrl: string | null;
  initials: string;
  angle: number;
  description?: string | null;
  category?: string | null;
  locationLabel?: string | null;
  distanceLabel?: string | null;
  actorKind?: "member" | "guest";
  avatarKey?: string | null;
}

export type Panel = "settings" | "activity" | "people" | "global" | null;
export type ActivityTab = "notifications" | "bips" | "connections";

const MAX_RING_PEOPLE = 9;

export function useReelProximityController() {
  const { t } = useI18n();
  const access = useAccessMode();
  const [memberAvatarUrl, setMemberAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setMemberAvatarUrl(null);

    if (
      access.loading ||
      access.mode !== "member" ||
      !access.memberId ||
      access.memberProfileState !== "active"
    ) {
      return () => {
        active = false;
      };
    }

    void getMyProfileAvatarUrl(access.memberId).then((avatarUrl) => {
      if (active) setMemberAvatarUrl(avatarUrl);
    });

    return () => {
      active = false;
    };
  }, [access.loading, access.mode, access.memberId, access.memberProfileState]);

  const [discoveryAccess, setDiscoveryAccess] = useState<
    "prompt" | "requesting" | "granted" | "ignored" | "denied"
  >("prompt");
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [guestSessionLoading, setGuestSessionLoading] = useState(false);
  const [guestSessionMessage, setGuestSessionMessage] = useState<string | null>(null);
  const [discoveredPeople, setDiscoveredPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showFullProfile, setShowFullProfile] = useState(false);
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
  const [receivedGuestBips, setReceivedGuestBips] = useState<ReelGuestBip[]>([]);
  const [bipsLoading, setBipsLoading] = useState(false);
  const [bipsMessage, setBipsMessage] = useState<string | null>(null);
  const [connections, setConnections] = useState<ReelConnection[]>([]);
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
      setBipsMessage(null);
    } catch (error) {
      setBipsMessage(error instanceof Error ? error.message : t("reel.controller.bipsLoadFailed"));
    } finally {
      setBipsLoading(false);
    }
  }, [access.loading, access.mode, access.memberId, canUseMemberReel, t]);

  useEffect(() => {
    if (
      panel !== "activity" ||
      activityTab !== "bips" ||
      (!canUseMemberReel && access.mode !== "guest")
    ) {
      return;
    }
    void refreshBips();
    if (access.mode === "guest") {
      const poll = window.setInterval(() => void refreshBips(), 3000);
      return () => window.clearInterval(poll);
    }
    return subscribeToReelMemberActivity(access.memberId, () => void refreshBips(), [
      "reel_bips",
      "reel_connections",
    ]);
  }, [panel, activityTab, refreshBips, access.memberId, canUseMemberReel, access.mode]);

  const refreshConnections = useCallback(async () => {
    if (access.loading) return;
    setConnectionsLoading(true);
    try {
      if (access.mode === "guest") {
        const rows = await listMyReelGuestConnections();
        setConnections([]);
        setGuestConnections(rows);
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
      setConnectionsMessage(null);
    } catch (error) {
      setConnectionsMessage(
        error instanceof Error ? error.message : t("reel.controller.connectionsLoadFailed"),
      );
    } finally {
      setConnectionsLoading(false);
    }
  }, [access.loading, access.mode, canUseMemberReel, access.memberId, t]);

  useEffect(() => {
    if (
      panel !== "activity" ||
      activityTab !== "connections" ||
      (!canUseMemberReel && access.mode !== "guest")
    ) {
      return;
    }
    void refreshConnections();
    if (access.mode === "guest") {
      const poll = window.setInterval(() => void refreshConnections(), 3000);
      return () => window.clearInterval(poll);
    }
    return subscribeToReelMemberActivity(access.memberId, () => void refreshConnections(), [
      "reel_connections",
    ]);
  }, [panel, activityTab, refreshConnections, access.memberId, canUseMemberReel, access.mode]);

  const endConnection = (connection: ReelConnection) => {
    if (connection.status === "active") {
      setPendingConnectionEnd({ kind: "member", connection });
    }
  };

  const sendBipToSelectedPerson = async () => {
    if (!selectedPerson) return;
    try {
      const requestId = globalThis.crypto?.randomUUID?.();
      if (!requestId) throw new Error(t("reel.controller.deviceSecurityUnavailable"));
      if (access.mode === "guest") {
        if (!guestPresence) throw new Error(t("reel.controller.publishBeforeBip"));
        await sendReelGuestBip({
          data: {
            recipientActorKind: selectedPerson.actorKind === "guest" ? "guest" : "member",
            recipientPresenceId: selectedPerson.id,
            clientRequestId: requestId,
          },
        });
      } else if (canUseMemberReel && currentPresence) {
        if (selectedPerson.actorKind === "guest") {
          await sendReelBipToGuest(selectedPerson.id, requestId);
        } else {
          await sendReelBip(selectedPerson.id, requestId);
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
      await refreshBips();
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
      await refreshBips();
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

  const requestDiscovery = async () => {
    if (access.loading) return;
    setDiscoveryAccess("requesting");
    setLocationMessage(null);
    try {
      const fix = await requestReelLocation();
      if (access.mode === "guest") {
        const rows = await discoverReelGuestNearby({
          data: { latitude: fix.latitude, longitude: fix.longitude },
        });
        setDiscoveredPeople(
          rows.map((person, index) => ({
            id: person.presence_id,
            name: person.display_name || "Profil Vitalis",
            avatarUrl: null,
            avatarKey: person.avatar_key,
            initials: (person.display_name || "V")
              .trim()
              .split(/\s+/)
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase() ?? "")
              .join(""),
            angle: (index * 137.5) % 360,
            description: person.description,
            locationLabel: person.area_label,
            actorKind: person.actor_kind,
          })),
        );
      } else {
        const decision = evaluateReelAccess(
          {
            access,
            discoveryConsent: true,
            online: typeof navigator === "undefined" ? false : navigator.onLine,
          },
          "discover_presence",
        );
        if (decision.status !== "server_check") throw new Error(decision.message);
        const zone = await resolveReelZone({
          data: {
            latitude: fix.latitude,
            longitude: fix.longitude,
            purpose: "discover",
            consent: true,
          },
        });
        const [members, guests] = await Promise.all([
          listReelNearbyPresence(),
          listReelNearbyGuestPresence(),
        ]);
        const memberCards = members.map((person, index) => ({
          id: person.presence_id,
          name: person.display_name || "Profil Vitalis",
          avatarUrl: null,
          initials: (person.display_name || "V")
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? "")
            .join(""),
          angle: (index * 137.5) % 360,
          description: person.description,
          locationLabel: person.area_label || zone.areaLabel,
          actorKind: "member" as const,
        }));
        const guestCards = guests.map((person, index) => ({
          id: person.presence_id,
          name: person.display_name || t("reel.controller.guestName"),
          avatarUrl: null,
          avatarKey: person.avatar_key,
          initials: (person.display_name || "I")
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? "")
            .join(""),
          angle: ((members.length + index) * 137.5) % 360,
          description: person.description,
          locationLabel: person.area_label || zone.areaLabel,
          actorKind: "guest" as const,
        }));
        setDiscoveredPeople([...memberCards, ...guestCards]);
      }
      setDiscoveryAccess("granted");
    } catch (error) {
      setDiscoveryAccess("denied");
      setLocationMessage(
        error instanceof Error ? error.message : t("reel.controller.discoveryUnavailable"),
      );
    }
  };
  const ignoreLocation = () => {
    setDiscoveryAccess("ignored");
    setDiscoveredPeople([]);
    setLocationMessage(null);
  };
  const discoveryEnabled = discoveryAccess === "granted";
  const activityEnabled =
    discoveryEnabled ||
    Boolean(currentPresence) ||
    Boolean(guestPresence) ||
    canUseMemberReel ||
    access.mode === "guest";
  const availablePeople = discoveryEnabled ? discoveredPeople : [];

  const openProfile = (person: Person) => {
    setPanel(null);
    setSelectedPerson(person);
    setShowFullProfile(false);
  };
  const closeProfile = () => {
    setSelectedPerson(null);
    setShowFullProfile(false);
  };
  const openActivity = (tab: ActivityTab) => {
    setActivityTab(tab);
    setPanel("activity");
  };

  const visiblePeople = availablePeople.slice(0, MAX_RING_PEOPLE);
  const nearbyPeople = availablePeople.slice(0, 3);
  const additionalCount = Math.max(0, availablePeople.length - 3);

  return {
import { useCallback, useEffect, useState } from "react";
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
import { useI18n } from "@/lib/i18n/useI18n";
import { getMyProfileAvatarUrl } from "@/domains/profile/api/profile-avatar.client";
import { evaluateReelAccess } from "@/domains/presence/policy/reel-access-policy";
import { subscribeToReelMemberActivity } from "@/domains/presence/services/reel-activity-realtime.service";

export interface Person {
  id: string;
  name: string;
  avatarUrl: string | null;
  initials: string;
  angle: number;
  description?: string | null;
  category?: string | null;
  locationLabel?: string | null;
  distanceLabel?: string | null;
  actorKind?: "member" | "guest";
  avatarKey?: string | null;
}

export type Panel = "settings" | "activity" | "people" | "global" | null;
export type ActivityTab = "notifications" | "bips" | "connections";

const MAX_RING_PEOPLE = 9;

export function useReelProximityController() {
  const { t } = useI18n();
  const access = useAccessMode();
  const [memberAvatarUrl, setMemberAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setMemberAvatarUrl(null);

    if (
      access.loading ||
      access.mode !== "member" ||
      !access.memberId ||
      access.memberProfileState !== "active"
    ) {
      return () => {
        active = false;
      };
    }

    void getMyProfileAvatarUrl(access.memberId).then((avatarUrl) => {
      if (active) setMemberAvatarUrl(avatarUrl);
    });

    return () => {
      active = false;
    };
  }, [access.loading, access.mode, access.memberId, access.memberProfileState]);

  const [discoveryAccess, setDiscoveryAccess] = useState<
    "prompt" | "requesting" | "granted" | "ignored" | "denied"
  >("prompt");
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [guestSessionLoading, setGuestSessionLoading] = useState(false);
  const [guestSessionMessage, setGuestSessionMessage] = useState<string | null>(null);
  const [discoveredPeople, setDiscoveredPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showFullProfile, setShowFullProfile] = useState(false);
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
  const [receivedGuestBips, setReceivedGuestBips] = useState<ReelGuestBip[]>([]);
  const [bipsLoading, setBipsLoading] = useState(false);
  const [bipsMessage, setBipsMessage] = useState<string | null>(null);
  const [connections, setConnections] = useState<ReelConnection[]>([]);
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
      setBipsMessage(null);
    } catch (error) {
      setBipsMessage(error instanceof Error ? error.message : t("reel.controller.bipsLoadFailed"));
    } finally {
      setBipsLoading(false);
    }
  }, [access.loading, access.mode, access.memberId, canUseMemberReel, t]);

  useEffect(() => {
    if (
      panel !== "activity" ||
      activityTab !== "bips" ||
      (!canUseMemberReel && access.mode !== "guest")
    ) {
      return;
    }
    void refreshBips();
    if (access.mode === "guest") {
      const poll = window.setInterval(() => void refreshBips(), 3000);
      return () => window.clearInterval(poll);
    }
    return subscribeToReelMemberActivity(access.memberId, () => void refreshBips(), [
      "reel_bips",
      "reel_connections",
    ]);
  }, [panel, activityTab, refreshBips, access.memberId, canUseMemberReel, access.mode]);

  const refreshConnections = useCallback(async () => {
    if (access.loading) return;
    setConnectionsLoading(true);
    try {
      if (access.mode === "guest") {
        const rows = await listMyReelGuestConnections();
        setConnections([]);
        setGuestConnections(rows);
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
      setConnectionsMessage(null);
    } catch (error) {
      setConnectionsMessage(
        error instanceof Error ? error.message : t("reel.controller.connectionsLoadFailed"),
      );
    } finally {
      setConnectionsLoading(false);
    }
  }, [access.loading, access.mode, canUseMemberReel, access.memberId, t]);

  useEffect(() => {
    if (
      panel !== "activity" ||
      activityTab !== "connections" ||
      (!canUseMemberReel && access.mode !== "guest")
    ) {
      return;
    }
    void refreshConnections();
    if (access.mode === "guest") {
      const poll = window.setInterval(() => void refreshConnections(), 3000);
      return () => window.clearInterval(poll);
    }
    return subscribeToReelMemberActivity(access.memberId, () => void refreshConnections(), [
      "reel_connections",
    ]);
  }, [panel, activityTab, refreshConnections, access.memberId, canUseMemberReel, access.mode]);

  const endConnection = (connection: ReelConnection) => {
    if (connection.status === "active") {
      setPendingConnectionEnd({ kind: "member", connection });
    }
  };

  const sendBipToSelectedPerson = async () => {
    if (!selectedPerson) return;
    try {
      const requestId = globalThis.crypto?.randomUUID?.();
      if (!requestId) throw new Error(t("reel.controller.deviceSecurityUnavailable"));
      if (access.mode === "guest") {
        if (!guestPresence) throw new Error(t("reel.controller.publishBeforeBip"));
        await sendReelGuestBip({
          data: {
            recipientActorKind: selectedPerson.actorKind === "guest" ? "guest" : "member",
            recipientPresenceId: selectedPerson.id,
            clientRequestId: requestId,
          },
        });
      } else if (canUseMemberReel && currentPresence) {
        if (selectedPerson.actorKind === "guest") {
          await sendReelBipToGuest(selectedPerson.id, requestId);
        } else {
          await sendReelBip(selectedPerson.id, requestId);
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
      await refreshBips();
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
      await refreshBips();
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

  const requestDiscovery = async () => {
    if (access.loading) return;
    setDiscoveryAccess("requesting");
    setLocationMessage(null);
    try {
      const fix = await requestReelLocation();
      if (access.mode === "guest") {
        const rows = await discoverReelGuestNearby({
          data: { latitude: fix.latitude, longitude: fix.longitude },
        });
        setDiscoveredPeople(
          rows.map((person, index) => ({
            id: person.presence_id,
            name: person.display_name || "Profil Vitalis",
            avatarUrl: null,
            avatarKey: person.avatar_key,
            initials: (person.display_name || "V")
              .trim()
              .split(/\s+/)
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase() ?? "")
              .join(""),
            angle: (index * 137.5) % 360,
            description: person.description,
            locationLabel: person.area_label,
            actorKind: person.actor_kind,
          })),
        );
      } else {
        const decision = evaluateReelAccess(
          {
            access,
            discoveryConsent: true,
            online: typeof navigator === "undefined" ? false : navigator.onLine,
          },
          "discover_presence",
        );
        if (decision.status !== "server_check") throw new Error(decision.message);
        const zone = await resolveReelZone({
          data: {
            latitude: fix.latitude,
            longitude: fix.longitude,
            purpose: "discover",
            consent: true,
          },
        });
        const [members, guests] = await Promise.all([
          listReelNearbyPresence(),
          listReelNearbyGuestPresence(),
        ]);
        const memberCards = members.map((person, index) => ({
          id: person.presence_id,
          name: person.display_name || "Profil Vitalis",
          avatarUrl: null,
          initials: (person.display_name || "V")
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? "")
            .join(""),
          angle: (index * 137.5) % 360,
          description: person.description,
          locationLabel: person.area_label || zone.areaLabel,
          actorKind: "member" as const,
        }));
        const guestCards = guests.map((person, index) => ({
          id: person.presence_id,
          name: person.display_name || t("reel.controller.guestName"),
          avatarUrl: null,
          avatarKey: person.avatar_key,
          initials: (person.display_name || "I")
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? "")
            .join(""),
          angle: ((members.length + index) * 137.5) % 360,
          description: person.description,
          locationLabel: person.area_label || zone.areaLabel,
          actorKind: "guest" as const,
        }));
        setDiscoveredPeople([...memberCards, ...guestCards]);
      }
      setDiscoveryAccess("granted");
    } catch (error) {
      setDiscoveryAccess("denied");
      setLocationMessage(
        error instanceof Error ? error.message : t("reel.controller.discoveryUnavailable"),
      );
    }
  };
  const ignoreLocation = () => {
    setDiscoveryAccess("ignored");
    setDiscoveredPeople([]);
    setLocationMessage(null);
  };
  const discoveryEnabled = discoveryAccess === "granted";
  const activityEnabled =
    discoveryEnabled ||
    Boolean(currentPresence) ||
    Boolean(guestPresence) ||
    canUseMemberReel ||
    access.mode === "guest";
  const availablePeople = discoveryEnabled ? discoveredPeople : [];

  const openProfile = (person: Person) => {
    setPanel(null);
    setSelectedPerson(person);
    setShowFullProfile(false);
  };
  const closeProfile = () => {
    setSelectedPerson(null);
    setShowFullProfile(false);
  };
  const openActivity = (tab: ActivityTab) => {
    setActivityTab(tab);
    setPanel("activity");
  };

  const visiblePeople = availablePeople.slice(0, MAX_RING_PEOPLE);
  const nearbyPeople = availablePeople.slice(0, 3);
  const additionalCount = Math.max(0, availablePeople.length - 3);

  return {
    access,
    memberAvatarUrl,
    discoveryAccess,
    locationMessage,
    guestSessionLoading,
    guestSessionMessage,
    selectedPerson,
    showFullProfile,
    setShowFullProfile,
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
