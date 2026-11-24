import type { FlashRecord } from "@eco/core-contracts";
import { resolveFlashStatus } from "@eco/core-logic";

export const FLASH_STATUS_PRESENTATION = {
  draft: {
    label: "flash.mine.status.draft",
    className: "border-muted-foreground/25 bg-muted text-muted-foreground",
  },
  live: {
    label: "flash.mine.status.live",
    className: "border-primary/25 bg-primary/10 text-primary",
  },
  expired: {
    label: "flash.mine.status.expired",
    className: "border-warning/25 bg-warning/10 text-warning",
  },
  archived: {
    label: "flash.mine.status.archived",
    className: "border-muted-foreground/20 bg-muted/60 text-muted-foreground",
  },
} as const;

export const FLASH_STATUS_GROUPS = [
  { key: "live", label: FLASH_STATUS_PRESENTATION.live.label },
  { key: "draft", label: FLASH_STATUS_PRESENTATION.draft.label },
  { key: "expired", label: FLASH_STATUS_PRESENTATION.expired.label },
  { key: "archived", label: FLASH_STATUS_PRESENTATION.archived.label },
] as const;

export function groupFlashRecordsByStatus(records: FlashRecord[]) {
  return FLASH_STATUS_GROUPS.map((group) => ({
    ...group,
    items: records.filter((record) => resolveFlashStatus(record) === group.key),
  })).filter((group) => group.items.length > 0);
}
