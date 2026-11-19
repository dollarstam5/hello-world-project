import { useState } from "react";
import type { FlashRecord } from "@eco/core-contracts";
import { useCommunicationRuntime } from "@/lib/communication/CommunicationRuntimeProvider";
import { publishFlashCommunicationEvent } from "../../../communication-events";
import { archiveFlash, deleteFlash, updateFlash } from "../../../data";

export function useFlashDashboardActions() {
  const communication = useCommunicationRuntime();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState(false);

  async function archive(record: FlashRecord) {
    setBusyId(record.id);
    setActionError(false);
    try {
      await archiveFlash(record.id);
      publishFlashCommunicationEvent(communication, record, "archived");
    } catch {
      setActionError(true);
    } finally {
      setBusyId(null);
    }
  }

  async function saveEdit(record: FlashRecord, body: string): Promise<boolean> {
    setBusyId(record.id);
    setActionError(false);
    try {
      const updated = await updateFlash(record.id, body);
      publishFlashCommunicationEvent(communication, updated, "updated");
      return true;
    } catch {
      setActionError(true);
      return false;
    } finally {
      setBusyId(null);
    }
  }

  async function remove(record: FlashRecord) {
    setBusyId(record.id);
    setActionError(false);
    try {
      await deleteFlash(record.id);
      publishFlashCommunicationEvent(communication, record, "deleted");
    } catch {
      setActionError(true);
    } finally {
      setBusyId(null);
    }
  }

  return { busyId, actionError, archive, saveEdit, remove };
}
