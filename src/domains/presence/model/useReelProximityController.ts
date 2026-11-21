import { useCallback, useEffect, useRef, useState } from "react";
import { requestReelLocation } from "@/domains/presence/api/reel-location.client";
import { useReelDiscovery } from "@/domains/presence/model/reel-proximity/useReelDiscovery";
import { useReelBips } from "@/domains/presence/model/reel-proximity/useReelBips";
import { useReelConnections } from "@/domains/presence/model/reel-proximity/useReelConnections";
import { useReelActivity } from "@/domains/presence/model/reel-proximity/useReelActivity";
import { resolveReelZone } from "@/domains/presence/api/reel-zone.functions";
import {
  endReelPresence,
  startReelPresence,
} from "@/domains/presence/api/reel-presence.client";
import { useAccessMode } from "@/domains/access-mode";
import { useReelMemberProfile } from "@/domains/presence/model/reel-proximity/useReelMemberProfile";
import { useReelLifecycle } from "@/domains/presence/model/reel-proximity/useReelLifecycle";
import { useReelMemberPresence } from "@/domains/presence/model/reel-proximity/useReelMemberPresence";
import { useReelGuestPresence } from "@/domains/presence/model/reel-proximity/useReelGuestPresence";
import { useI18n } from "@/lib/i18n/useI18n";
import { useCommunicationRuntime } from "@/lib/communication/CommunicationRuntimeProvider";
import { evaluateReelAccess } from "@/domains/presence/policy/reel-access-policy";
} from "@/domains/presence/model/reel-activity-projection";


import {
  type Person,
  type Panel,
  type ActivityTab,
  type ReelAmbiance,
} from "@/domains/presence/model/reel-proximity/reel-proximity.types";
import { MAX_RING_PEOPLE } from "@/domains/presence/model/reel-proximity/reel-proximity.constants";
export type { Person, Panel, ActivityTab, ReelAmbiance } from "@/domains/presence/model/reel-proximity/reel-proximity.types";

export function useReelProximityController() {
  const { t } = useI18n();
  const access = useAccessMode();
  const communication = useCommunicationRuntime();
  const communicationRevision = communication.getSnapshot();
  const { memberAvatarUrl } = useReelMemberProfile(access);
  const {
    isPageVisible,
    isOnline,
    setIsOnline,
    isRefreshingDiscovery,
    setIsRefreshingDiscovery,
    discoveryRequestId,
  } = useReelLifecycle();
  const [guestSessionLoading, setGuestSessionLoading] = useState(false);
  const [guestSessionMessage, setGuestSessionMessage] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [activityTab, setActivityTab] = useState<ActivityTab>("notifications");
  const [radius, setRadius] = useState("100 m");
  const [duration, setDuration] = useState("2 h");
  const [presenceConsent, setPresenceConsent] = useState(false);
  const [guestPresenceConsent, setGuestPresenceConsent] = useState(false);
  const [presenceDescription, setPresenceDescription] = useState(
    t("reel.controller.presenceDescription"),
  );
  const [presenceLoading, setPresenceLoading] = useState(false);
  const [presenceMessage, setPresenceMessage] = useState<string | null>(null);
  const {
    guestDisplayName,
    setGuestDisplayName,
    guestAreaLabel,
    setGuestAreaLabel,
    guestAvatarKey,
    setGuestAvatarKey,
    guestPresence,
    setGuestPresence,
  } = useReelGuestPresence(
    access,
    t,
    setDuration,
    setRadius,
    setPresenceDescription,
    setPresenceMessage,
  );

  const {
    loadedPresence,
    setLoadedPresence,
    currentPresence,
    canUseMemberReel,
  } = useReelMemberPresence(access, t, setPresenceMessage);
  const {
    connections, setConnections, connectionsLoadedForIdentity, setConnectionsLoadedForIdentity,
    guestConnections, setGuestConnections, connectionsLoading, connectionsMessage,
    refreshConnections, endConnection, endGuestConnection, pendingConnectionEnd,
    confirmEndConnection, cancelEndConnection,
  } = useReelConnections({ access, canUseMemberReel, activityIdentity, t });

  const {
    receivedBips,
    receivedGuestBips,
    bipsLoading,
    bipsMessage,
    setBipsMessage,
    refreshBips,
    resolveReceivedBip,
    resolveGuestBip,
    setReceivedBips,
    setReceivedGuestBips,
    bipsLoadedForIdentity,
    setBipsLoadedForIdentity,
  } = useReelBips({
    access,
    canUseMemberReel,
    activityIdentity,
    t,
    refreshConnections,
  });  useReelActivity({
    access,
    communication,
    communicationRevision,
    panel,
    activityTab,
    canUseMemberReel,
    activityIdentity,
    refreshBips,
    refreshConnections,
    receivedBips,
    receivedGuestBips,
    bipsLoadedForIdentity,
    connections,
    guestConnections,
    connectionsLoadedForIdentity,
    setReceivedBips,
    setReceivedGuestBips,
    setConnections,
    setGuestConnections,
    setBipsLoadedForIdentity,
    setConnectionsLoadedForIdentity,
  });



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

  const {
    discoveryAccess,
    locationMessage,
    discoveryEnabled,
    availablePeople,
    requestDiscovery,
    ignoreLocation,
  } = useReelDiscovery({
    access,
    t,
    guestAreaLabel,
    isPageVisible,
    setIsOnline,
    setIsRefreshingDiscovery,
    discoveryRequestId,
  });
  const activityEnabled = discoveryEnabled || Boolean(currentPresence) || Boolean(guestPresence);
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
