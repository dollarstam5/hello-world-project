import { Info } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { FLASH_SCOPES, FLASH_URGENCIES } from "@eco/core-contracts";
import type { FlashCategory, FlashKind, FlashTimeSlot } from "@eco/core-contracts";
import { Button } from "@/components/ui/button";
import { formatCommunicationMessage } from "@/lib/communication/format";
import { useI18n } from "@/lib/i18n/useI18n";
import type { useFlashComposer } from "./useFlashComposer";

type ComposerState = ReturnType<typeof useFlashComposer>;

type Props = {
  state: ComposerState;
  user: { id: string } | null;
  authLoading: boolean;
};

export function FlashComposerReviewStep({ state, user, authLoading }: Props) {
  const { t } = useI18n();

  return (
    <>
      <div className="rounded-2xl bg-muted/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("flash.composer.yourMessage")}
        </p>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{state.text}</p>
        <button
          type="button"
          className="mt-3 text-sm font-semibold text-primary"
          onClick={() => state.setStep("write")}
        >
          {t("flash.composer.editMessage")}
        </button>
      </div>

      <section
        className="mt-4 grid gap-3 rounded-2xl border border-border p-4"
        aria-labelledby="flash-location-title"
      >
        <div>
          <h3 id="flash-location-title" className="text-sm font-semibold">
            {t("flash.location.title")}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {t("flash.location.description")}
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t("flash.location.optionalDraft")}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="min-h-11 rounded-full"
          onClick={() => void state.detectFlashLocation()}
          disabled={state.locating || state.publishing}
        >
          {state.locating
            ? t("flash.location.detecting")
            : state.location
              ? t("flash.location.refresh")
              : t("flash.location.detect")}
        </Button>
        {state.location ? (
          <>
            <label className="grid gap-1.5 text-sm font-medium">
              {t("flash.location.confirm")}
              <input
                value={state.areaLabel}
                onChange={(event) => state.setAreaLabel(event.target.value)}
                maxLength={160}
                placeholder={t("flash.location.placeholder")}
                className="min-h-11 rounded-xl border border-input bg-background px-3 font-normal"
              />
            </label>
            <p className="text-xs text-muted-foreground">
              {t("flash.location.accuracy")} ({Math.round(state.location.accuracy)} m)
            </p>
          </>
        ) : null}
        {state.locationError ? (
          <p className="text-xs text-muted-foreground" role="status">
            {state.locationError}
          </p>
        ) : null}
      </section>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium">
          {t("flash.composer.kind")}
          <select
            value={state.kind}
            onChange={(event) => state.setKind(event.target.value as FlashKind)}
            className="min-h-11 rounded-xl border border-input bg-background px-3"
          >
            {(["need", "offer"] as FlashKind[]).map((value) => (
              <option key={value} value={value}>
                {t(`flash.kind.${value}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          {t("flash.composer.category")}
          <select
            value={state.category}
            onChange={(event) => state.setCategory(event.target.value as FlashCategory)}
            className="min-h-11 rounded-xl border border-input bg-background px-3"
          >
            {state.categories.map((value) => (
              <option key={value} value={value}>
                {t(`flash.category.${value}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          {t("flash.composer.when")}
          <select
            value={state.timeSlot}
            onChange={(event) => state.setTimeSlot(event.target.value as FlashTimeSlot)}
            className="min-h-11 rounded-xl border border-input bg-background px-3"
          >
            {state.timeSlots.map((value) => (
              <option key={value} value={value}>
                {t(`flash.slot.${value}`)}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="grid gap-2 sm:col-span-2">
          <legend className="text-sm font-semibold">
            {t("flash.composer.scope")}{" "}
            <span className="font-normal text-muted-foreground">(facultatif)</span>
          </legend>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t("flash.composer.scopeHint")}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {FLASH_SCOPES.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={state.scope === value}
                onClick={() => state.setScope(value)}
                className={`min-h-12 rounded-xl border px-3 py-2 text-left text-sm font-medium transition ${state.scope === value ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/30" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}
              >
                {t(`flash.scope.${value}`)}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="grid gap-2 sm:col-span-2">
          <legend className="text-sm font-semibold">
            {t("flash.composer.urgency")}{" "}
            <span className="font-normal text-muted-foreground">(facultatif)</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {FLASH_URGENCIES.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={state.urgency === value}
                onClick={() => state.setUrgency(value)}
                className={`min-h-10 rounded-full border px-3 py-2 text-sm font-medium transition ${state.urgency === value ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/30" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}
              >
                {t(`flash.urgency.${value}`)}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <p>{t("flash.location.privateNotice")}</p>
      </div>

      {!user && !authLoading ? (
        <div className="mt-4 rounded-xl border border-border p-3">
          <p className="text-sm text-muted-foreground">{t("flash.composer.signIn")}</p>
          <Button asChild className="mt-3 w-full rounded-full">
            <Link to="/auth" search={{ mode: undefined }}>
              {t("auth.signIn")}
            </Link>
          </Button>
        </div>
      ) : null}
      {state.publishError ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {formatCommunicationMessage(t, "flash.composer.error")}
        </p>
      ) : null}

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          className="min-h-12 rounded-full"
          onClick={() => state.setStep("write")}
          disabled={state.publishing}
        >
          {t("common.cancel")}
        </Button>
        <Button
          type="button"
          className="min-h-12 rounded-full"
          onClick={() => void state.saveFlashDraft()}
          disabled={!user || authLoading || state.publishing || !state.text.trim()}
        >
          {state.publishing ? t("app.loading") : t("flash.location.saveDraft")}
        </Button>
      </div>
      <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
        {t("flash.location.publishPaused")}
      </p>
    </>
  );
}
