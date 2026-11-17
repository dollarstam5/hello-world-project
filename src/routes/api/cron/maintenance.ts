import { createClient } from "@supabase/supabase-js";
import { createFileRoute } from "@tanstack/react-router";
import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";
import { getMaintenanceEnvironment } from "@/config/env.server";
import { getServerConfig } from "@/lib/config.server";

export const Route = createFileRoute("/api/cron/maintenance")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const authenticationError = await authenticateCronRequest(request);
          if (authenticationError) return authenticationError;

          const config = getServerConfig();
          const retention = getMaintenanceEnvironment();
          const admin = createClient(config.supabaseUrl, config.supabaseSecretKey, {
            auth: { persistSession: false, autoRefreshToken: false },
          });
          const { data, error } = await admin.rpc("purge_operational_retention", {
            p_sync_receipt_days: retention.syncReceiptDays,
            p_ai_request_days: retention.aiRequestDays,
          });

          if (error) {
            console.error("maintenance retention failed", error.code);
            return Response.json({ error: "maintenance_unavailable" }, { status: 503 });
          }

          return Response.json(
            { ok: true, deleted: data },
            { headers: { "Cache-Control": "no-store" } },
          );
        } catch {
          return Response.json({ error: "maintenance_unavailable" }, { status: 503 });
        }
      },
    },
  },
});
