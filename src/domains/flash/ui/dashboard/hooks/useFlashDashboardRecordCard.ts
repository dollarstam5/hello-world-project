import { useState } from "react";
import type { FlashRecord } from "@eco/core-contracts";
import { resolveFlashStatus } from "@eco/core-logic";

export function useFlashDashboardRecordCard(
  record: FlashRecord,
  busyId: string | null,
  onSave: (record: FlashRecord, body: string) => Promise<boolean>,
) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(record.body);
  const status = resolveFlashStatus(record);
  const busy = busyId === record.id;

  function startEdit() {
    setDraft(record.body);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setDraft(record.body);
  }

  async function save() {
    if (!draft.trim() || busy) return;
    if (await onSave(record, draft)) setEditing(false);
  }

  return {
    status,
    busy,
    detailsOpen,
    setDetailsOpen,
    editing,
    draft,
    setDraft,
    startEdit,
    cancelEdit,
    save,
  };
}
