import { supabase } from "@/integrations/supabase/client";

type ReelActivityTable = "reel_bips" | "reel_connections";

/**
 * Owns the private member Realtime channel for Réel.
 * The callback receives no payload: consumers reload authorized projections
 * through their own server/RPC boundary instead of trusting broadcast data.
 */
export function subscribeToReelMemberActivity(
  memberId: string | null | undefined,
  onActivity: () => void,
  tables: readonly ReelActivityTable[],
): () => void {
  if (!memberId) return () => undefined;

  const channel = supabase.channel(`reel-member:${memberId}`, {
    config: { private: true },
  });

  channel.on("broadcast", { event: "reel_activity" }, onActivity);

  for (const table of new Set(tables)) {
    channel.on("postgres_changes", { event: "*", schema: "public", table }, onActivity);
  }

  channel.subscribe();
  return () => {
    void supabase.removeChannel(channel);
  };
}
