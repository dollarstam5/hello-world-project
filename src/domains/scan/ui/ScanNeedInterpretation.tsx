import { interpretScanRequest } from "@eco/core-logic";
import { useI18n } from "@/lib/i18n/useI18n";

const INTENT_KEYS = [
  "repair",
  "transport",
  "work",
  "buy",
  "food",
  "learning",
  "health",
  "activity",
  "place",
  "social",
  "help",
  "service",
] as const;

/** Lightweight, honest preview of the deterministic interpretation. */
export function ScanNeedInterpretation({ text }: { text: string }) {
  const { t } = useI18n();
  const parsed = interpretScanRequest(text);
  const intentKey = INTENT_KEYS.includes(parsed.intent as (typeof INTENT_KEYS)[number])
    ? `scan.interpretation.intent.${parsed.intent}`
    : "scan.interpretation.intent.unknown";
  const details = [
    parsed.timeContext,
    parsed.locationContext,
    ...parsed.taskContext,
    ...parsed.objectContext,
  ].filter(Boolean);
  const uniqueDetails = [...new Set(details)];

  return (
    <section className="stack-2 rounded-2xl border border-border-soft bg-surface p-3" aria-live="polite">
      <p className="text-sm font-medium">{t("scan.interpretation.title")}</p>
      <p className="text-sm text-muted-foreground">
        {t("scan.interpretation.intentLabel")} {t(intentKey)}
      </p>
      {uniqueDetails.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {uniqueDetails.map((detail) => (
            <li key={detail} className="rounded-full bg-primary-soft px-2.5 py-1 text-xs text-primary">
              {detail}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
