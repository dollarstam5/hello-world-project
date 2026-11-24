import { useCallback, useState } from "react";
import {
  commandReelBip,
  commandReelGuestBipMember,
  listReelBips,
  listReelGuestBipsForMember,
  type ReelBip,
  type ReelGuestBip,
} from "@/domains/presence/api/reel-presence.client";
import {
  listMyReelGuestBips,
  commandMyReelGuestBip,
} from "@/domains/presence/api/reel-guest-session.functions";

type AccessContext = { loading: boolean; mode: string; memberId?: string | null };

export function useReelBips({
  access,
  canUseMemberReel,
  activityIdentity,
  t,
  refreshConnections,
}: {
  access: AccessContext;
  canUseMemberReel: boolean;
  activityIdentity: string | null;
  t: (key: MessageKey) => string;
  refreshConnections: () => Promise<void>;
}) {
  const [receivedBips, setReceivedBips] = useState<ReelBip[]>([]);
  const [bipsLoadedForIdentity, setBipsLoadedForIdentity] = useState<string | null>(null);
  const [receivedGuestBips, setReceivedGuestBips] = useState<ReelGuestBip[]>([]);
  const [bipsLoading, setBipsLoading] = useState(false);
  const [bipsMessage, setBipsMessage] = useState<string | null>(null);

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


  return { receivedBips, setReceivedBips, bipsLoadedForIdentity, setBipsLoadedForIdentity, receivedGuestBips, setReceivedGuestBips, bipsLoading, bipsMessage, setBipsMessage, refreshBips, resolveReceivedBip, resolveGuestBip };
}
