import { useReelPresence } from "@/modules/reel/model/reel-proximity/useReelPresence";
import { useReelDiscovery } from "@/modules/reel/model/reel-proximity/useReelDiscovery";
import { useReelBips } from "@/modules/reel/model/reel-proximity/useReelBips";
import { useReelConnections } from "@/modules/reel/model/reel-proximity/useReelConnections";
import { useReelActivity } from "@/modules/reel/model/reel-proximity/useReelActivity";
import { useAccessMode } from "@/modules/access-mode";
import { useReelMemberProfile } from "@/modules/reel/model/reel-proximity/useReelMemberProfile";
import { useReelLifecycle } from "@/modules/reel/model/reel-proximity/useReelLifecycle";
import { useReelMemberPresence } from "@/modules/reel/model/reel-proximity/useReelMemberPresence";
import { useReelGuestPresence } from "@/modules/reel/model/reel-proximity/useReelGuestPresence";
import { useReelGuestSession } from "@/modules/reel/model/reel-proximity/useReelGuestSession";
import { useReelPanelState } from "@/modules/reel/model/reel-proximity/useReelPanelState";
import { useI18n } from "@/lib/i18n/useI18n";
import { useCommunicationRuntime } from "@/lib/communication/CommunicationRuntimeProvider";
import { sendReelBip, sendReelBipToGuest } from "@/modules/reel/api/reel-presence.client";
import { sendReelGuestBip } from "@/modules/reel/api/reel-guest-session.functions";

import {
  type Person,
  type Panel,
  type ActivityTab,
  type ReelAmbiance,
} from "@/modules/reel/model/reel-proximity/reel-proximity.types";
import { MAX_RING_PEOPLE } from "@/modules/reel/model/reel-proximity/reel-proximity.constants";
export type {
  Person,
  Panel,
  ActivityTab,
  ReelAmbiance,
} from "@/modules/reel/model/reel-proximity/reel-proximity.types";

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
  const { guestSessionLoading, guestSessionMessage, beginGuestSession } = useReelGuestSession(
    access,
    t,
  );
  const {
    selectedPerson,
    setSelectedPerson,
    panel,
    setPanel,
    activityTab,
    setActivityTab,
    openProfile,
    closeProfile,
    openActivity,
  } = useReelPanelState();
  const presence = useReelPresence({ access, t });
  const { setLoadedPresence, currentPresence, canUseMemberReel } = useReelMemberPresence(
    access,
    t,
    presence.setPresenceMessage,
  );

  const {
    radius,
    setRadius,
    duration,
    setDuration,
    presenceConsent,
    setPresenceConsent,
    guestPresenceConsent,
    setGuestPresenceConsent,
    presenceDescription,
    setPresenceDescription,
    presenceLoading,
    presenceMessage,
    setPresenceMessage,
  } = presence;
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

  const activityIdentity =
    access.mode === "guest"
      ? access.guest?.startedAt == null
        ? null
        : `guest:${access.guest.startedAt}`
      : access.mode === "member" && access.memberId
        ? `member:${access.memberId}`
        : null;
  const {
    connections,
    setConnections,
    connectionsLoadedForIdentity,
    setConnectionsLoadedForIdentity,
    guestConnections,
    setGuestConnections,
    connectionsLoading,
    connectionsMessage,
    refreshConnections,
    endConnection,
    endGuestConnection,
    pendingConnectionEnd,
    confirmEndConnection,
    cancelEndConnection,
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
  });
  useReelActivity({
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

  const activatePresence = () => presence.activatePresence(setLoadedPresence);
  const activateGuestPresence = () =>
    presence.activateGuestPresence(
      { displayName: guestDisplayName, areaLabel: guestAreaLabel, avatarKey: guestAvatarKey },
      setGuestPresence,
    );
  const stopGuestPresence = () =>
    guestPresence ? presence.stopGuestPresence(guestPresence, setGuestPresence) : Promise.resolve();
  const stopPresence = () => presence.stopPresence(currentPresence, setLoadedPresence);

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

  const visiblePeople = availablePeople.slice(0, MAX_RING_PEOPLE);
  const ambiance: ReelAmbiance = (() => {
    const count = visiblePeople.length;
    const isLive = Boolean(currentPresence || guestPresence);
    if (presenceLoading || discoveryAccess === "requesting" || isRefreshingDiscovery) {
      return { status: "scanning", count, labelKey: "reel.ambiance.scanning" };
    }
    if (isLive) {
      return {
        status: count >= 4 ? "dense" : "live",
        count,
        labelKey: count >= 4 ? "reel.ambiance.dense" : "reel.ambiance.live",
      };
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
