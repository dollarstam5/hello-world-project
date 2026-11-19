import { useRef, useState } from "react";
import type { FlashRecord } from "@eco/core-contracts";
import { useCommunicationRuntime } from "@/lib/communication/CommunicationRuntimeProvider";
import { publishFlashCommunicationEvent } from "../../../communication-events";
import { archiveFlash, deleteFlash, updateFlash } from "../../../data";
import { createFlashDashboardActionLock } from "../utils/flashDashboardActionLock";

export function useFlashDashboardActions() {
  const communication = useCommunicationRuntime();
  const actionLock = useRef(createFlashDashboardActionLock());
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState(false);

  async function archive(record: FlashRecord) {
    if (!actionLock.current.acquire(record.id)) return;
    setBusyId(record.id);
    setActionError(false);
    try {
      await archiveFlash(record.id);
      publishFlashCommunicationEvent(communication, record, "archived");
    } catch {
      setActionError(true);
    } finally {
      actionLock.current.release(record.id);
      setBusyId(null);
    }
  }

  async function saveEdit(record: FlashRecord, body: string): Promise<boolean> {
    if (!actionLock.current.acquire(record.id)) return false;
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
      actionLock.current.release(record.id);
      setBusyId(null);
    }
  }

  async function remove(record: FlashRecord): Promise<boolean> {
    if (!actionLock.current.acquire(record.id)) return false;
    setBusyId(record.id);
    setActionError(false);
    try {
      await deleteFlash(record.id);
      publishFlashCommunicationEvent(communication, record, "deleted");
      return true;
    } catch {
      setActionError(true);
      return false;
    } finally {
      actionLock.current.release(record.id);
      setBusyId(null);
    }
  }

  return { busyId, actionError, archive, saveEdit, remove };
}
