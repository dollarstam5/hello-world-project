import { beforeEach, describe, expect, it } from "vitest";
import {
  resetReelActivityProjection,
  useReelActivityProjection,
} from "@/domains/presence/model/reel-activity-projection";

describe("Réel shared activity projection", () => {
  beforeEach(() => resetReelActivityProjection());

  it("publishes only safe aggregate counts for the communication centre", () => {
    const state = useReelActivityProjection.getState();
    state.publishBips("member", 3);
    state.publishConnections("member", 2);

    expect(useReelActivityProjection.getState()).toMatchObject({
      mode: "member",
      pendingBips: 3,
      activeConnections: 2,
      bipsReady: true,
      connectionsReady: true,
    });
    expect(Object.keys(useReelActivityProjection.getState())).not.toContain("guestSessionId");
    expect(Object.keys(useReelActivityProjection.getState())).not.toContain("presenceId");
    expect(Object.keys(useReelActivityProjection.getState())).not.toContain("bipId");
  });

  it("resets previous-mode aggregates when the access mode changes", () => {
    useReelActivityProjection.getState().publishBips("member", 4);
    useReelActivityProjection.getState().publishConnections("guest", 1);

    expect(useReelActivityProjection.getState()).toMatchObject({
      mode: "guest",
      pendingBips: 0,
      activeConnections: 1,
      bipsReady: false,
      connectionsReady: true,
    });
  });

  it("normalizes invalid and negative counts", () => {
    useReelActivityProjection.getState().publishBips("guest", Number.NaN);
    expect(useReelActivityProjection.getState().pendingBips).toBe(0);
    useReelActivityProjection.getState().publishConnections("guest", -5);
    expect(useReelActivityProjection.getState().activeConnections).toBe(0);
  });

  it("clears the projection when the app identity changes", () => {
    useReelActivityProjection.getState().publishBips("member", 2);
    resetReelActivityProjection();

    expect(useReelActivityProjection.getState()).toMatchObject({
      mode: null,
      pendingBips: 0,
      activeConnections: 0,
      bipsReady: false,
      connectionsReady: false,
    });
  });
});
