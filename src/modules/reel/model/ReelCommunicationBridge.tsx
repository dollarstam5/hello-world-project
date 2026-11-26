import { useEffect } from "react";
import { useAccessMode } from "@/modules/access-mode";
import { subscribeToReelMemberActivity } from "@/modules/reel/services/reel-activity-realtime.service";
import { useCommunicationRuntime } from "@/features/communication/CommunicationRuntimeProvider";
import type { MessageKey } from "@/lib/i18n/messages";

const messageByKind = {
  bip_received: "communication.event.reel.bipReceived",
  bip_accepted: "communication.event.reel.bipAccepted",
  bip_declined: "communication.event.reel.bipDeclined",
  connection_closed: "communication.event.reel.connectionClosed",
} satisfies Record<
  "bip_received" | "bip_accepted" | "bip_declined" | "connection_closed",
  MessageKey
>;

/**
 * Bridges the existing private Réel channel into the app-wide communication
 * runtime. It is mounted once by AppShell, independently of engine panels.
 */
export function ReelCommunicationBridge() {
  const access = useAccessMode();
  const communication = useCommunicationRuntime();

  useEffect(() => {
    if (
      access.loading ||
      access.mode !== "member" ||
      !access.memberId ||
      access.memberProfileState !== "active"
    ) {
      return;
    }

    return subscribeToReelMemberActivity(
      access.memberId,
      (event) => {
        communication.publishEvent({
          id: `reel:${event.event_id}`,
          source: "reel",
          titleKey: "communication.event.reel.title",
          messageKey: messageByKind[event.kind],
          href: "/reel",
          createdAt: event.created_at,
          attentionRequired: true,
        });
      },
      () => {
        window.dispatchEvent(new Event("vitalis:reel-activity-reconnected"));
      },
    );
  }, [access.loading, access.mode, access.memberId, access.memberProfileState, communication]);

  return null;
}
