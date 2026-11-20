import { describe, expect, it } from "vitest";
import type { FlashRecord } from "@eco/core-contracts";
import { canArchiveFlash, canEditFlash, resolveFlashStatus } from "@eco/core-logic";

function flash(status: FlashRecord["status"], expiresAt: number | null): FlashRecord {
  return {
    status,
    expiresAt,
    deletedAt: null,
  } as FlashRecord;
}

describe("Flash lifecycle dashboard actions", () => {
  const now = 1_800_000_000_000;

  it("allows editing drafts and live flashes, but not expired or archived ones", () => {
    expect(canEditFlash(flash("draft", now + 1000), now)).toBe(true);
    expect(canEditFlash(flash("live", now + 1000), now)).toBe(true);
    expect(canEditFlash(flash("live", now - 1), now)).toBe(false);
    expect(canEditFlash(flash("archived", null), now)).toBe(false);
  });

  it("offers archive only while a Flash is still live", () => {
    expect(canArchiveFlash(flash("live", now + 1000), now)).toBe(true);
    expect(canArchiveFlash(flash("live", now - 1), now)).toBe(false);
    expect(canArchiveFlash(flash("draft", now + 1000), now)).toBe(false);
    expect(canArchiveFlash(flash("archived", null), now)).toBe(false);
  });

  it("resolves elapsed live flashes to expired without changing stored status", () => {
    const record = flash("live", now - 1);
    expect(resolveFlashStatus(record, now)).toBe("expired");
    expect(record.status).toBe("live");
  });
});
