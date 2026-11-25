import type { FlashRecord } from "@eco/core-contracts";
import type { CommunicationRuntime } from "@/features/communication/model/runtime";

type FlashCommunicationAction = "draft-saved" | "updated" | "archived" | "deleted";

/** Adapts confirmed Flash lifecycle transitions to the one shared app runtime. */
export function publishFlashCommunicationEvent(
  communication: Pick<CommunicationRuntime, "publishEvent">,
  record: Pick<FlashRecord, "id" | "updatedAt">,
  action: FlashCommunicationAction,
) {
  const messageKey = {
    "draft-saved": "communication.event.flash.draftSaved",
    updated: "communication.event.flash.updated",
    archived: "communication.event.flash.archived",
    deleted: "communication.event.flash.deleted",
  } as const;

  const eventSuffix = action === "updated" ? `updated:${record.updatedAt}` : action;

  communication.publishEvent({
    id: `flash:${record.id}:${eventSuffix}`,
    source: "flash",
    titleKey: "communication.event.flash.title",
    messageKey: messageKey[action],
    href: "/flash",
  });
}
