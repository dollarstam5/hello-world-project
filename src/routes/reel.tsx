import { ClientOnly, createFileRoute } from "@tanstack/react-router";
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
  return (
    <ClientOnly
      fallback={
        <section className="reel-screen" aria-busy="true" aria-live="polite">
          <p className="reel-panel__note">Préparation de votre espace Réel…</p>
        </section>
      }
    >
      <ReelProximityScreen />
    </ClientOnly>
  );
}
