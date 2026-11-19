import { useState } from "react";
import { Compass, ScanLine, Sparkles } from "lucide-react";
import { formatCommunicationMessage } from "@/lib/communication/format";
import { useI18n } from "@/lib/i18n/useI18n";
import { useScan } from "../hooks/useScan";
import { ScanResults } from "./ScanResults";
import { ScanNeedInterpretation } from "./ScanNeedInterpretation";
import { ScanPreferences } from "./ScanPreferences";
import { ScanHistory } from "./ScanHistory";
import { useScanPreferences } from "../hooks/useScanPreferences";

const SCAN_LIMIT = 20;

/**
 * Scan entry: a discovery doorway. Keep the need central and settings secondary.
 * Presentation only; scanning logic lives in useScan.
 */
export function ScanPanel() {
  const { t } = useI18n();
  const { rows, assessments, busy, failed, execute, history, clearHistory } = useScan();
  const [locationError, setLocationError] = useState<
    "permission" | "unavailable" | "timeout" | "unknown" | null
  >(null);
  const [started, setStarted] = useState(false);
  const [locating, setLocating] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const { radiusKm, setRadiusKm, availableRadii } = useScanPreferences();
  const [needText, setNeedText] = useState("");

  const start = () => {
    setLocationError(null);
    setUnsupported(false);
    setStarted(true);

    if (!navigator.geolocation?.getCurrentPosition) {
      setUnsupported(true);
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        void execute({
          text: needText.trim(),
          category: null,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          radiusKm,
          limit: SCAN_LIMIT,
        });
      },
      (error) => {
        setLocating(false);
        const code =
          error.code === 1
            ? "permission"
            : error.code === 2
              ? "unavailable"
              : error.code === 3
                ? "timeout"
                : "unknown";
        setLocationError(code);
      },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  };

  return (
    <div className="stack-5">
      <div className="relative overflow-hidden rounded-[2rem] border border-border-soft bg-surface p-4 sm:p-6">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl" aria-hidden />
        <div className="relative stack-4">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Compass className="h-4 w-4" aria-hidden />
            <span>{t("scan.door.eyebrow")}</span>
          </div>
          <div className="stack-1">
            <h2 className="text-fluid-display-sm font-semibold tracking-tight">{t("scan.door.title")}</h2>
            <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">{t("scan.door.desc")}</p>
          </div>

          <label className="stack-2" htmlFor="scan-need">
            <span className="flex items-center justify-between gap-3 text-sm font-medium">
              <span>{t("scan.need.label")}</span>
              <span className="text-xs font-normal tabular-nums text-muted-foreground">{needText.length}/160</span>
            </span>
            <textarea
              id="scan-need"
              value={needText}
              onChange={(event) => setNeedText(event.target.value.slice(0, 160))}
              maxLength={160}
              placeholder={t("scan.need.placeholder")}
              disabled={busy || locating}
              rows={4}
              className="min-h-32 w-full resize-none rounded-2xl border border-border bg-background/70 p-4 text-base leading-relaxed text-foreground placeholder:text-muted-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            />
          </label>

          {needText.trim() ? <ScanNeedInterpretation text={needText} /> : null}

          <div className="stack-2">
            <button
              type="button"
              onClick={start}
              disabled={busy || locating || !needText.trim()}
              aria-busy={busy || locating}
              className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-base font-semibold text-primary-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-55"
            >
              {busy || locating ? (
                <ScanLine className="h-5 w-5 animate-pulse" aria-hidden />
              ) : (
                <Sparkles className="h-5 w-5" aria-hidden />
              )}
              {busy || locating ? t("scan.busy") : t("scan.start")}
            </button>
            <p className="text-center text-xs leading-relaxed text-muted-foreground">{t("scan.door.privacy")}</p>
          </div>
        </div>
      </div>

      <ScanPreferences
        radiusKm={radiusKm}
        availableRadii={availableRadii}
        disabled={busy || locating}
        onRadiusChange={setRadiusKm}
        t={t}
      />

      {unsupported && <p className="text-sm text-destructive" role="alert">{formatCommunicationMessage(t, "scan.unsupported")}</p>}
      {locationError && <p className="text-sm text-destructive" role="alert">{formatCommunicationMessage(t, `scan.location.${locationError}`)}</p>}
      {failed && <p className="text-sm text-destructive" role="alert">{formatCommunicationMessage(t, "scan.error")}</p>}

      {started && !busy && !locating && !locationError && !failed && !unsupported && rows.length === 0 ? (
        <p className="text-sm text-muted-foreground" role="status">{t("scan.empty")}</p>
      ) : null}

      {rows.length > 0 ? <ScanResults assessments={assessments} /> : null}

      <ScanHistory entries={history} onClear={clearHistory} />
    </div>
  );
}
