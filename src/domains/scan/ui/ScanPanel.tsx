import { Compass, ScanLine, Sparkles } from "lucide-react";
import { formatCommunicationMessage } from "@/lib/communication/format";
import { useI18n } from "@/lib/i18n/useI18n";
import { useScanFlow } from "../hooks/useScanFlow";
import { ScanResults } from "./ScanResults";
import { ScanNeedInterpretation } from "./ScanNeedInterpretation";
import { ScanPreferences } from "./ScanPreferences";
import { ScanHistory } from "./ScanHistory";
/**
 * Scan entry UI. Flow coordination and state derivation live in useScanFlow.
 */
export function ScanPanel() {
  const { t } = useI18n();
  const {
    rows, assessments, busy, history, clearHistory,
    locating, locationError, unsupported, radiusKm, setRadiusKm, availableRadii,
    needText, setNeedText, status, start,
  } = useScanFlow();

  return (
    <div className="stack-4">
      <section className="relative overflow-hidden rounded-[1.5rem] border border-border-soft bg-gradient-to-br from-surface via-surface to-primary/5 p-4 sm:rounded-[2rem] sm:p-7">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-16 -left-12 h-36 w-36 rounded-full bg-primary/5 blur-3xl" aria-hidden />
        <div className="relative stack-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10 sm:rounded-2xl border border-primary/15 bg-primary/10 text-primary">
              <Compass className="h-5 w-5" aria-hidden />
            </div>
            <span className="text-sm font-medium text-primary">{t("scan.door.eyebrow")}</span>
          </div>

          <div className="stack-1">
            <h2 className="text-fluid-display-sm font-semibold tracking-tight">{t("scan.door.title")}</h2>
            <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">{t("scan.door.desc")}</p>
          </div>

          <label className="stack-2" htmlFor="scan-need">
            <span className="flex items-center justify-between gap-3 text-sm font-medium">
              <span>{t("scan.need.label")}</span>
              <span className="shrink-0 text-xs font-normal tabular-nums text-muted-foreground">{needText.length}/160</span>
            </span>
            <textarea
              id="scan-need"
              value={needText}
              onChange={(event) => setNeedText(event.target.value.slice(0, 160))}
              maxLength={160}
              placeholder={t("scan.need.placeholder")}
              disabled={busy || locating}
              rows={3}
              className="min-h-24 w-full resize-none rounded-xl border sm:min-h-28 sm:rounded-2xl border border-border bg-background/70 p-3 text-base leading-relaxed sm:p-4 text-foreground placeholder:text-muted-foreground/80 transition-colors focus-visible:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            />
          </label>

          {needText.trim() ? <ScanNeedInterpretation text={needText} /> : null}

          <div className="stack-2">
            <button
              type="button"
              onClick={start}
              disabled={busy || locating || !needText.trim()}
              aria-busy={busy || locating}
              className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-base font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:shadow-md hover:shadow-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-55 disabled:shadow-none"
            >
              {busy || locating ? (
                <ScanLine className="h-5 w-5 animate-pulse" aria-hidden />
              ) : (
                <Sparkles className="h-5 w-5" aria-hidden />
              )}
              {locating ? t("scan.locating") : busy ? t("scan.busy") : t("scan.start")}
            </button>
            <p className="text-center text-xs leading-relaxed text-muted-foreground">{t("scan.door.privacy")}</p>
          </div>
        </div>
      </section>

      <ScanPreferences
        radiusKm={radiusKm}
        availableRadii={availableRadii}
        disabled={busy || locating}
        onRadiusChange={setRadiusKm}
        t={t}
      />

      {status === "unsupported" && <p className="text-sm text-destructive" role="alert">{formatCommunicationMessage(t, "scan.unsupported")}</p>}
      {status === "location-error" && locationError && <p className="text-sm text-destructive" role="alert">{formatCommunicationMessage(t, `scan.location.${locationError}`)}</p>}
      {status === "scan-error" && <p className="text-sm text-destructive" role="alert">{formatCommunicationMessage(t, "scan.error")}</p>}
      {status === "empty" ? <p className="text-sm text-muted-foreground" role="status">{t("scan.empty")}</p> : null}

      {rows.length > 0 ? <ScanResults assessments={assessments} /> : null}
      <ScanHistory entries={history} onClear={clearHistory} />
    </div>
  );
}
