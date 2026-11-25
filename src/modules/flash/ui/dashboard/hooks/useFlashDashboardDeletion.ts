import { useState } from "react";
import type { FlashRecord } from "@eco/core-contracts";

export function useFlashDashboardDeletion(
  remove: (record: FlashRecord) => Promise<boolean>,
  busyId: string | null,
) {
  const [pending, setPending] = useState<FlashRecord | null>(null);

  function requestDelete(record: FlashRecord) {
    setPending(record);
  }

  function onOpenChange(open: boolean) {
    if (!open && !busyId) setPending(null);
  }

  async function confirm() {
    if (!pending) return;
    const success = await remove(pending);
    if (success) setPending(null);
  }

  return { pending, requestDelete, onOpenChange, confirm };
}
