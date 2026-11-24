import type { FlashRecord } from "@eco/core-contracts";

export type FlashTimelineGroupKey =
  "today" | "yesterday" | "twoDays" | "week" | "lastWeek" | "older";

export type FlashTimelineGroup = {
  key: FlashTimelineGroupKey;
  label: string;
  items: FlashRecord[];
};
