import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Info, Mic, MicOff, Plus, Sparkles, X, Zap } from "lucide-react";
import { FLASH_SCOPES, FLASH_URGENCIES } from "@eco/core-contracts";
import type {
  FlashCategory,
  FlashKind,
  FlashScope,
  FlashTimeSlot,
  FlashUrgency,
  UserId,
} from "@eco/core-contracts";
import { parseFlashIntent } from "@eco/core-logic";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/domains/auth";
import { useI18n } from "@/lib/i18n/useI18n";
import { createFlash } from "../data";
import { FlashFeed } from "./FlashFeed";
import { MyFlashManagement } from "./MyFlashManagement";

type FlashTab = "discover" | "mine";
type SpeechResultEvent = {
  results: ArrayLike<ArrayLike<{ transcript?: string }>>;
};
type SpeechErrorEvent = { error?: string };
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: ((event: SpeechErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type SpeechWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
};

const CATEGORIES: FlashCategory[] = [
  "personal",
  "professional",
  "commercial",
  "home",
  "transport",
  "food",
  "education",
  "health",
  "events",
  "other",
];
const TIME_SLOTS: FlashTimeSlot[] = ["now", "today", "tomorrow", "this_week"];
// Keep publishing disabled until the backend filters each selected scope.
const FLASH_SCOPE_FILTERING_ENABLED = false;

function getSpeechConstructor() {
  if (typeof window === "undefined") return undefined;
  const speechWindow = window as SpeechWindow;
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
}

function expiryFor(timeSlot: FlashTimeSlot) {
  const phrases: Record<FlashTimeSlot, string> = {
    now: "maintenant",
    today: "aujourd'hui",
    tomorrow: "demain",
    this_week: "cette semaine",
  };
  return parseFlashIntent(phrases[timeSlot]).expiresAt;
}

export function FlashExperienceScreen() {
  const { t, locale } = useI18n();
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<FlashTab>("discover");
  const [composerOpen, setComposerOpen] = useState(false);
  const [step, setStep] = useState<"write" | "review">("write");
  const [text, setText] = useState("");
  const [kind, setKind] = useState<FlashKind>("need");
  const [category, setCategory] = useState<FlashCategory>("other");
  const [timeSlot, setTimeSlot] = useState<FlashTimeSlot>("today");
  const [scope, setScope] = useState<FlashScope | null>(null);
  const [urgency, setUrgency] = useState<FlashUrgency | null>(null);
  const [recording, setRecording] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState(false);
  const [success, setSuccess] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const parsedIntent = useMemo(
    () => (text.trim().length >= 3 ? parseFlashIntent(text) : null),
    [text],
  );
  const speechSupported = Boolean(getSpeechConstructor());

  useEffect(
    () => () => {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
    },
    [],
  );

  function openComposer() {
    setText("");
    setScope(null);
    setUrgency(null);
    setKind("need");
    setCategory("other");
    setTimeSlot("today");
    setStep("write");
    setVoiceMessage("");
    setPublishError(false);
    setComposerOpen(true);
  }

  function closeComposer() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setRecording(false);
    setComposerOpen(false);
  }

  function startVoiceInput() {
    const SpeechRecognition = getSpeechConstructor();
    if (!SpeechRecognition) {
      setVoiceMessage(t("flash.voice.unsupported"));
      return;
    }

    recognitionRef.current?.stop();
    const recognition = new SpeechRecognition();
    recognition.lang = locale === "fr" ? "fr-FR" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? "")
        .filter(Boolean)
        .join(" ");
      if (transcript) {
        setText((current) => (current.trim() ? `${current.trim()} ${transcript}` : transcript));
        setVoiceMessage(t("flash.voice.received"));
      }
    };
    recognition.onerror = (event) => {
      setVoiceMessage(
        event.error === "not-allowed" ? t("flash.voice.permission") : t("flash.voice.error"),
      );
    };
    recognition.onend = () => {
      setRecording(false);
      recognitionRef.current = null;
    };
    recognitionRef.current = recognition;
    setVoiceMessage(t("flash.voice.listening"));
    setRecording(true);
    try {
      recognition.start();
    } catch {
      setRecording(false);
      recognitionRef.current = null;
      setVoiceMessage(t("flash.voice.error"));
    }
  }

  function continueToReview() {
    if (!parsedIntent || !text.trim()) return;
    setKind(parsedIntent.kind);
    setCategory(parsedIntent.category);
    setTimeSlot(parsedIntent.timeSlot);
    setStep("review");
  }

  async function publishFlash() {
    if (
      !user ||
      !text.trim() ||
      !scope ||
      !urgency ||
      !FLASH_SCOPE_FILTERING_ENABLED ||
      publishing
    ) {
      return;
    }
    setPublishing(true);
    setPublishError(false);
    try {
      const body = text.trim();
      await createFlash({
        authorId: user.id as UserId,
        title: body.length > 80 ? `${body.slice(0, 77)}…` : body,
        body,
        kind,
        category,
        timeSlot,
        scope,
        urgency,
        expiresAt: expiryFor(timeSlot),
      });
      closeComposer();
      setSuccess(true);
      setTab("discover");
    } catch {
      setPublishError(true);
    } finally {
      setPublishing(false);
    }
  }

  return (
    <section
      className="min-h-[calc(100dvh-5rem)] px-4 pb-8 pt-5 sm:px-6"
      aria-label={t("flash.screen.label")}
    >
      <header className="mb-6 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
            <Zap className="size-6" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Vitalis</p>
            <h1 className="text-xl font-bold tracking-tight">{t("page.flash.title")}</h1>
          </div>
        </div>
        <Link
          to="/"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-border bg-card text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={t("flash.home")}
          title={t("flash.home")}
        >
          <ArrowRight className="size-5 rotate-180" aria-hidden="true" />
        </Link>
      </header>
      <div className="mb-7 overflow-hidden rounded-[1.75rem] border border-primary/15 bg-gradient-to-br from-primary/12 via-card to-card p-5 shadow-sm sm:p-7">
        <div className="mx-auto flex max-w-sm flex-col items-center text-center">
          <span className="mb-3 grid size-[4.25rem] place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Zap className="size-8" fill="currentColor" aria-hidden="true" />
          </span>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {t("flash.hero.eyebrow")}
          </p>
          <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            {t("flash.hero.title")}
          </h2>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {t("flash.hero.description")}
          </p>
          <Button
            type="button"
            size="lg"
            className="mt-5 min-h-12 w-full max-w-xs rounded-full text-base shadow-md shadow-primary/15"
            onClick={openComposer}
          >
            <Plus className="mr-2 size-5" aria-hidden="true" />
            {t("flash.hero.action")}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">{t("flash.hero.voiceHint")}</p>
        </div>
      </div>
      {success ? (
        <div
          className="mb-5 flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary/8 px-4 py-3 text-sm"
          role="status"
        >
          <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />
          <span>{t("flash.composer.published")}</span>
          <button
            type="button"
            className="ml-auto rounded-full p-1 text-muted-foreground hover:text-foreground"
            onClick={() => setSuccess(false)}
            aria-label={t("common.close")}
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}
      <div
        className="mb-4 flex items-center gap-2 rounded-full bg-muted/70 p-1"
        role="tablist"
        aria-label={t("flash.tabs.label")}
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "discover"}
          className={`min-h-11 flex-1 rounded-full px-4 text-sm font-semibold transition ${tab === "discover" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          onClick={() => setTab("discover")}
        >
          {t("flash.tabs.discover")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "mine"}
          className={`min-h-11 flex-1 rounded-full px-4 text-sm font-semibold transition ${tab === "mine" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          onClick={() => setTab("mine")}
        >
          {t("flash.tabs.mine")}
        </button>
      </div>
      <div role="tabpanel" className="min-w-0">
        {tab === "discover" ? (
          <div className="stack-3">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">{t("flash.discover.title")}</h2>
                <p className="text-sm text-muted-foreground">{t("flash.discover.description")}</p>
              </div>
              <Sparkles className="size-5 shrink-0 text-primary" aria-hidden="true" />
            </div>
            <FlashFeed />
          </div>
        ) : (
          <div className="stack-3">
            <div className="mb-3">
              <h2 className="text-lg font-bold">{t("flash.mine.title")}</h2>
              <p className="text-sm text-muted-foreground">{t("flash.mine.desc")}</p>
            </div>
            <MyFlashManagement />
          </div>
        )}
      </div>
      <Dialog
        open={composerOpen}
        onOpenChange={(open) => {
          if (!open && !publishing) closeComposer();
        }}
      >
        <DialogContent className="fixed bottom-0 left-0 top-auto max-h-[92dvh] w-full max-w-lg translate-x-0 translate-y-0 overflow-y-auto rounded-t-[1.75rem] border-border bg-background p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl sm:left-[50%] sm:top-[50%] sm:bottom-auto sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-[1.75rem] sm:p-6">
          <DialogHeader className="mb-5 pr-10 text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {step === "write" ? t("flash.composer.step1") : t("flash.composer.step2")}
            </p>
            <DialogTitle className="mt-1 text-xl font-bold">
              {step === "write" ? t("flash.composer.title") : t("flash.composer.reviewTitle")}
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-muted-foreground">
              {step === "write"
                ? t("flash.composer.description")
                : t("flash.composer.reviewDescription")}
            </DialogDescription>
          </DialogHeader>

          {step === "write" ? (
            <>
              <Textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
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
                  onClick={recording ? () => recognitionRef.current?.stop() : startVoiceInput}
                  disabled={!speechSupported && !recording}
                >
                  {recording ? <MicOff className="mr-2 size-4" /> : <Mic className="mr-2 size-4" />}
                  {recording ? t("flash.voice.stop") : t("flash.voice.action")}
                </Button>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {text.length}/600
                </span>
              </div>
              {voiceMessage ? (
                <p className="mt-2 text-xs text-muted-foreground" role="status">
                  {voiceMessage}
                </p>
              ) : !speechSupported ? (
                <p className="mt-2 text-xs text-muted-foreground">{t("flash.voice.unsupported")}</p>
              ) : null}
              {parsedIntent ? (
                <div
                  className="mt-4 rounded-2xl border border-primary/15 bg-primary/5 p-4"
                  aria-live="polite"
                >
                  <p className="mb-2 text-sm font-semibold">{t("flash.composer.understood")}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-card px-3 py-1.5 text-xs font-medium">
                      {t(`flash.kind.${parsedIntent.kind}`)}
                    </span>
                    <span className="rounded-full bg-card px-3 py-1.5 text-xs font-medium">
                      {t(`flash.category.${parsedIntent.category}`)}
                    </span>
                    <span className="rounded-full bg-card px-3 py-1.5 text-xs font-medium">
                      {t(`flash.slot.${parsedIntent.timeSlot}`)}
                    </span>
                  </div>
                </div>
              ) : null}
              <Button
                type="button"
                className="mt-5 min-h-12 w-full rounded-full"
                disabled={!parsedIntent || !text.trim()}
                onClick={continueToReview}
              >
                {t("common.continue")}
                <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </Button>
            </>
          ) : (
            <>
              <div className="rounded-2xl bg-muted/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("flash.composer.yourMessage")}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{text}</p>
                <button
                  type="button"
                  className="mt-3 text-sm font-semibold text-primary"
                  onClick={() => setStep("write")}
                >
                  {t("flash.composer.editMessage")}
                </button>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-medium">
                  {t("flash.composer.kind")}
                  <select
                    value={kind}
                    onChange={(event) => setKind(event.target.value as FlashKind)}
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
                    value={category}
                    onChange={(event) => setCategory(event.target.value as FlashCategory)}
                    className="min-h-11 rounded-xl border border-input bg-background px-3"
                  >
                    {CATEGORIES.map((value) => (
                      <option key={value} value={value}>
                        {t(`flash.category.${value}`)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  {t("flash.composer.when")}
                  <select
                    value={timeSlot}
                    onChange={(event) => setTimeSlot(event.target.value as FlashTimeSlot)}
                    className="min-h-11 rounded-xl border border-input bg-background px-3"
                  >
                    {TIME_SLOTS.map((value) => (
                      <option key={value} value={value}>
                        {t(`flash.slot.${value}`)}
                      </option>
                    ))}
                  </select>
                </label>
                <fieldset className="grid gap-2 sm:col-span-2">
                  <legend className="text-sm font-semibold">{t("flash.composer.scope")}</legend>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {t("flash.composer.scopeHint")}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {FLASH_SCOPES.map((value) => (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={scope === value}
                        onClick={() => setScope(value)}
                        className={`min-h-12 rounded-xl border px-3 py-2 text-left text-sm font-medium transition ${scope === value ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/30" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}
                      >
                        {t(`flash.scope.${value}`)}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <fieldset className="grid gap-2 sm:col-span-2">
                  <legend className="text-sm font-semibold">{t("flash.composer.urgency")}</legend>
                  <div className="flex flex-wrap gap-2">
                    {FLASH_URGENCIES.map((value) => (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={urgency === value}
                        onClick={() => setUrgency(value)}
                        className={`min-h-10 rounded-full border px-3 py-2 text-sm font-medium transition ${urgency === value ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/30" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}
                      >
                        {t(`flash.urgency.${value}`)}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-xl border border-border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
                <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <p>{t("flash.composer.pendingScopeUrgency")}</p>
              </div>

              {!user && !authLoading ? (
                <div className="mt-4 rounded-xl border border-border p-3">
                  <p className="text-sm text-muted-foreground">{t("flash.composer.signIn")}</p>
                  <Button asChild className="mt-3 w-full rounded-full">
                    <Link to="/auth">{t("auth.signIn")}</Link>
                  </Button>
                </div>
              ) : null}
              {publishError ? (
                <p className="mt-3 text-sm text-destructive" role="alert">
                  {t("flash.composer.error")}
                </p>
              ) : null}
              <div className="mt-5 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-12 flex-1 rounded-full"
                  onClick={() => setStep("write")}
                  disabled={publishing}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="button"
                  className="min-h-12 flex-[1.5] rounded-full"
                  onClick={() => void publishFlash()}
                  disabled={
                    !FLASH_SCOPE_FILTERING_ENABLED ||
                    !user ||
                    authLoading ||
                    publishing ||
                    !text.trim() ||
                    !scope ||
                    !urgency
                  }
                >
                  {publishing ? t("app.loading") : t("flash.composer.confirmPublish")}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
