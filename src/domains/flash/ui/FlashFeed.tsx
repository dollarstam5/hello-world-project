import { useHydrated } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { FlashCard } from "@/components/app/FlashCard";
import { useI18n } from "@/lib/i18n/useI18n";
import { useFlashFeed } from "../hooks/useFlashFeed";

export function FlashFeed() {
  const hydrated = useHydrated();
  const { t } = useI18n();
  const { rows, source, loading, error, needsLocation, hasLocation, requestLocation, refresh } =
    useFlashFeed();

  if (!hydrated || (loading && rows.length === 0)) {
    return (
      <p className="text-sm text-muted-foreground" role="status">
        {t("flash.feed.loading")}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-3" data-flash-feed-hydrated={hydrated ? "true" : "false"}>
      {needsLocation ? (
        <div className="grid gap-3 rounded-2xl border border-border bg-card p-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t("flash.discover.locationHint")}
          </p>
          <Button
            type="button"
            onClick={() => void requestLocation()}
            disabled={loading}
            className="min-h-12 w-full rounded-full"
          >
            {t("flash.discover.locationAction")}
          </Button>
        </div>
      ) : null}
      {error ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-warning" role="alert">
            {error}
          </p>
          <Button
            type="button"
            variant="ghost"
            onClick={() => void (hasLocation ? refresh() : requestLocation())}
            disabled={loading}
            className="min-h-12"
          >
            {t("common.retry")}
          </Button>
        </div>
      ) : null}
      {hasLocation ? (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={() => void refresh()}
            disabled={loading}
            className="min-h-11"
          >
            {t("flash.discover.refresh")}
          </Button>
        </div>
      ) : null}
      {rows.length === 0 && !needsLocation ? (
        <p className="text-sm text-muted-foreground" role="status">
          {t("flash.empty")}
        </p>
      ) : (
        <>
          {rows.length > 0 ? (
            <p className="text-xs text-muted-foreground" role="status">
              {source === "remote" ? t("flash.feed.remote") : t("flash.feed.offline")}
            </p>
          ) : null}
          {rows.map((flash) => (
            <FlashCard
              key={flash.id}
              title={flash.title}
              description={`${t(`flash.kind.${flash.kind}`)} · ${t(`flash.category.${flash.category}`)} · ${t(`flash.slot.${flash.timeSlot}`)}`}
              ttl={flash.origin === "real" ? flash.areaLabel : undefined}
              origin={flash.origin}
              authorPreview={flash.authorPreview}
            />
          ))}
        </>
      )}
    </div>
  );
}
