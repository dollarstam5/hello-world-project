import { getDb, requireLocalDataOwnerId } from "./schema";
import type { LocalMediaBlob } from "./schema";

export const FLASH_MEDIA_LIMITS = {
  maxFiles: 3,
  maxFileBytes: 10 * 1024 * 1024,
  maxTotalBytes: 20 * 1024 * 1024,
} as const;

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "audio/mpeg",
  "audio/mp4",
  "audio/ogg",
  "audio/wav",
  "application/pdf",
  "text/plain",
]);

export function validateFlashAttachment(file: File): string | null {
  if (!ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
    return "unsupported_type";
  }
  if (file.size <= 0) return "empty_file";
  if (file.size > FLASH_MEDIA_LIMITS.maxFileBytes) return "file_too_large";
  return null;
}

function safeFileName(name: string): string {
  return name.replace(/[\\/\\0-\\x1f\\x7f]/g, "_").slice(0, 180) || "attachment";
}

export async function storeLocalFlashAttachment(file: File, flashId: string | null = null): Promise<LocalMediaBlob> {
  const error = validateFlashAttachment(file);
  if (error) throw new Error(error);
  const ownerId = requireLocalDataOwnerId();
  const db = getDb();
  const existing = await db.mediaBlobs.where("ownerId").equals(ownerId).toArray();
  const attached = existing.filter((row) => row.flashId === flashId);
  const total = attached.reduce((sum, row) => sum + row.byteSize, 0) + file.size;
  if (attached.length >= FLASH_MEDIA_LIMITS.maxFiles) throw new Error("too_many_files");
  if (total > FLASH_MEDIA_LIMITS.maxTotalBytes) throw new Error("total_too_large");

  const record: LocalMediaBlob = {
    id: crypto.randomUUID(),
    ownerId,
    flashId,
    blob: file,
    fileName: safeFileName(file.name),
    mimeType: file.type.toLowerCase(),
    byteSize: file.size,
    createdAt: Date.now(),
  };
  await db.mediaBlobs.add(record);
  return record;
}

export async function getLocalFlashAttachment(id: string): Promise<LocalMediaBlob | undefined> {
  const ownerId = requireLocalDataOwnerId();
  return await getDb().mediaBlobs.get(id).then((row) => row?.ownerId === ownerId ? row : undefined);
}

export async function listLocalFlashAttachments(flashId: string): Promise<LocalMediaBlob[]> {
  const ownerId = requireLocalDataOwnerId();
  return await getDb().mediaBlobs.where("flashId").equals(flashId).filter((row) => row.ownerId === ownerId).toArray();
}

export async function attachLocalFlashMedia(ids: string[], flashId: string): Promise<void> {
  const ownerId = requireLocalDataOwnerId();
  await getDb().transaction("rw", getDb().mediaBlobs, async () => {
    for (const id of ids) {
      const record = await getDb().mediaBlobs.get(id);
      if (!record || record.ownerId !== ownerId) throw new Error("media_not_owned");
      await getDb().mediaBlobs.update(id, { flashId });
    }
  });
}

export async function deleteLocalFlashAttachment(id: string): Promise<void> {
  const ownerId = requireLocalDataOwnerId();
  const db = getDb();
  const record = await db.mediaBlobs.get(id);
  if (record?.ownerId === ownerId) await db.mediaBlobs.delete(id);
}

export async function deleteLocalFlashAttachments(flashId: string): Promise<void> {
  const ownerId = requireLocalDataOwnerId();
  const db = getDb();
  const rows = await db.mediaBlobs.where("flashId").equals(flashId).filter((row) => row.ownerId === ownerId).toArray();
  await db.mediaBlobs.bulkDelete(rows.map((row) => row.id));
}
