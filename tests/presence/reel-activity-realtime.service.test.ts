import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  callback: null as null | ((input: { payload: unknown }) => void),
  statusCallback: null as null | ((status: string) => void),
  on: vi.fn(),
  subscribe: vi.fn((callback?: (status: string) => void) => {
    mocks.statusCallback = callback ?? null;
  }),
  removeChannel: vi.fn(),
  channel: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    channel: (...args: unknown[]) => {
      mocks.channel(...args);
      const channel = {
        on: (type: string, filter: unknown, callback: (input: { payload: unknown }) => void) => {
          mocks.on(type, filter);
          mocks.callback = callback;
          return channel;
        },
        subscribe: mocks.subscribe,
      };
      return channel;
    },
    removeChannel: mocks.removeChannel,
  },
}));

import { subscribeToReelMemberActivity } from "@/domains/presence/services/reel-activity-realtime.service";

describe("Réel member Realtime service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.callback = null;
    mocks.statusCallback = null;
  });

  it("uses one private channel and one coarse Broadcast listener without table subscriptions", () => {
    const onActivity = vi.fn();
    const stop = subscribeToReelMemberActivity("member-1", onActivity);

    expect(mocks.channel).toHaveBeenCalledTimes(1);
    expect(mocks.channel).toHaveBeenCalledWith("reel-member:member-1", {
      config: { private: true },
    });
    expect(mocks.on).toHaveBeenCalledTimes(1);
    expect(mocks.on).toHaveBeenCalledWith("broadcast", { event: "reel_activity" });
    expect(mocks.subscribe).toHaveBeenCalledTimes(1);

    stop();
    expect(mocks.removeChannel).toHaveBeenCalledTimes(1);
  });

  it("validates the server event envelope before forwarding it", () => {
    const onActivity = vi.fn();
    subscribeToReelMemberActivity("member-1", onActivity);

    mocks.callback?.({
      payload: {
        kind: "bip_received",
        event_id: "00000000-0000-4000-8000-000000000001",
        created_at: 123,
        guest_session_id: "must-not-cross-boundary",
      },
    });
    expect(onActivity).toHaveBeenCalledWith({
      kind: "bip_received",
      event_id: "00000000-0000-4000-8000-000000000001",
      created_at: 123,
    });
    expect(onActivity.mock.calls[0]?.[0]).not.toHaveProperty("guest_session_id");

    mocks.callback?.({
      payload: {
        kind: "unknown_event",
        event_id: "00000000-0000-4000-8000-000000000002",
        created_at: 124,
      },
    });
    expect(onActivity).toHaveBeenCalledTimes(1);
  });

  it("refreshes the activity view only after a real reconnect transition", () => {
    const onReconnect = vi.fn();
    subscribeToReelMemberActivity("member-1", vi.fn(), onReconnect);

    mocks.statusCallback?.("SUBSCRIBED");
    expect(onReconnect).not.toHaveBeenCalled();
    mocks.statusCallback?.("CHANNEL_ERROR");
    mocks.statusCallback?.("SUBSCRIBED");
    expect(onReconnect).toHaveBeenCalledTimes(1);
    mocks.statusCallback?.("SUBSCRIBED");
    expect(onReconnect).toHaveBeenCalledTimes(1);
  });

  it("does not open a channel when there is no member identity", () => {
    const stop = subscribeToReelMemberActivity(null, vi.fn());

    expect(mocks.channel).not.toHaveBeenCalled();
    stop();
    expect(mocks.removeChannel).not.toHaveBeenCalled();
  });
});
