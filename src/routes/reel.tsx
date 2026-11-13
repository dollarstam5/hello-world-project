import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { ReelProximityScreen } from "@/domains/presence/ui/ReelProximityScreen";

export const Route = createFileRoute("/reel")({
  head: () => ({
    meta: [
      { title: "Réel — Vitalis" },
      { property: "og:title", content: "Réel — Vitalis" },
      {
        name: "description",
        content: "Découvrez les personnes présentes autour de vous et gérez vos mises en relation en temps réel.",
      },
      {
        property: "og:description",
        content: "Découvrez les personnes présentes autour de vous avec le moteur Réel de Vitalis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
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
