import { useCallback, useState } from "react";
import {
  closeReelConnection,
  listReelConnections,
  listReelGuestConnectionsForMember,
  closeReelGuestConnectionForMember,
  type ReelConnection,
  type ReelGuestConnection,
} from "@/domains/presence/api/reel-presence.client";
import {
  listMyReelGuestConnections,
  closeMyReelGuestConnection,
} from "@/domains/presence/api/reel-guest-session.functions";
import type { MessageKey } from "@/lib/i18n/messages";

type Access = {
  loading: boolean;
  mode: string;
  memberId?: string | null;
};

type Params = {
  access: Access;
  canUseMemberReel: boolean;
  activityIdentity: string | null;
  t: (key: MessageKey) => string;
};

export function useReelConnections({ access, canUseMemberReel, activityIdentity, t }: Params) {
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

  const endConnection = (connection: ReelConnection) => {
    if (connection.status === "active") setPendingConnectionEnd({ kind: "member", connection });
  };
  const endGuestConnection = (connection: ReelGuestConnection) => {
    if (connection.status === "active") setPendingConnectionEnd({ kind: "guest", connection });
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

  return {
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
  };
}
