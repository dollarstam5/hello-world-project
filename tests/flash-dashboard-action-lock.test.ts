import { describe, expect, it } from "vitest";
import { createFlashDashboardActionLock } from "@/domains/flash/ui/dashboard/utils/flashDashboardActionLock";

describe("Flash dashboard action lock", () => {
  it("rejects a second action while one is already running", () => {
    const lock = createFlashDashboardActionLock();

    expect(lock.acquire("flash-a")).toBe(true);
    expect(lock.isLocked()).toBe(true);
    expect(lock.acquire("flash-b")).toBe(false);
    expect(lock.release("flash-b")).toBe(false);
    expect(lock.isLocked()).toBe(true);
    expect(lock.release("flash-a")).toBe(true);
    expect(lock.isLocked()).toBe(false);
    expect(lock.acquire("flash-b")).toBe(true);
  });

  it("does not unlock a different active action", () => {
    const lock = createFlashDashboardActionLock();

    expect(lock.acquire("flash-a")).toBe(true);
    expect(lock.release("flash-b")).toBe(false);
    expect(lock.acquire("flash-a")).toBe(false);
    expect(lock.isLocked()).toBe(true);
    expect(lock.release("flash-a")).toBe(true);
  });
});
