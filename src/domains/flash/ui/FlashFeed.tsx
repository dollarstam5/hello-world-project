import { FlashCard } from "@/components/app/FlashCard";
import { useI18n } from "@/lib/i18n/useI18n";
import { useFlashFeed } from "../hooks/useFlashFeed";

export function FlashFeed() {
  const { t } = useI18n();
  const { rows, source, loading, error } = useFlashFeed();

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
        <p className="text-xs text-warning" role="alert">
          {error}
        </p>
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
              description={`${flash.category} · ${flash.timeSlot}`}
              ttl={flash.areaLabel}
            />
          ))}
        </>
      )}
    </div>
  );
}
