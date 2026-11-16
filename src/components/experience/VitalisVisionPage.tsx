import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  Compass,
  Eye,
  MapPin,
  Radar,
  RadioTower,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/useI18n";

const engines = [
  { id: "flash", icon: Zap, tone: "amber", route: "/flash", number: "01" },
  { id: "scan", icon: ScanLine, tone: "sky", route: "/scan", number: "02" },
  { id: "reel", icon: RadioTower, tone: "blue", route: "/reel", number: "03" },
  { id: "radar", icon: Radar, tone: "violet", route: "/radar", number: "04" },
] as const;

function EngineArtwork({ kind }: { kind: (typeof engines)[number]["id"] }) {
  if (kind === "flash") {
    return (
      <div className="relative mx-auto flex min-h-64 w-full max-w-md items-center justify-center overflow-hidden rounded-[2rem] bg-amber-400/10 p-6">
        <div className="absolute -right-10 -top-12 size-48 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 size-48 rounded-full bg-orange-300/20 blur-3xl" />
        <div className="relative w-full max-w-xs rotate-[-3deg] rounded-3xl border border-border/70 bg-card p-5 shadow-2xl shadow-amber-950/10">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">FLASH · EXEMPLE</span>
            <Zap className="size-5 text-amber-500" />
          </div>
          <p className="mt-5 text-lg font-bold">Un coup de main ?</p>
          <p className="mt-1 text-sm text-muted-foreground">Déménagement aujourd’hui, vers 16 h</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-muted px-3 py-1 text-xs">Aujourd’hui</span>
            <span className="rounded-full bg-muted px-3 py-1 text-xs">À proximité</span>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
            <span>Publication courte</span><ArrowRight className="size-4" />
          </div>
        </div>
        <span className="absolute bottom-7 right-7 grid size-12 place-items-center rounded-2xl border border-amber-400/30 bg-card shadow-lg"><Sparkles className="size-5 text-amber-500" /></span>
      </div>
    );
  }

  if (kind === "scan") {
    return (
      <div className="relative mx-auto flex min-h-64 w-full max-w-md items-center justify-center overflow-hidden rounded-[2rem] bg-sky-500/10 p-6">
        <div className="relative grid aspect-square w-56 place-items-center rounded-full border border-sky-500/25">
          <div className="absolute inset-5 rounded-full border border-sky-500/25" />
          <div className="absolute inset-10 rounded-full border border-sky-500/25" />
          <div className="absolute h-px w-full rotate-[-35deg] bg-gradient-to-r from-transparent via-sky-500/70 to-transparent" />
          <div className="absolute h-full w-px bg-sky-500/15" />
          <div className="grid size-16 place-items-center rounded-2xl bg-sky-500 text-white shadow-xl shadow-sky-500/25"><ScanLine className="size-8" /></div>
          <span className="absolute left-7 top-10 grid size-9 place-items-center rounded-xl border border-sky-500/20 bg-card shadow-lg"><MapPin className="size-4 text-sky-500" /></span>
          <span className="absolute bottom-8 right-5 grid size-9 place-items-center rounded-xl border border-sky-500/20 bg-card shadow-lg"><Target className="size-4 text-sky-500" /></span>
          <span className="absolute -right-5 top-1/2 rounded-full border border-sky-500/20 bg-card px-3 py-1.5 text-xs font-semibold shadow-lg">Recherche ponctuelle</span>
        </div>
      </div>
    );
  }

  if (kind === "reel") {
    return (
      <div className="relative mx-auto flex min-h-64 w-full max-w-md items-center justify-center overflow-hidden rounded-[2rem] bg-blue-500/10 p-6">
        <div className="absolute size-56 rounded-full border border-blue-500/15" />
        <div className="absolute size-40 rounded-full border border-blue-500/20" />
        <div className="absolute size-24 rounded-full border border-blue-500/25" />
        <div className="relative z-10 grid size-20 place-items-center rounded-full border-4 border-card bg-blue-600 text-white shadow-xl shadow-blue-600/25"><Users className="size-8" /></div>
        <span className="absolute left-[17%] top-[24%] grid size-11 place-items-center rounded-2xl border border-blue-500/20 bg-card shadow-lg"><Eye className="size-5 text-blue-500" /></span>
        <span className="absolute right-[15%] top-[30%] grid size-11 place-items-center rounded-2xl border border-blue-500/20 bg-card shadow-lg"><MapPin className="size-5 text-blue-500" /></span>
        <span className="absolute bottom-[18%] left-[28%] grid size-11 place-items-center rounded-2xl border border-blue-500/20 bg-card shadow-lg"><Bell className="size-5 text-blue-500" /></span>
        <span className="absolute bottom-5 right-5 rounded-full border border-blue-500/20 bg-card px-3 py-1.5 text-xs font-semibold shadow-lg">Présence volontaire</span>
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex min-h-64 w-full max-w-md items-center justify-center overflow-hidden rounded-[2rem] bg-violet-500/10 p-6">
      <div className="absolute left-10 top-10 h-40 w-px bg-gradient-to-b from-violet-500/0 via-violet-500/40 to-violet-500/0" />
      <div className="relative w-full max-w-xs space-y-3">
        <div className="flex items-center gap-3 rounded-2xl border border-violet-500/20 bg-card p-4 shadow-lg">
          <span className="grid size-10 place-items-center rounded-xl bg-violet-500/10 text-violet-500"><Target className="size-5" /></span>
          <span className="min-w-0 flex-1"><span className="block text-sm font-bold">Recherche suivie</span><span className="text-xs text-muted-foreground">Critères enregistrés</span></span>
          <Check className="size-4 text-violet-500" />
        </div>
        <div className="ml-7 h-5 border-l-2 border-dashed border-violet-500/40" />
        <div className="ml-7 flex items-center gap-3 rounded-2xl border border-violet-500/20 bg-card p-4 shadow-lg">
          <span className="grid size-10 place-items-center rounded-xl bg-violet-500/10 text-violet-500"><Bell className="size-5" /></span>
          <span><span className="block text-sm font-bold">Nouvelle possibilité</span><span className="text-xs text-muted-foreground">Si une source la signale</span></span>
        </div>
        <div className="ml-14 h-5 border-l-2 border-dashed border-violet-500/40" />
        <div className="ml-14 rounded-xl border border-dashed border-violet-500/30 px-4 py-2 text-center text-xs text-muted-foreground">Suivre · Ajuster · Arrêter</div>
      </div>
    </div>
  );
}

export function VitalisVisionPage() {
  const { t } = useI18n();

  return (
    <main className="page-shell space-y-16 pb-12 sm:space-y-24">
      <header className="relative isolate overflow-hidden rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/15 via-card to-card px-6 py-10 sm:px-10 sm:py-14">
        <div aria-hidden="true" className="absolute -right-16 -top-24 size-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative max-w-3xl">
          <Link to="/" className="mb-8 inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <ArrowLeft className="size-4" aria-hidden="true" />{t("vision.back")}
          </Link>
          <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary"><Compass className="size-4" />{t("vision.eyebrow")}</div>
          <h1 className="max-w-3xl text-fluid-display-lg font-semibold tracking-tight">{t("vision.title")}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{t("vision.intro")}</p>
          <a href="#les-moteurs" className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5">
            Découvrir les quatre moteurs <ArrowDown className="size-4" />
          </a>
        </div>
      </header>

      <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch">
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{t("vision.what.title")}</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Une application tournée vers la vie réelle.</h2>
        </div>
        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
          <p className="text-base leading-relaxed">{t("vision.what.body")}</p>
          <p className="mt-4 border-l-2 border-primary/40 pl-4 text-sm leading-relaxed text-muted-foreground">{t("vision.what.not")}</p>
        </div>
      </section>

      <section id="les-moteurs" className="space-y-5">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{t("vision.engines.title")}</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Quatre façons d’agir, un même objectif.</h2>
          <p className="text-base leading-relaxed text-muted-foreground">{t("vision.engines.intro")}</p>
        </div>
        <nav aria-label="Accès direct aux moteurs" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {engines.map((engine) => (
            <a key={engine.id} href={`#${engine.id}`} className="flex min-h-12 items-center gap-2 rounded-2xl border border-border/70 bg-card px-3 py-2 text-sm font-semibold transition hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span className="text-xs text-muted-foreground">{engine.number}</span>{t(`vision.engine.${engine.id}.title`)}
            </a>
          ))}
        </nav>
      </section>

      {engines.map((engine, index) => {
        const Icon = engine.icon;
        return (
          <section key={engine.id} id={engine.id} className="scroll-mt-8 space-y-8 border-t border-border/70 pt-10 sm:pt-14">
            <div className={`grid gap-7 lg:grid-cols-2 lg:items-center ${index % 2 ? "lg:[&>div:first-child]:order-2" : ""}`}>
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold tabular-nums text-muted-foreground">{engine.number}</span>
                  <span className="h-px w-10 bg-border" />
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{t("vision.engine.label")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon className="size-6" /></span>
                  <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t(`vision.engine.${engine.id}.title`)}</h2>
                </div>
                <p className="text-lg leading-relaxed text-foreground/90">{t(`vision.deep.${engine.id}.why`)}</p>
                <Link to={engine.route} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/15">
                  Ouvrir {engine.id === "reel" ? "En direct" : t(`vision.engine.${engine.id}.title`)} <ArrowRight className="size-4" />
                </Link>
              </div>
              <EngineArtwork kind={engine.id} />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <article className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6">
                <div className="mb-3 flex items-center gap-2 text-primary"><Target className="size-4" /><h3 className="text-sm font-bold">{t("vision.engine.actionTitle")}</h3></div>
                <p className="text-sm leading-relaxed text-muted-foreground">{t(`vision.deep.${engine.id}.use`)}</p>
              </article>
              <article className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6">
                <div className="mb-3 flex items-center gap-2 text-primary"><Check className="size-4" /><h3 className="text-sm font-bold">{t("vision.engine.stepsTitle")}</h3></div>
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{t(`vision.deep.${engine.id}.flow`)}</p>
              </article>
              <article className="rounded-3xl border border-border/70 bg-muted/50 p-5 sm:p-6">
                <div className="mb-3 flex items-center gap-2 text-primary"><Sparkles className="size-4" /><h3 className="text-sm font-bold">Dans la vie réelle</h3></div>
                <p className="text-sm leading-relaxed text-muted-foreground">{t(`vision.deep.${engine.id}.example`)}</p>
              </article>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/70 p-5">
                <h3 className="font-semibold">Ce qui rend ce moteur unique</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`vision.deep.${engine.id}.difference`)}</p>
              </div>
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <h3 className="font-semibold">À retenir</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`vision.engine.${engine.id}.boundary`)}</p>
              </div>
            </div>
          </section>
        );
      })}

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
          <div className="mb-4 grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary"><ShieldCheck className="size-5" /></div>
          <h2 className="text-xl font-semibold">{t("vision.deep.privacy.title")}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("vision.deep.privacy.body")}</p>
        </article>
        <article className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
          <div className="mb-4 grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary"><Compass className="size-5" /></div>
          <h2 className="text-xl font-semibold">{t("vision.deep.status.title")}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("vision.deep.status.body")}</p>
        </article>
      </section>

      <footer className="rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/12 via-card to-card px-6 py-9 text-center sm:px-10">
        <h2 className="text-2xl font-semibold tracking-tight">{t("vision.end.title")}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{t("vision.end.body")}</p>
        <Link to="/" className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5">
          {t("vision.end.action")} <ArrowRight className="size-4" />
        </Link>
      </footer>
    </main>
  );
}
