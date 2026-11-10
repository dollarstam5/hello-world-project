import type { RadarAction, RadarDraftInput, RadarRecord, UserId } from "@eco/core-contracts";
import { asId, newId } from "@eco/core-contracts";
import { radarTransition, stampUpdate } from "@eco/core-logic";
import { enqueueMutation } from "./outbox";
import { createRepository } from "./repository";
import { getDb, requireLocalDataOwnerId } from "./schema";

type MemberRadarAction = Extract<RadarAction, "activate" | "pause" | "resume" | "cancel">;

const base = createRepository<RadarRecord>("radars");

function actorId(): UserId {
  const owner = requireLocalDataOwnerId();

  if (owner.startsWith("guest:")) {
    throw new Error("Authentication is required for Radar actions.");
  }

  return asId<"UserId">(owner);
}

async function execute(id: string, action: MemberRadarAction): Promise<RadarRecord> {
  const db = getDb();
  const current = await db.radars.get(id);

  if (!current || current.deletedAt !== null) {
    throw new Error(`No local Radar ${id}.`);
  }

  if (current.ownerId !== actorId()) {
    throw new Error("Only the owner can manage this Radar.");
  }

  if (action !== "cancel" && Date.now() >= current.expiresAt) {
    throw new Error("This Radar has expired.");
  }

  const patch = radarTransition(current, action);
  const next = stampUpdate({ ...current, ...patch });

  await db.transaction("rw", db.radars, db.outbox, async () => {
    await db.radars.put(next);
    await enqueueMutation({
      table: "radars",
      recordId: id,
      kind: "update",
      patch: { status: patch.status },
      mutatedAt: next.updatedAt,
    });
  });

  return next;
}

/**
 * Offline-first Radar repository. Draft fields use the generic write policy;
 * lifecycle changes are queued as status commands and validated again by the
 * authenticated command_radar database function during synchronisation.
 */
export const radarsRepository = {
  table: "radars" as const,
  get: base.get,
  list: base.list,

  create(input: RadarDraftInput): Promise<RadarRecord> {
    return base.create({
      id: newId<"RadarId">(),
      ownerId: actorId(),
      ...input,
      status: "draft",
      nextReviewAt: null,
      lastReviewedAt: null,
    });
  },

  async editDraft(id: string, patch: Partial<RadarDraftInput>): Promise<RadarRecord> {
    const current = await base.get(id);
    if (!current || current.ownerId !== actorId() || current.status !== "draft") {
      throw new Error("Only your saved Radar drafts can be edited.");
    }
    return base.update(id, patch);
  },

  activate(id: string) {
    return execute(id, "activate");
  },

  pause(id: string) {
    return execute(id, "pause");
  },

  resume(id: string) {
    return execute(id, "resume");
  },

  cancel(id: string) {
    return execute(id, "cancel");
  },
};
