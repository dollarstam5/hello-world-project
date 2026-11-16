import { ClientOnly, createLazyFileRoute } from "@tanstack/react-router";
import { ReelProximityScreen } from "@/domains/presence/ui/ReelProximityScreen";
import { useI18n } from "@/lib/i18n/useI18n";

export const Route = createLazyFileRoute("/reel")({
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
