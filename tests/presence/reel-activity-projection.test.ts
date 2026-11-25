import { beforeEach, describe, expect, it } from "vitest";
import {
  resetReelActivityProjection,
  useReelActivityProjection,
} from "@/modules/reel/model/reel-activity-projection";

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

  it("keeps the engine and communication centre synchronized through one projection", () => {
    const engineSnapshots: number[] = [];
    const centreSnapshots: number[] = [];
    const unsubscribeEngine = useReelActivityProjection.subscribe((state) => {
      engineSnapshots.push(state.pendingBips);
    });
    const unsubscribeCentre = useReelActivityProjection.subscribe((state) => {
      centreSnapshots.push(state.pendingBips);
    });

    useReelActivityProjection.getState().publishBips("member", 2);
    useReelActivityProjection.getState().publishBips("member", 5);

    expect(engineSnapshots).toEqual([2, 5]);
    expect(centreSnapshots).toEqual([2, 5]);
    unsubscribeEngine();
    unsubscribeCentre();
  });

  it("does not retain guest session or domain record identifiers in any state value", () => {
    useReelActivityProjection.getState().publishBips("guest", 1);
    useReelActivityProjection.getState().publishConnections("guest", 2);

    const serialized = JSON.stringify(useReelActivityProjection.getState());
    expect(serialized).not.toMatch(
      /guestSessionId|guest_session_id|presenceId|presence_id|bipId|bip_id|connectionId|connection_id/i,
    );
  });
});
