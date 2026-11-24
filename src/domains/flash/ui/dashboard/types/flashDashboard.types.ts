import type { FlashRecord } from "@eco/core-contracts";
import type { MessageKey } from "@/lib/i18n/messages";

export type FlashTimelineGroupKey =
  "today" | "yesterday" | "twoDays" | "week" | "lastWeek" | "older";

export type FlashTimelineGroup = {
  key: FlashTimelineGroupKey;
  label: MessageKey;
  items: FlashRecord[];
};
