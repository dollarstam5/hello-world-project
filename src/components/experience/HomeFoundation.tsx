import { Link } from "@tanstack/react-router";
import { Compass, Radar, RadioTower, ScanLine, Zap, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Surface } from "@/components/app/Surface";
import { Indicator } from "@/components/app/Indicator";
import { useI18n } from "@/lib/i18n/useI18n";
import { useIdentity } from "@/lib/experience/identity";

type EngineCardProps = {
  to: "/flash" | "/scan" | "/reel" | "/radar";
  icon: LucideIcon;
  title: string;
  description: string;
  action: string;
  tone: "warm" | "info" | "primary" | "violet";
};

const toneClasses = {
  warm: "bg-warm-soft text-warm",
  info: "bg-info/10 text-info",
  primary: "bg-primary-soft text-primary",
  violet: "bg-intelligence-soft text-intelligence",
} as const;

function EngineCard({ to, icon: Icon, title, description, action, tone }: EngineCardProps) {
  return (
    <Link
      to={to}
      className="group block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Surface
        variant="elevated"
        padding="md"
        bordered
        interactive
        className="flex h-full min-h-40 flex-col justify-between gap-5 transition-colors group-hover:border-border-strong"
      >
        <div className="flex items-start justify-between gap-3">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneClasses[tone]}`}
          >
            <Icon className="h-6 w-6" aria-hidden />
          </span>
          <ArrowUpRight
            className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden
          />
        </div>
        <div className="stack-2">
          <h3 className="text-title-sm">{title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
          <span className="pt-1 text-xs font-semibold text-primary">{action}</span>
        </div>
      </Surface>
    </Link>
  );
}

/** Home is the calm entry point; engines keep their own dedicated spaces. */
export function HomeFoundation() {
  const { t } = useI18n();
  const tier = useIdentity((s) => s.tier);

  const identityLabel =
    tier === "trusted"
      ? t("identity.trusted")
      : tier === "identified"
        ? t("identity.identified")
        : t("identity.guest");

  return (
    <div className="page-shell stack-8">
      <header className="stack-3 motion-rise-in">
        <Indicator tone="primary" label={identityLabel} dot />
        <div className="stack-2">
          <h1 className="text-fluid-display-sm">{t("home.welcome")}</h1>
          <p className="text-subtitle max-w-prose">{t("home.subtitle")}</p>
        </div>
      </header>

      <section className="stack-4" aria-labelledby="home-engines-title">
        <div className="stack-1">
          <h2 id="home-engines-title" className="text-title-md">
            {t("home.engines.title")}
          </h2>
          <p className="text-sm text-muted-foreground">{t("home.engines.desc")}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <EngineCard
            to="/flash"
            icon={Zap}
            title={t("home.engine.flash.title")}
            description={t("home.engine.flash.desc")}
            action={t("home.engine.action")}
            tone="warm"
          />
          <EngineCard
            to="/scan"
            icon={ScanLine}
            title={t("home.engine.scan.title")}
            description={t("home.engine.scan.desc")}
            action={t("home.engine.action")}
            tone="info"
          />
          <EngineCard
            to="/reel"
            icon={RadioTower}
            title={t("home.engine.reel.title")}
            description={t("home.engine.reel.desc")}
            action={t("home.engine.action")}
            tone="primary"
          />
          <EngineCard
            to="/radar"
            icon={Radar}
            title={t("home.engine.radar.title")}
            description={t("home.engine.radar.desc")}
            action={t("home.engine.action")}
            tone="violet"
          />
        </div>
      </section>

      <Surface variant="sunken" padding="md" bordered className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-muted-foreground">
          <Compass className="h-5 w-5" aria-hidden />
        </span>
        <p className="text-sm leading-relaxed text-muted-foreground">{t("home.menuHint")}</p>
      </Surface>
    </div>
  );
}
