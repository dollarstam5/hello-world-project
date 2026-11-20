import { interpretScanRequest } from "@eco/core-logic";
import { useI18n } from "@/lib/i18n/useI18n";

const INTENT_KEYS = [
  "repair", "transport", "work", "buy", "food", "learning",
  "health", "activity", "place", "social", "help", "service",
] as const;

/** Honest, deterministic summary: does not claim to paraphrase beyond local extraction. */
export function ScanNeedInterpretation({ text }: { text: string }) {
  const { t } = useI18n();
  const parsed = interpretScanRequest(text);
  const intentKey = INTENT_KEYS.includes(parsed.intent as (typeof INTENT_KEYS)[number])
    ? `scan.interpretation.intent.${parsed.intent}`
    : "scan.interpretation.intent.unknown";
  const details = [
    parsed.timeContext,
    parsed.locationContext,
    parsed.distanceContext,
    parsed.quantityContext,
    ...parsed.requiredCriteria,
    ...parsed.preferences,
  ].filter((value): value is string => Boolean(value));
  const uniqueDetails = [...new Set(details)];

  return (
    <section className="stack-2 rounded-2xl border border-border-soft bg-surface p-3 sm:p-4" aria-live="polite">
      <p className="text-sm font-semibold">{t("scan.interpretation.title")}</p>
      <p className="text-sm text-muted-foreground">{t("scan.interpretation.intentLabel")} {t(intentKey)}</p>
      <div className="stack-1">
        <p className="text-xs font-medium text-muted-foreground">{t("scan.interpretation.detected")}</p>
        {uniqueDetails.length ? (
          <ul className="flex flex-wrap gap-1.5">
            {uniqueDetails.map((detail) => (
              <li key={detail} className="rounded-full border border-border bg-background px-2.5 py-1 text-xs">{detail}</li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-muted-foreground">{t("scan.interpretation.noDetails")}</p>
        )}
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{t("scan.interpretation.honestyNote")}</p>
    </section>
  );
}
