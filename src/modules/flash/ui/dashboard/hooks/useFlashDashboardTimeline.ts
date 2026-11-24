import { useState } from "react";
import type { FlashRecord } from "@eco/core-contracts";
import { groupFlashByDate } from "../utils/groupFlashByDate";

export function useFlashDashboardTimeline(records: FlashRecord[]) {
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    week: true,
    lastWeek: true,
    older: true,
  });

  const groups = groupFlashByDate(records);

  function toggleGroup(key: string) {
    setCollapsedGroups((previous) => ({ ...previous, [key]: !previous[key] }));
  }

  return { groups, collapsedGroups, toggleGroup };
}
