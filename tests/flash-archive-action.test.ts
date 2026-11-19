import { beforeEach, describe, expect, it, vi } from "vitest";
const { archive, requestSyncNow } = vi.hoisted(() => ({ archive: vi.fn(), requestSyncNow: vi.fn() }));
vi.mock("@/platform/offline", () => ({ flashesRepository: { create: vi.fn(), update: vi.fn(), remove: vi.fn() }, flashesLifecycleRepository: { archive }, requestSyncNow, useLocalQuery: vi.fn() }));
import { archiveFlash } from "@/domains/flash/data";
describe("Flash archive action", () => {
  beforeEach(() => vi.clearAllMocks());
  it("queues local archive before sync", async () => { archive.mockResolvedValue({ id: "flash-1", status: "archived" }); await expect(archiveFlash("flash-1")).resolves.toMatchObject({ status: "archived" }); expect(archive).toHaveBeenCalledWith("flash-1"); expect(requestSyncNow).toHaveBeenCalledOnce(); });
  it("does not request sync when local archive fails", async () => { archive.mockRejectedValue(new Error("local transaction failed")); await expect(archiveFlash("flash-1")).rejects.toThrow("local transaction failed"); expect(requestSyncNow).not.toHaveBeenCalled(); });
});
