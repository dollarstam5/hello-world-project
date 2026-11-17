import { createClient } from "@supabase/supabase-js";
import { createFileRoute } from "@tanstack/react-router";
import {
  getCronSecrets,
  getMaintenanceEnvironment,
} from "@/config/env.server";
import { getServerConfig } from "@/lib/config.server";

async function matchesSecret(candidate: string, expected: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [candidateHash, expectedHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(candidate)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);
  const left = new Uint8Array(candidateHash);
  const right = new Uint8Array(expectedHash);
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left[index]! ^ right[index]!;
  }
  return difference === 0;
}

async function authorized(request: Request): Promise<boolean> {
  const secrets = getCronSecrets();
  if (!secrets.current && !secrets.previous) return false;
  const authorization = request.headers.get("authorization") ?? "";
  if (!authorization.startsWith("Bearer ")) return false;
  const candidate = authorization.slice(7);
  if (!candidate || candidate.length > 512) return false;

  const checks = await Promise.all(
    [secrets.current, secrets.previous]
      .filter((secret): secret is string => Boolean(secret))
      .map((secret) => matchesSecret(candidate, secret)),
  );
  return checks.some(Boolean);
}

export const Route = createFileRoute("/api/cron/maintenance")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          if (!(await authorized(request))) {
            return Response.json({ error: "unauthorized" }, { status: 401 });
          }

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
