import { supabase } from "@/integrations/supabase/client";

export interface ReelActivityBroadcast {
  kind: "bip_received" | "bip_accepted" | "bip_declined" | "connection_closed";
  event_id: string;
  created_at: number;
}

/**
 * Owns the one private member channel for all Réel activity.
 * Only coarse, server-authored event metadata crosses Realtime; business rows
 * are reloaded through their existing authorized repositories when needed.
 */
export function subscribeToReelMemberActivity(
  memberId: string | null | undefined,
  onActivity: (event: ReelActivityBroadcast) => void,
  onReconnect?: () => void,
): () => void {
  if (!memberId) return () => undefined;

  const channel = supabase.channel(`reel-member:${memberId}`, {
    config: { private: true },
  });

  channel.on("broadcast", { event: "reel_activity" }, ({ payload }) => {
    if (
      !payload ||
      typeof payload !== "object" ||
      !("kind" in payload) ||
      !("event_id" in payload) ||
      !("created_at" in payload)
    ) {
      return;
    }
    const event = payload as ReelActivityBroadcast;
    if (
      !["bip_received", "bip_accepted", "bip_declined", "connection_closed"].includes(event.kind) ||
      typeof event.event_id !== "string" ||
      !/^[0-9a-f-]{36}$/i.test(event.event_id) ||
      typeof event.created_at !== "number" ||
      !Number.isFinite(event.created_at)
    ) {
      return;
    }
    // Rebuild a minimal envelope so unexpected provider fields (including any
    // guest/session metadata) can never cross the application boundary.
    onActivity({
      kind: event.kind,
      event_id: event.event_id,
      created_at: event.created_at,
    });
  });

  let hasConnected = false;
  let disconnectedAfterConnection = false;
  channel.subscribe((status) => {
    if (status === "SUBSCRIBED") {
      if (hasConnected && disconnectedAfterConnection) onReconnect?.();
      hasConnected = true;
      disconnectedAfterConnection = false;
    } else if (
      hasConnected &&
      (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED")
    ) {
      disconnectedAfterConnection = true;
    }
  });
  return () => {
    void supabase.removeChannel(channel);
  };
}
