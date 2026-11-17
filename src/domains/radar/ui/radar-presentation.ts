import type { RadarStatus } from "@eco/core-contracts";
import type { MessageKey } from "@/lib/i18n/messages";

export const statusKeys: Record<RadarStatus, MessageKey> = {
  draft: "radar.manage.status.draft",
  active: "radar.manage.status.active",
  watching: "radar.manage.status.watching",
  matched: "radar.manage.status.matched",
  paused: "radar.manage.status.paused",
  expired: "radar.manage.status.expired",
  cancelled: "radar.manage.status.cancelled",
};

export const statusTones: Record<RadarStatus, "neutral" | "primary" | "success" | "warning" | "info"> = {
  draft: "neutral",
  active: "success",
  watching: "info",
  matched: "primary",
  paused: "warning",
  expired: "neutral",
  cancelled: "neutral",
};

