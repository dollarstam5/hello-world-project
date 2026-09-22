import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { PublicFlash } from "@eco/core-contracts";
import type { Database } from "@/integrations/supabase/types";
import { getPublicServerEnvironment } from "@/config/env.server";

export async function transitionFlash(
  client: SupabaseClient<Database>,
  id: string,
  status: "live" | "archived",
) {
  const { data, error } = await client.rpc("transition_flash", {
    p_flash_id: id,
    p_status: status,
  });
  if (error) throw error;
  return data;
}

export async function publicFlashes(): Promise<PublicFlash[]> {
  const { supabaseUrl, supabasePublishableKey } = getPublicServerEnvironment();
  const client = createClient<Database>(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.rpc("list_public_flashes", { p_limit: 50 });
  if (error) throw error;
  return data.map((row) => ({
    id: row.id,
    kind: row.kind as PublicFlash["kind"],
    category: row.category as PublicFlash["category"],
    title: row.title,
    timeSlot: row.time_slot as PublicFlash["timeSlot"],
    areaLabel: row.area_label,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  }));
}

export async function setPrivateFlashLocation(
  client: SupabaseClient<Database>,
  input: { flashId: string; latitude: number; longitude: number; accuracyMeters: number },
) {
  const { error } = await client.rpc("set_flash_location", {
    p_flash_id: input.flashId,
    p_latitude: input.latitude,
    p_longitude: input.longitude,
    p_accuracy_meters: input.accuracyMeters,
  });
  if (error) throw error;
  return true;
}
