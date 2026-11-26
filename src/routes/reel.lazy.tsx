import { lazy, Suspense } from "react";
import { ClientOnly, createLazyFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n/useI18n";

const ReelProximityScreen = lazy(() =>
  import("@/modules/reel/ui/ReelProximityScreen").then((module) => ({
    default: module.ReelProximityScreen,
  })),
);

export const Route = createLazyFileRoute("/reel")({
  component: ReelRoute,
});

function ReelRoute() {
  const { t } = useI18n();

  const loadingFallback = (
    <section
      className="reel-screen flex min-h-dvh items-center justify-center"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-xs text-muted-foreground">{t("app.loading")}</p>
      </div>
    </section>
  );

  return (
    <ClientOnly fallback={loadingFallback}>
      <Suspense fallback={loadingFallback}>
        <ReelProximityScreen />
      </Suspense>
    </ClientOnly>
  );
}
