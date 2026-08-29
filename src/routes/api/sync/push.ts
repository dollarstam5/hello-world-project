import { createFileRoute } from "@tanstack/react-router";

/** Sync endpoint called by the background worker: send pending local writes. */
export const Route = createFileRoute("/api/sync/push")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { readSyncSession } = await import("@/lib/sync/session.server");
        const { runPush } = await import("@/lib/sync/transport.server");
        const { validatePush } = await import("@/lib/sync/validate");

        const session = await readSyncSession(request);
        if (!session) return json({ error: "unauthorized" }, 401);

        const body = await request.json().catch(() => ({}));
        const result = await runPush(session.supabase as never, validatePush(body), session.userId);
        return json(result, 200);
      },
    },
  },
});

function json(value: unknown, status: number): Response {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}
