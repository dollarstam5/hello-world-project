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
  // No fabricated people: the live list will be connected to the verified
  // presence service when its client transport is available.
  return <ReelProximityScreen people={[]} />;
}
