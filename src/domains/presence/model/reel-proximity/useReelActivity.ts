import { useEffect, useRef } from "react";
import type { CommunicationRuntime } from "@/lib/communication/runtime";
import type { AccessContext } from "@/domains/presence/model/reel-proximity/reel-proximity.types";
import type { ActivityTab } from "@/domains/presence/model/reel-proximity/reel-proximity.types";
import { resetReelActivityProjection, useReelActivityProjection } from "@/domains/presence/model/reel-activity-projection";
import type { ReelConnection, ReelGuestConnection } from "@/domains/presence/api/reel-presence.client";

type Params = {
  access: AccessContext;
  communication: CommunicationRuntime;
  communicationRevision: unknown;
  panel: string | null;
  activityTab: ActivityTab;
  canUseMemberReel: boolean;
  activityIdentity: string | null;
  refreshBips: () => Promise<void>;
  refreshConnections: () => Promise<void>;
  receivedBips: unknown[];
  receivedGuestBips: unknown[];
  bipsLoadedForIdentity: string | null;
  connections: ReelConnection[];
  guestConnections: ReelGuestConnection[];
  connectionsLoadedForIdentity: string | null;
  setReceivedBips: (items: never[]) => void;
  setReceivedGuestBips: (items: never[]) => void;
  setConnections: (items: never[]) => void;
  setGuestConnections: (items: never[]) => void;
  setBipsLoadedForIdentity: (identity: string | null) => void;
  setConnectionsLoadedForIdentity: (identity: string | null) => void;
};

export function useReelActivity(params: Params) {
  const {
    access, communication, communicationRevision, panel, activityTab, canUseMemberReel,
    activityIdentity, refreshBips, refreshConnections, receivedBips, receivedGuestBips,
    bipsLoadedForIdentity, connections, guestConnections, connectionsLoadedForIdentity,
    setReceivedBips, setReceivedGuestBips, setConnections, setGuestConnections,
    setBipsLoadedForIdentity, setConnectionsLoadedForIdentity,
  } = params;
  const processedReelEvents = useRef(new Set<string>());
  const guestActivityRefreshInFlight = useRef(false);

  useEffect(() => {
    if (panel !== "activity" || (!canUseMemberReel && access.mode !== "guest")) return;
    const refreshVisibleActivity = async () => {
      if (access.mode === "guest" && document.visibilityState !== "visible") return;
      if (access.mode === "guest" && guestActivityRefreshInFlight.current) return;
      if (access.mode === "guest") guestActivityRefreshInFlight.current = true;
      try {
        if (activityTab === "bips") await refreshBips();
        else if (activityTab === "connections") await refreshConnections();
        else await Promise.all([refreshBips(), refreshConnections()]);
      } finally {
        if (access.mode === "guest") guestActivityRefreshInFlight.current = false;
      }
    };
    void refreshVisibleActivity();
    if (access.mode !== "guest") {
      window.addEventListener("vitalis:reel-activity-reconnected", refreshVisibleActivity);
      return () => window.removeEventListener("vitalis:reel-activity-reconnected", refreshVisibleActivity);
    }
    const refreshWhenAvailable = () => {
      if (document.visibilityState === "visible") void refreshVisibleActivity();
    };
    document.addEventListener("visibilitychange", refreshWhenAvailable);
    window.addEventListener("focus", refreshWhenAvailable);
    window.addEventListener("online", refreshWhenAvailable);
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
    const incoming = communication.getEvents().filter(
      (event) => event.source === "reel" && !processedReelEvents.current.has(event.id),
    );
    if (incoming.length === 0) return;
    incoming.forEach((event) => processedReelEvents.current.add(event.id));
    if (panel !== "activity") return;
    const refreshBipsNeeded = incoming.some((event) =>
      event.messageKey === "communication.event.reel.bipReceived" ||
      event.messageKey === "communication.event.reel.bipAccepted" ||
      event.messageKey === "communication.event.reel.bipDeclined",
    );
    const refreshConnectionsNeeded = incoming.some((event) =>
      event.messageKey === "communication.event.reel.bipAccepted" ||
      event.messageKey === "communication.event.reel.connectionClosed",
    );
    if (refreshBipsNeeded && (activityTab === "bips" || activityTab === "notifications")) void refreshBips();
    if (refreshConnectionsNeeded && (activityTab === "connections" || activityTab === "notifications")) void refreshConnections();
  }, [communicationRevision, communication, panel, activityTab, refreshBips, refreshConnections]);

  useEffect(() => {
    processedReelEvents.current.clear();
    setReceivedBips([]);
    setReceivedGuestBips([]);
    setConnections([]);
    setGuestConnections([]);
    setBipsLoadedForIdentity(null);
    setConnectionsLoadedForIdentity(null);
    resetReelActivityProjection();
  }, [activityIdentity, setReceivedBips, setReceivedGuestBips, setConnections, setGuestConnections, setBipsLoadedForIdentity, setConnectionsLoadedForIdentity]);

  useEffect(() => {
    const mode = access.mode === "guest" ? "guest" : canUseMemberReel ? "member" : null;
    if (!mode || !activityIdentity || bipsLoadedForIdentity !== activityIdentity) return;
    useReelActivityProjection.getState().publishBips(
      mode,
      mode === "guest" ? receivedGuestBips.length : receivedBips.length + receivedGuestBips.length,
    );
  }, [access.mode, canUseMemberReel, activityIdentity, bipsLoadedForIdentity, receivedBips, receivedGuestBips]);

  useEffect(() => {
    const mode = access.mode === "guest" ? "guest" : canUseMemberReel ? "member" : null;
    if (!mode || !activityIdentity || connectionsLoadedForIdentity !== activityIdentity) return;
    useReelActivityProjection.getState().publishConnections(
      mode,
      mode === "guest"
        ? guestConnections.filter((connection) => connection.status === "active").length
        : connections.filter((connection) => connection.status === "active").length +
          guestConnections.filter((connection) => connection.status === "active").length,
    );
  }, [access.mode, canUseMemberReel, activityIdentity, connectionsLoadedForIdentity, connections, guestConnections]);
}
