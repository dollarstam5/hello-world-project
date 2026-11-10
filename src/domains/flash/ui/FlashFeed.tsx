import { Button } from "@/components/ui/button";
import { FlashCard } from "@/components/app/FlashCard";
import { useI18n } from "@/lib/i18n/useI18n";
import { useFlashFeed } from "../hooks/useFlashFeed";

export function FlashFeed() {
  const { t } = useI18n();
  const { rows, source, loading, error, refresh } = useFlashFeed();

  if (loading && rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground" role="status">
        {t("flash.feed.loading")}
      </p>
    );
  }

  return (
    <div className="grid gap-3">
      {error ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-warning" role="alert">
            {error}
          </p>
          <Button
            type="button"
            variant="ghost"
            onClick={() => void refresh()}
            disabled={loading}
            className="min-h-12"
          >
            {t("common.retry")}
          </Button>
        </div>
      ) : null}
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground" role="status">
          {t("flash.empty")}
        </p>
      ) : (
        <>
          <p className="text-xs text-muted-foreground" role="status">
            {source === "remote" ? t("flash.feed.remote") : t("flash.feed.offline")}
          </p>
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
