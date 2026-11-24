import type { RadarRecord } from "@eco/core-contracts";
import type { CommunicationRuntime } from "@/lib/communication/runtime";

type RadarCommunicationAction = "saved" | "updated" | "cancelled";

/** Adapts confirmed Radar lifecycle transitions to the one shared app runtime. */
export function publishRadarCommunicationEvent(
  communication: Pick<CommunicationRuntime, "publishEvent">,
  record: Pick<RadarRecord, "id" | "updatedAt">,
  action: RadarCommunicationAction,
) {
  const messageKey = {
    saved: "communication.event.radar.saved",
    updated: "communication.event.radar.updated",
    cancelled: "communication.event.radar.cancelled",
  } as const;

  communication.publishEvent({
    id:
      action === "saved"
        ? `radar:${record.id}:saved`
        : `radar:${record.id}:${action}:${record.updatedAt}`,
    source: "radar",
    titleKey: "communication.event.radar.title",
    messageKey: messageKey[action],
    href: "/radar",
  });
}
