import { createFileRoute } from "@tanstack/react-router";
import { ReelProximityScreen } from "@/domains/presence/ui/ReelProximityScreen";

export const Route = createFileRoute("/reel")({
  head: () => ({
    meta: [
      { title: "Temps Réel — Vitalis" },
      {
        name: "description",
        content: "Retrouvez les présences réelles autour de vous.",
      },
    ],
  }),
  // Réel depends on browser-only location and Supabase client modules.
  // Keep its interactive route component out of the server render graph.
  ssr: false,
  component: ReelRoute,
});

function ReelRoute() {
  return <ReelProximityScreen />;
}
