import {
  Compass,
  Mic,
  MicOff,
  ScanLine,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { formatCommunicationMessage } from "@/features/communication/model/format";
import { useI18n } from "@/lib/i18n/useI18n";
import { useScanFlow } from "../hooks/useScanFlow";
import { ScanResults } from "./ScanResults";
import { ScanNeedInterpretation } from "./ScanNeedInterpretation";
import { ScanPreferences } from "./ScanPreferences";
import { ScanHistory } from "./ScanHistory";
import { useScanVoiceInput } from "../hooks/useScanVoiceInput";

export function ScanPanel() {
  const { t, locale } = useI18n();
  const {
    rows,
    assessments,
    busy,
    history,
    clearHistory,
    locating,
    locationError,
    unsupported,
    radiusKm,
    setRadiusKm,
    availableRadii,
    needText,
    setNeedText,
    stage,
    confirmNeed,
    confirmInterpretation,
    confirmCriteria,
    backToNeed,
    backToCriteria,
    status,
    start,
  } = useScanFlow();
  const voice = useScanVoiceInput(locale, (transcript) => {
    setNeedText((current) =>
      (current.trim() ? `${current.trim()} ${transcript}` : transcript).slice(0, 160),
    );
  });
  const isWorking = busy || locating;

  return (
    <div className="stack-4">
      <section
        id="guide"
        className="relative overflow-hidden rounded-[1.5rem] border border-border-soft bg-gradient-to-br from-surface via-surface to-primary/5 p-4 sm:rounded-[2rem] sm:p-7"
      >
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-12 h-36 w-36 rounded-full bg-primary/5 blur-3xl"
          aria-hidden
        />
        <div className="relative stack-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary sm:h-10 sm:w-10 sm:rounded-2xl">
              <Compass className="h-5 w-5" aria-hidden />
            </div>
            <span className="text-sm font-medium text-primary">{t("scan.door.eyebrow")}</span>
          </div>
          <div className="stack-1">
            <h2 className="text-fluid-display-sm font-semibold tracking-tight">
              {t("scan.door.title")}
            </h2>
            <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
              {t("scan.door.desc")}
            </p>
          </div>

          <div className="flex items-center gap-1.5" aria-label={t("scan.flow.progress")}>
            {(["need", "confirmation", "criteria", "final"] as const).map((step, index) => (
              <div key={step} className="flex flex-1 items-center gap-1.5">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${stage === step ? "bg-primary text-primary-foreground" : index < (["need", "confirmation", "criteria", "final"] as const).indexOf(stage) ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}
                >
                  {index <
                  (["need", "confirmation", "criteria", "final"] as const).indexOf(stage) ? (
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="hidden min-w-0 text-xs text-muted-foreground sm:block">
                  {t(`scan.flow.step.${step}`)}
                </span>
                {index < 3 ? <span className="h-px flex-1 bg-border" /> : null}
              </div>
            ))}
          </div>

          {stage === "need" ? (
            <div className="stack-3">
              <label className="stack-2" htmlFor="scan-need">
                <span className="flex items-center justify-between gap-3 text-sm font-medium">
                  <span>{t("scan.need.label")}</span>
                  <span className="shrink-0 text-xs font-normal tabular-nums text-muted-foreground">
                    {needText.length}/160
                  </span>
                </span>
                <textarea
                  id="scan-need"
                  value={needText}
                  onChange={(event) => setNeedText(event.target.value.slice(0, 160))}
                  maxLength={160}
                  placeholder={t("scan.need.placeholder")}
                  disabled={isWorking}
                  rows={3}
                  className="min-h-24 w-full resize-none rounded-xl border border-border bg-background/70 p-3 text-base leading-relaxed text-foreground placeholder:text-muted-foreground/80 transition-colors focus-visible:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 sm:min-h-28 sm:rounded-2xl sm:p-4"
                />
              </label>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={voice.toggleRecording}
                  disabled={isWorking}
                  aria-pressed={voice.recording}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                >
                  {voice.recording ? (
                    <MicOff className="h-4 w-4" aria-hidden />
                  ) : (
                    <Mic className="h-4 w-4" aria-hidden />
                  )}
                  {voice.recording ? t("scan.voice.stop") : t("scan.voice.action")}
                </button>
                <span className="text-xs text-muted-foreground">{t("scan.voice.hint")}</span>
              </div>
              {voice.voiceStatus !== "idle" ? (
                <p
                  className="text-xs leading-relaxed text-muted-foreground"
                  role="status"
                  aria-live="polite"
                >
                  {t(`scan.voice.${voice.voiceStatus}`)}
                </p>
              ) : null}
              <button
                type="button"
                onClick={confirmNeed}
                disabled={!needText.trim() || isWorking}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              >
                {t("scan.flow.continueNeed")} <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          ) : null}

          {stage === "confirmation" ? (
            <div className="stack-3">
              <ScanNeedInterpretation text={needText} />
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={confirmInterpretation}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Check className="h-4 w-4" aria-hidden /> {t("scan.flow.confirmNeed")}
                </button>
                <button
                  type="button"
                  onClick={backToNeed}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden /> {t("scan.flow.editNeed")}
                </button>
              </div>
            </div>
          ) : null}

          {stage === "criteria" ? (
            <div className="stack-3">
              <ScanNeedInterpretation text={needText} />
              <ScanPreferences
                radiusKm={radiusKm}
                availableRadii={availableRadii}
                disabled={isWorking}
                onRadiusChange={setRadiusKm}
                t={t}
              />
              <p className="text-xs leading-relaxed text-muted-foreground">
                {t("scan.flow.criteriaNote")}
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={confirmCriteria}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {t("scan.flow.continueCriteria")} <ChevronRight className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={backToNeed}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden /> {t("scan.flow.editNeed")}
                </button>
              </div>
            </div>
          ) : null}

          {stage === "final" ? (
            <div className="stack-3">
              <div className="stack-2 rounded-2xl border border-border-soft bg-surface p-3 sm:p-4">
                <h3 className="text-sm font-semibold">{t("scan.flow.finalTitle")}</h3>
                <p className="text-sm leading-relaxed">{needText}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-border bg-background px-3 py-1.5">
                    {t("scan.flow.radiusLabel") + ": " + radiusKm + " " + t("scan.radius.unit")}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={start}
                  disabled={isWorking}
                  aria-busy={isWorking}
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-base font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-55"
                >
                  {isWorking ? (
                    <ScanLine className="h-5 w-5 animate-pulse" aria-hidden />
                  ) : (
                    <Sparkles className="h-5 w-5" aria-hidden />
                  )}
                  {locating ? t("scan.locating") : busy ? t("scan.busy") : t("scan.flow.launch")}
                </button>
                <button
                  type="button"
                  onClick={backToCriteria}
                  disabled={isWorking}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden /> {t("scan.flow.editCriteria")}
                </button>
              </div>
              <p className="text-center text-xs leading-relaxed text-muted-foreground">
                {t("scan.door.privacy")}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {status === "unsupported" && (
        <p className="text-sm text-destructive" role="alert">
          {formatCommunicationMessage(t, "scan.unsupported")}
        </p>
      )}
      {status === "location-error" && locationError && (
        <p className="text-sm text-destructive" role="alert">
          {formatCommunicationMessage(t, `scan.location.${locationError}`)}
        </p>
      )}
      {status === "scan-error" && (
        <p className="text-sm text-destructive" role="alert">
          {formatCommunicationMessage(t, "scan.error")}
        </p>
      )}
      {status === "empty" ? (
        <p className="text-sm text-muted-foreground" role="status">
          {t("scan.empty")}
        </p>
      ) : null}
      <div id="example" className="scroll-mt-6">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          {t("home.engine.scan.example")}
        </p>
      </div>
      {rows.length > 0 ? <ScanResults assessments={assessments} /> : null}
      <ScanHistory entries={history} onClear={clearHistory} />
    </div>
  );
}
