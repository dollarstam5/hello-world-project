import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { PublicFlash, PublicProfilePreview } from "@eco/core-contracts";
import type { Database } from "@/integrations/supabase/types";
import { getPublicServerEnvironment } from "@/config/env.server";
import { callAppRpc } from "@/lib/api/rpc.server";

interface PublicFlashRow {
  id: string;
  kind: string;
  category: string;
  title: string;
  time_slot: string;
  area_label: string;
  expires_at: number;
  created_at: number;
  author_preview?: {
    public_profile_id: string;
    display_name: string;
    area_label: string;
    summary: string;
    category: string;
  } | null;
}

export async function transitionFlash(
  client: SupabaseClient<Database>,
  id: string,
  status: "live" | "archived",
) {
  return callAppRpc<boolean>(client as never, "transition_flash", {
    p_flash_id: id,
    p_status: status,
  });
}

export async function publicFlashes(): Promise<PublicFlash[]> {
  const { supabaseUrl, supabasePublishableKey } = getPublicServerEnvironment();
  const client = createClient<Database>(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const rows = await callAppRpc<PublicFlashRow[]>(client as never, "list_public_flashes", {
    p_limit: 50,
  });
  return (rows ?? []).map((row) => ({
    id: row.id,
    kind: row.kind as PublicFlash["kind"],
    category: row.category as PublicFlash["category"],
    title: row.title,
    timeSlot: row.time_slot as PublicFlash["timeSlot"],
    areaLabel: row.area_label,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    ...(row.author_preview
      ? {
          authorPreview: {
            publicProfileId: row.author_preview.public_profile_id,
            displayName: row.author_preview.display_name,
            avatarUrl: null,
            areaLabel: row.author_preview.area_label,
            summary: row.author_preview.summary,
            category: row.author_preview.category as PublicProfilePreview["category"],
          },
        }
      : {}),
  }));
}

