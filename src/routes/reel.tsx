import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { ReelProximityScreen } from "@/domains/presence/ui/ReelProximityScreen";
import { useI18n } from "@/lib/i18n/useI18n";

export const Route = createFileRoute("/reel")({
  head: () => ({
    meta: [
      { title: "Instant — Vitalis" },
      { property: "og:title", content: "Instant — Vitalis" },
      {
        name: "description",
        content:
          "Découvrez les personnes présentes autour de vous et gérez vos mises en relation en temps réel.",
      },
      {
        property: "og:description",
        content: "Découvrez les personnes présentes autour de vous avec le moteur Instant de Vitalis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReelRoute,
});

function ReelRoute() {
  const { t } = useI18n();

  return (
    <ClientOnly
      fallback={
        <section className="reel-screen" aria-busy="true" aria-live="polite">
          <p className="reel-panel__note">{t("app.loading")}</p>
        </section>
      }
    >
      <ReelProximityScreen />
    </ClientOnly>
  );
}
