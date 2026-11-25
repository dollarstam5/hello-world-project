import { beforeEach, describe, expect, it } from "vitest";
import {
  resetReelActivityProjection,
  useReelActivityProjection,
} from "@/modules/reel/model/reel-activity-projection";

describe("Réel activity projection", () => {
  beforeEach(() => {
    resetReelActivityProjection();
  });

  it("shares only sanitized activity counts for the active identity mode", () => {
    const projection = useReelActivityProjection.getState();

    projection.publishBips("member", 3.8);
    projection.publishConnections("member", 2);

    expect(useReelActivityProjection.getState()).toMatchObject({
      mode: "member",
      pendingBips: 3,
      activeConnections: 2,
      bipsReady: true,
      connectionsReady: true,
    });
  });

  it("clears the previous mode before publishing guest activity", () => {
    const projection = useReelActivityProjection.getState();

    projection.publishBips("member", 4);
    projection.publishConnections("member", 3);
    projection.publishBips("guest", 1);

    expect(useReelActivityProjection.getState()).toMatchObject({
      mode: "guest",
      pendingBips: 1,
      activeConnections: 0,
      bipsReady: true,
      connectionsReady: false,
    });
  });

  it("normalizes invalid and negative counts without retaining identifiers", () => {
    const projection = useReelActivityProjection.getState();

    projection.publishBips("guest", Number.POSITIVE_INFINITY);
    projection.publishConnections("guest", -5);

    const state = useReelActivityProjection.getState();
    expect(state.pendingBips).toBe(0);
    expect(state.activeConnections).toBe(0);
    expect(JSON.stringify(state)).not.toContain("guest-session");
    expect(JSON.stringify(state)).not.toContain("presence-id");
  });

  it("resets all projected activity when the identity session changes", () => {
    const projection = useReelActivityProjection.getState();

    projection.publishBips("member", 2);
    projection.publishConnections("member", 1);
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
