import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Plus, Sparkles, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/domains/auth";
import { formatCommunicationMessage } from "@/lib/communication/format";
import { useI18n } from "@/lib/i18n/useI18n";
import { FlashFeed } from "./FlashFeed";
import { FlashComposerDialog } from "./FlashComposerDialog";
import { MyFlashManagement } from "./MyFlashManagement";
import { useFlashComposer } from "./useFlashComposer";

type FlashTab = "discover" | "mine";

export function FlashExperienceScreen() {
  const { t, locale } = useI18n();
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<FlashTab>("discover");
  const [success, setSuccess] = useState(false);
  const composer = useFlashComposer({
    user,
    locale,
    t,
    onSaved: () => {
      setSuccess(true);
      setTab("mine");
    },
  });

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
            onClick={composer.openComposer}
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
          <span>{formatCommunicationMessage(t, "flash.composer.draftSaved")}</span>
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
            <MyFlashManagement onCreateFlash={composer.openComposer} />
          </div>
        )}
      </div>

      <FlashComposerDialog state={composer} user={user} authLoading={authLoading} />
    </section>
  );
}
