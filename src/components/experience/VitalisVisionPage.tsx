import { Link } from "@tanstack/react-router";
import { ArrowLeft, Compass, Radar, RadioTower, ScanLine, ShieldCheck, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n/useI18n";
import { Surface } from "@/components/app/Surface";

const engines = [
  { key: "flash", icon: Zap, tone: "text-warm", title: "vision.engine.flash.title", role: "vision.engine.flash.role", action: "vision.engine.flash.action", steps: "vision.engine.flash.steps", boundary: "vision.engine.flash.boundary" },
  { key: "scan", icon: ScanLine, tone: "text-info", title: "vision.engine.scan.title", role: "vision.engine.scan.role", action: "vision.engine.scan.action", steps: "vision.engine.scan.steps", boundary: "vision.engine.scan.boundary" },
  { key: "reel", icon: RadioTower, tone: "text-primary", title: "vision.engine.reel.title", role: "vision.engine.reel.role", action: "vision.engine.reel.action", steps: "vision.engine.reel.steps", boundary: "vision.engine.reel.boundary" },
  { key: "radar", icon: Radar, tone: "text-intelligence", title: "vision.engine.radar.title", role: "vision.engine.radar.role", action: "vision.engine.radar.action", steps: "vision.engine.radar.steps", boundary: "vision.engine.radar.boundary" },
] as const;

const principles = [
  { icon: ShieldCheck, title: "vision.principle.trust.title", body: "vision.principle.trust.body" },
  { icon: Compass, title: "vision.principle.action.title", body: "vision.principle.action.body" },
] as const;

export function VitalisVisionPage() {
  const { t } = useI18n();

  return (
    <main className="page-shell stack-8">
      <header className="stack-3">
        <Link
          to="/"
          className="inline-flex min-h-10 w-fit items-center gap-2 rounded-full px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t("vision.back")}
        </Link>
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-primary/12 text-primary">
            <Compass className="size-6" aria-hidden="true" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {t("vision.eyebrow")}
          </p>
        </div>
        <h1 className="max-w-3xl text-fluid-display-sm">{t("vision.title")}</h1>
        <p className="max-w-3xl text-subtitle">{t("vision.intro")}</p>
      </header>

      <section className="stack-3">
        <h2 className="text-title-md">{t("vision.what.title")}</h2>
        <Surface variant="elevated" bordered padding="lg" className="stack-3">
          <p className="leading-relaxed">{t("vision.what.body")}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{t("vision.what.not")}</p>
        </Surface>
      </section>

      <section className="stack-3">
        <h2 className="text-title-md">{t("vision.engines.title")}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{t("vision.engines.intro")}</p>
        <div className="grid grid-cols-1 gap-3">
          {engines.map((engine, index) => {
            const Icon = engine.icon;
            return (
              <Surface
                key={engine.key}
                variant="elevated"
                bordered
                padding="lg"
                className="stack-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`grid size-11 place-items-center rounded-2xl bg-muted ${engine.tone}`}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("vision.engine.label")} {index + 1}
                    </p>
                    <h3 className="text-lg font-bold">{t(engine.title)}</h3>
                  </div>
                </div>
                <p className="text-sm leading-relaxed">{t(engine.role)}</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-muted/60 p-3">
                    <h4 className="text-sm font-semibold">{t("vision.engine.actionTitle")}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {t(engine.action)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted/60 p-3">
                    <h4 className="text-sm font-semibold">{t("vision.engine.stepsTitle")}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {t(engine.steps)}
                    </p>
                  </div>
                </div>
                <p className="border-l-2 border-primary/40 pl-3 text-sm leading-relaxed text-muted-foreground">
                  {t(engine.boundary)}
                </p>
              </Surface>
            );
          })}
        </div>
      </section>

      <section className="stack-3">
        <h2 className="text-title-md">{t("vision.principles.title")}</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {principles.map((principle) => {
            const Icon = principle.icon;
            return (
              <Surface
                key={principle.title}
                variant="sunken"
                bordered
                padding="md"
                className="stack-2"
              >
                <Icon className="size-5 text-primary" aria-hidden="true" />
                <h3 className="font-semibold">{t(principle.title)}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{t(principle.body)}</p>
              </Surface>
            );
          })}
        </div>
      </section>

      <section className="stack-3">
        <h2 className="text-title-md">{t("vision.honesty.title")}</h2>
        <Surface variant="elevated" bordered padding="lg" className="stack-2">
          <p className="text-sm leading-relaxed">{t("vision.honesty.body")}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t("vision.honesty.privacy")}
          </p>
        </Surface>
      </section>

      <Surface variant="sunken" bordered padding="lg" className="stack-2 text-center">
        <h2 className="text-lg font-bold">{t("vision.end.title")}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{t("vision.end.body")}</p>
        <Link
          to="/"
          className="mx-auto mt-2 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {t("vision.end.action")}
        </Link>
      </Surface>
    </main>
  );
}
