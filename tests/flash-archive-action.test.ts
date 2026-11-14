import { beforeEach, describe, expect, it, vi } from "vitest";

const { rpc, requestSyncNow } = vi.hoisted(() => ({
  rpc: vi.fn(),
  requestSyncNow: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { rpc },
}));

vi.mock("@/platform/offline", () => ({
  flashesRepository: {
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
  requestSyncNow,
  useLocalQuery: vi.fn(),
}));

import { archiveFlash } from "@/domains/flash/data";

describe("Flash archive action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requests synchronization only after the server confirms the archive", async () => {
    rpc.mockResolvedValue({ data: true, error: null });

    await expect(archiveFlash("flash-1")).resolves.toBeUndefined();

    expect(rpc).toHaveBeenCalledWith("transition_flash", {
      p_flash_id: "flash-1",
      p_status: "archived",
    });
    expect(requestSyncNow).toHaveBeenCalledOnce();
  });

  it("rejects a transition that the server did not apply", async () => {
    rpc.mockResolvedValue({ data: false, error: null });

    await expect(archiveFlash("flash-1")).rejects.toThrow("flash_archive_not_applied");

    expect(requestSyncNow).not.toHaveBeenCalled();
  });

  it("does not request synchronization when the RPC fails", async () => {
    rpc.mockResolvedValue({ data: null, error: new Error("database unavailable") });

    await expect(archiveFlash("flash-1")).rejects.toThrow("database unavailable");

    expect(requestSyncNow).not.toHaveBeenCalled();
  });
});
