import { useState } from "react";
import type { FlashRecord } from "@eco/core-contracts";

export function useFlashDashboardPendingDelete() {
  return useState<FlashRecord | null>(null);
}
