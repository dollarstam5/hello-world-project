import { beforeEach, describe, expect, it, vi } from "vitest";

const { create, update, remove } = vi.hoisted(() => ({
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}));

vi.mock("@/platform/offline", () => ({
  flashesRepository: { create, update, remove },
  requestSyncNow: vi.fn(),
  useLocalQuery: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { rpc: vi.fn() },
}));

import { createFlash, deleteFlash, updateFlash } from "@/domains/flash/data";

describe("Flash local data actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a local draft with the expected fields and empty media", async () => {
    create.mockResolvedValue(undefined);

    await createFlash({
      authorId: "user-1" as never,
      title: "Besoin d'aide",
      body: "Besoin d'aide pour déménager",
      kind: "need",
      category: "home",
      timeSlot: "today",
      scope: "current_area",
      urgency: "anytime",
      areaLabel: "Douala",
      expiresAt: 123456,
    });

    expect(create).toHaveBeenCalledOnce();
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        authorId: "user-1",
        title: "Besoin d'aide",
        body: "Besoin d'aide pour déménager",
        status: "draft",
        kind: "need",
        category: "home",
        timeSlot: "today",
        scope: "current_area",
        urgency: "anytime",
        areaLabel: "Douala",
        expiresAt: 123456,
        mediaIds: [],
      }),
    );
    expect(create.mock.calls[0][0].id).toBeTruthy();
  });

  it("propagates a local draft creation failure", async () => {
    create.mockRejectedValue(new Error("offline storage unavailable"));

    await expect(
      createFlash({
        authorId: "user-1" as never,
        title: "Besoin d'aide",
        body: "Besoin d'aide",
        kind: "need",
        category: "home",
        timeSlot: "today",
        scope: "current_area",
        urgency: "anytime",
        expiresAt: null,
      }),
    ).rejects.toThrow("offline storage unavailable");
  });

  it("preserves supplied title and body text", async () => {
    create.mockResolvedValue(undefined);
    const body = "x".repeat(100);

    await createFlash({
      authorId: "user-1" as never,
      title: body,
      body,
      kind: "need",
      category: "home",
      timeSlot: "today",
      scope: "current_area",
      urgency: "anytime",
      expiresAt: null,
    });

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ title: body, body }),
    );
  });

  it("updates both title and body from trimmed text", async () => {
    update.mockResolvedValue(undefined);

    await updateFlash("flash-1", "  Texte modifié  ");

    expect(update).toHaveBeenCalledWith(
      "flash-1",
      expect.objectContaining({
        title: "Texte modifié",
        body: "Texte modifié",
      }),
    );
  });

  it("rejects empty edit text without writing", async () => {
    await expect(updateFlash("flash-1", "   ")).rejects.toThrow(
      "Flash content cannot be empty.",
    );
    expect(update).not.toHaveBeenCalled();
  });

  it("propagates local edit storage errors", async () => {
    update.mockRejectedValue(new Error("edit storage failed"));

    await expect(updateFlash("flash-1", "Texte valide")).rejects.toThrow(
      "edit storage failed",
    );
  });

  it("propagates local deletion errors", async () => {
    remove.mockRejectedValue(new Error("delete storage failed"));

    await expect(deleteFlash("flash-1")).rejects.toThrow("delete storage failed");
  });

  it("removes a flash from the local repository", async () => {
    remove.mockResolvedValue(undefined);

    await deleteFlash("flash-1");

    expect(remove).toHaveBeenCalledOnce();
    expect(remove).toHaveBeenCalledWith("flash-1");
  });
});
