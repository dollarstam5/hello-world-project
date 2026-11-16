import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { callAppRpc } from "@/lib/api/rpc.server";

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
