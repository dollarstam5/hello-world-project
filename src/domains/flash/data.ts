import type {
  FlashCategory,
  FlashKind,
  FlashRecord,
  FlashScope,
  FlashTimeSlot,
  FlashUrgency,
  UserId,
} from "@eco/core-contracts";
import { newId } from "@eco/core-contracts";
import { isFlashVisible } from "@eco/core-logic";
import { flashesRepository, requestSyncNow, useLocalQuery } from "@/platform/offline";
import { supabase } from "@/integrations/supabase/client";

/**
 * Flash data access. The interface calls these functions; they only touch the
 * local database, so everything works with or without a network connection.
 */

export function useLiveFlashes(now = Date.now()) {
  return useLocalQuery<FlashRecord[]>(async () => {
    const flashes = await flashesRepository.list();
    return flashes.filter((flash) => isFlashVisible(flash, now));
  }, []);
}

export function useFlash(id: string) {
  return useLocalQuery<FlashRecord | undefined>(() => flashesRepository.get(id), [id]);
}

export interface NewFlashInput {
  authorId: UserId;
  title: string;
  body: string;
  kind: FlashKind;
  category: FlashCategory;
  timeSlot: FlashTimeSlot;
  scope: FlashScope;
  urgency: FlashUrgency;
  areaLabel?: string;
  expiresAt: number | null;
}

export function createFlash(input: NewFlashInput) {
  return flashesRepository.create({
    id: newId<"FlashId">(),
    authorId: input.authorId,
    title: input.title,
    body: input.body,
    status: "draft",
    kind: input.kind,
    category: input.category,
    timeSlot: input.timeSlot,
    scope: input.scope,
    urgency: input.urgency,
    areaLabel: input.areaLabel,
    expiresAt: input.expiresAt,
    mediaIds: [],
  } as never);
}

export function updateFlash(id: string, body: string) {
  const value = body.trim();
  if (!value) throw new Error("Flash content cannot be empty.");
  return flashesRepository.update(id, {
    title: value.length > 80 ? `${value.slice(0, 77)}…` : value,
    body: value,
  } as never);
}

export async function archiveFlash(id: string) {
  const { error } = await supabase.rpc("transition_flash", {
    p_flash_id: id,
    p_status: "archived",
  });
  if (error) throw error;
  requestSyncNow();
}

export function deleteFlash(id: string) {
  return flashesRepository.remove(id);
}
