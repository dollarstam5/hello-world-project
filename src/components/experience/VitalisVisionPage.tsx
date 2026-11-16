import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  Compass,
  Radar,
  RadioTower,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { useVisionI18n } from "@/lib/i18n/useVisionI18n";
import { VisionEngineArtwork } from "@/components/experience/VisionEngineArtwork";

const engines = [
  { id: "flash", icon: Zap, route: "/flash", number: "01" },
  { id: "scan", icon: ScanLine, route: "/scan", number: "02" },
  { id: "reel", icon: RadioTower, route: "/reel", number: "03" },
  { id: "radar", icon: Radar, route: "/radar", number: "04" },
] as const;

export function VitalisVisionPage() {
  const { t } = useVisionI18n();

  return (
    <main className="page-shell space-y-16 pb-12 sm:space-y-24">
      <header className="relative isolate overflow-hidden rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/15 via-card to-card px-6 py-10 sm:px-10 sm:py-14">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-24 size-72 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative max-w-3xl">
          <Link
            to="/"
            className="mb-8 inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t("vision.back")}
          </Link>
          <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <Compass className="size-4" />
            {t("vision.eyebrow")}
          </div>
          <h1 className="max-w-3xl text-fluid-display-lg font-semibold tracking-tight">
            {t("vision.title")}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("vision.intro")}
          </p>
          <a
            href="#les-moteurs"
            className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5"
          >
            {t("vision.deep.discover")}
            <ArrowDown className="size-4" />
          </a>
        </div>
      </header>

      <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch">
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            {t("vision.what.title")}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("vision.deep.whatHeading")}
          </h2>
        </div>
        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
          <p className="text-base leading-relaxed">{t("vision.what.body")}</p>
          <p className="mt-4 border-l-2 border-primary/40 pl-4 text-sm leading-relaxed text-muted-foreground">
            {t("vision.what.not")}
          </p>
        </div>
      </section>

      <section id="les-moteurs" className="space-y-5">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            {t("vision.engines.title")}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("vision.deep.enginesHeading")}
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            {t("vision.engines.intro")}
          </p>
        </div>
        <nav
          aria-label={t("vision.deep.navLabel")}
          className="grid grid-cols-2 gap-2 sm:grid-cols-4"
        >
          {engines.map((engine) => (
            <a
              key={engine.id}
              href={`#${engine.id}`}
              className="flex min-h-12 items-center gap-2 rounded-2xl border border-border/70 bg-card px-3 py-2 text-sm font-semibold transition hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="text-xs text-muted-foreground">{engine.number}</span>
              {t(`vision.engine.${engine.id}.title`)}
            </a>
          ))}
        </nav>
      </section>

      {engines.map((engine, index) => {
        const Icon = engine.icon;
        return (
          <section
            key={engine.id}
            id={engine.id}
            className="scroll-mt-8 space-y-8 border-t border-border/70 pt-10 sm:pt-14"
          >
            <div
              className={`grid gap-7 lg:grid-cols-2 lg:items-center ${index % 2 ? "lg:[&>div:first-child]:order-2" : ""}`}
            >
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold tabular-nums text-muted-foreground">
                    {engine.number}
                  </span>
                  <span className="h-px w-10 bg-border" />
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                    {t("vision.engine.label")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-6" />
                  </span>
                  <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {t(`vision.engine.${engine.id}.title`)}
                  </h2>
                </div>
                <p className="text-lg leading-relaxed text-foreground/90">
                  {t(`vision.deep.${engine.id}.why`)}
                </p>
                <Link
                  to={engine.route}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/15"
                >
                  {t("vision.deep.open")} {t(`vision.engine.${engine.id}.title`)}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
              <VisionEngineArtwork
                kind={engine.id}
                labels={{
                  flashTag: t("vision.deep.visual.flashTag"),
                  flashTitle: t("vision.deep.visual.flashTitle"),
                  flashDescription: t("vision.deep.visual.flashDescription"),
                  today: t("vision.deep.visual.today"),
                  nearby: t("vision.deep.visual.nearby"),
                  flashFooter: t("vision.deep.visual.flashFooter"),
                  scan: t("vision.deep.visual.scan"),
                  live: t("vision.deep.visual.live"),
                  radarSearch: t("vision.deep.visual.radarSearch"),
                  radarCriteria: t("vision.deep.visual.radarCriteria"),
                  radarNew: t("vision.deep.visual.radarNew"),
                  radarSource: t("vision.deep.visual.radarSource"),
                  radarActions: t("vision.deep.visual.radarActions"),
                }}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <article className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6">
                <div className="mb-3 flex items-center gap-2 text-primary">
                  <Target className="size-4" />
                  <h3 className="text-sm font-bold">{t("vision.engine.actionTitle")}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`vision.deep.${engine.id}.use`)}
                </p>
              </article>
              <article className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6">
                <div className="mb-3 flex items-center gap-2 text-primary">
                  <Check className="size-4" />
                  <h3 className="text-sm font-bold">{t("vision.engine.stepsTitle")}</h3>
                </div>
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {t(`vision.deep.${engine.id}.flow`)}
                </p>
              </article>
              <article className="rounded-3xl border border-border/70 bg-muted/50 p-5 sm:p-6">
                <div className="mb-3 flex items-center gap-2 text-primary">
                  <Sparkles className="size-4" />
                  <h3 className="text-sm font-bold">{t("vision.deep.realLife")}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`vision.deep.${engine.id}.example`)}
                </p>
              </article>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/70 p-5">
                <h3 className="font-semibold">{t("vision.deep.unique")}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`vision.deep.${engine.id}.difference`)}
                </p>
              </div>
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <h3 className="font-semibold">{t("vision.deep.remember")}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`vision.engine.${engine.id}.boundary`)}
                </p>
              </div>
            </div>
          </section>
        );
      })}

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
          <div className="mb-4 grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="size-5" />
          </div>
          <h2 className="text-xl font-semibold">{t("vision.deep.privacy.title")}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t("vision.deep.privacy.body")}
          </p>
        </article>
        <article className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
          <div className="mb-4 grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Compass className="size-5" />
          </div>
          <h2 className="text-xl font-semibold">{t("vision.deep.status.title")}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t("vision.deep.status.body")}
          </p>
        </article>
      </section>

      <footer className="rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/12 via-card to-card px-6 py-9 text-center sm:px-10">
        <h2 className="text-2xl font-semibold tracking-tight">{t("vision.end.title")}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {t("vision.end.body")}
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5"
        >
          {t("vision.end.action")}
          <ArrowRight className="size-4" />
        </Link>
      </footer>
    </main>
  );
}
