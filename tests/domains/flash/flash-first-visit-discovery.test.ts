import { describe, expect, it } from "vitest";
import { shouldShowFlashDemo } from "@/domains/flash/model/demo-flashes";

describe("first-visit Flash discovery examples", () => {
  const readyFeed = {
    loading: false,
    localDataReady: true,
    hasRemoteResults: false,
    feedFailed: false,
    isOffline: false,
    hasLocation: false,
  };

  it("shows labelled examples before asking for location", () => {
    expect(shouldShowFlashDemo(readyFeed)).toBe(true);
  });

  it("does not show examples while local data is still loading", () => {
    expect(shouldShowFlashDemo({ ...readyFeed, loading: true })).toBe(false);
  });

  it("waits for a remote response after location has been shared", () => {
    expect(shouldShowFlashDemo({ ...readyFeed, hasLocation: true })).toBe(false);
  });

  it("keeps examples available when a nearby feed request fails", () => {
    expect(
      shouldShowFlashDemo({ ...readyFeed, hasLocation: true, feedFailed: true }),
    ).toBe(true);
  });

  it("keeps examples available offline", () => {
    expect(
      shouldShowFlashDemo({ ...readyFeed, hasLocation: true, isOffline: true }),
    ).toBe(true);
  });
});
