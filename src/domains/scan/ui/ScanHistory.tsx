import { useI18n } from "@/lib/i18n/useI18n";
import type { ScanHistoryEntry } from "../services/scan-history.service";

type ScanHistoryProps = {
  entries: ScanHistoryEntry[];
  onClear: () => void;
};

export function ScanHistory({ entries, onClear }: ScanHistoryProps) {
  const { t, locale } = useI18n();

  return (
    <details
      className="group rounded-2xl border border-border-soft px-4 py-3"
      aria-labelledby="scan-history-heading"
    >
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
        <h3 id="scan-history-heading" className="text-sm font-semibold">
          {t("scan.history.title")}
        </h3>
        {entries.length > 0 ? (
          <span className="text-xs text-muted-foreground">{entries.length}</span>
        ) : null}
      </summary>
      <div className="stack-3 pt-3">
        {entries.length > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="min-h-11 self-start rounded-full px-3 text-xs font-medium text-muted-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t("scan.history.clear")}
          </button>
        ) : null}
        <p className="text-xs leading-relaxed text-muted-foreground">{t("scan.history.privacy")}</p>
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground" role="status">
            {t("scan.history.empty")}
          </p>
        ) : (
          <ul className="stack-2">
            {entries.map((entry, index) => (
              <li
                key={`${entry.searchedAt}-${index}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border-soft bg-surface px-4 py-3"
              >
                <span className="text-sm">
                  {new Intl.DateTimeFormat(locale, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(entry.searchedAt)}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {t("scan.history.results").replace("{count}", String(entry.resultCount))}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </details>
  );
}
