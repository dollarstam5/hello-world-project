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
  component: ReelRoute,
});

function ReelRoute() {
  return <ReelProximityScreen />;
}
