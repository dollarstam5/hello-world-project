import type { ScanCandidateAssessment } from "@eco/core-contracts";
import { useI18n } from "@/lib/i18n/useI18n";
import { PublicProfilePreview } from "@/modules/flash";

const LEVELS = ["exact", "close", "alternative", "unverified"] as const;

export function ScanResults({ assessments }: { assessments: ScanCandidateAssessment[] }) {
  const { t } = useI18n();
  return (
    <div className="stack-3">
      {LEVELS.map((level) => {
        const items = assessments.filter((item) => item.level === level);
        if (!items.length) return null;
        return (
          <section key={level} className="stack-2" aria-labelledby={`scan-results-${level}`}>
            <h3 id={`scan-results-${level}`} className="text-sm font-semibold">
              {t(`scan.results.group.${level}`)} ({items.length})
            </h3>
            <ul className="stack-2">
              {items.map(({ result }) => (
                <li
                  key={result.id}
                  className="rounded-3xl border border-border-soft bg-surface p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-base font-medium">{result.title}</span>
                    <span className="shrink-0 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary">
                      {result.distanceKm.toFixed(1)} km
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t(`flash.kind.${result.kind}`)} · {t(`flash.category.${result.category}`)} ·
                    {t(`flash.slot.${result.timeSlot}`)} · {result.areaLabel}
                  </p>
                  {level === "unverified" ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {t("scan.results.unverified.description")}
                    </p>
                  ) : null}
                  {result.authorPreview ? (
                    <div className="mt-3 border-t border-border-soft pt-2">
                      <PublicProfilePreview profile={result.authorPreview} origin="real" />
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
