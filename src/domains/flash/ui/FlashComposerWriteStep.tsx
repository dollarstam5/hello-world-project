import { ArrowRight, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { useFlashComposer } from "./useFlashComposer";

type ComposerState = ReturnType<typeof useFlashComposer>;

export function FlashComposerWriteStep({ state }: { state: ComposerState }) {
  const { t } = useFlashComposerTranslations();
  return (
    <>
      <Textarea
        value={state.text}
        onChange={(event) => state.setText(event.target.value)}
        maxLength={600}
        rows={5}
        autoFocus
        placeholder={t("flash.composer.placeholder")}
        aria-label={t("flash.composer.placeholder")}
        className="min-h-36 resize-y rounded-2xl text-base"
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          className="min-h-11 rounded-full"
          onClick={state.recording ? () => state.recognitionRef.current?.stop() : state.startVoiceInput}
          disabled={!state.speechSupported && !state.recording}
        >
          {state.recording ? <MicOff className="mr-2 size-4" /> : <Mic className="mr-2 size-4" />}
          {state.recording ? t("flash.voice.stop") : t("flash.voice.action")}
        </Button>
        <span className="text-xs tabular-nums text-muted-foreground">{state.text.length}/600</span>
      </div>
      {state.voiceMessage ? (
        <p className="mt-2 text-xs text-muted-foreground" role="status">{state.voiceMessage}</p>
      ) : !state.speechSupported ? (
        <p className="mt-2 text-xs text-muted-foreground">{t("flash.voice.unsupported")}</p>
      ) : null}
      {state.parsedIntent ? (
        <div className="mt-4 rounded-2xl border border-primary/15 bg-primary/5 p-4" aria-live="polite">
          <p className="mb-2 text-sm font-semibold">{t("flash.composer.understood")}</p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-card px-3 py-1.5 text-xs font-medium">
              {t(`flash.kind.${state.parsedIntent.kind}`)}
            </span>
            <span className="rounded-full bg-card px-3 py-1.5 text-xs font-medium">
              {t(`flash.category.${state.parsedIntent.category}`)}
            </span>
            <span className="rounded-full bg-card px-3 py-1.5 text-xs font-medium">
              {t(`flash.slot.${state.parsedIntent.timeSlot}`)}
            </span>
          </div>
        </div>
      ) : null}
      <Button
        type="button"
        className="mt-5 min-h-12 w-full rounded-full"
        disabled={!state.parsedIntent || !state.text.trim()}
        onClick={state.continueToReview}
      >
        {t("common.continue")}
        <ArrowRight className="ml-2 size-4" aria-hidden="true" />
      </Button>
    </>
  );
}

import { useI18n as useFlashComposerTranslations } from "@/lib/i18n/useI18n";
