import type { FlashRecord, UserId } from "@eco/core-contracts";
import { asId } from "@eco/core-contracts";
import { stampUpdate } from "@eco/core-logic";
import { enqueueMutation } from "./outbox";
import { createRepository } from "./repository";
import { getDb, requireLocalDataOwnerId } from "./schema";

const base = createRepository<FlashRecord>("flashes");

function actorId(): UserId {
  const owner = requireLocalDataOwnerId();
  if (owner.startsWith("guest:")) throw new Error("Authentication is required for Flash lifecycle actions.");
  return asId<"UserId">(owner);
}

async function archive(id: string): Promise<FlashRecord> {
  const db = getDb();
  const current = await db.flashes.get(id);
  if (!current || current.deletedAt !== null) throw new Error("Flash not found.");
  if (current.authorId !== actorId()) throw new Error("Only the owner can archive this Flash.");
  if (current.status !== "live") throw new Error("Only live Flash can be archived.");

  const next = stampUpdate({ ...current, status: "archived" });
  await db.transaction("rw", db.flashes, db.outbox, async () => {
    await db.flashes.put(next);
    await enqueueMutation({ table: "flashes", recordId: id, kind: "update", patch: { status: "archived" }, mutatedAt: next.updatedAt });
  });
  return next;
}

export const flashesLifecycleRepository = { get: base.get, list: base.list, archive };
