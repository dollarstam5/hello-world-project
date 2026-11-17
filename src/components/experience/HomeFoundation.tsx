import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Radar, RadioTower, ScanLine, Zap, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Surface } from "@/components/app/Surface";
import { PublicProfilePreview } from "@/components/app/PublicProfilePreview";
import { Indicator } from "@/components/app/Indicator";
import { useI18n } from "@/lib/i18n/useI18n";
import { useIdentity } from "@/lib/experience/identity";
import { useAuth } from "@/domains/auth/model/useAuth";
import {
  claimNameGreetingForSession,
  getHomeGreetingKey,
} from "@/lib/communication/greeting";
import { createDemoFlashes } from "@/domains/flash/model/demo-flashes";
import { VitalisVisionCard } from "@/components/experience/VitalisVisionCard";
import heroPhoto from "@/assets/images/experience/home-neighbours-1600.webp";
import heroPhotoSmall from "@/assets/images/experience/home-neighbours-800.webp";

type EngineCardProps = {
  to: "/flash" | "/scan" | "/reel" | "/radar";
  icon: LucideIcon;
  title: string;
  description: string;
  example: string;
  exampleLabel: string;
  action: string;
  tone: "warm" | "info" | "primary" | "violet";
};

const toneClasses = {
  warm: "bg-warm-soft text-warm",
  info: "bg-info/10 text-info",
  primary: "bg-primary-soft text-primary",
  violet: "bg-intelligence-soft text-intelligence",
} as const;

function EngineCard({
  to,
  icon: Icon,
  title,
  description,
  example,
  exampleLabel,
  action,
  tone,
}: EngineCardProps) {
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
          <div className="stack-1 rounded-xl bg-surface/70 px-3 py-2.5">
            <span className="text-xs font-semibold text-muted-foreground">{exampleLabel}</span>
            <p className="text-sm leading-relaxed">{example}</p>
          </div>
          <span className="pt-1 text-xs font-semibold text-primary">{action}</span>
        </div>
      </Surface>
    </Link>
  );
}

/** Home is the calm entry point; examples are previews, never live activity. */
export function HomeFoundation() {
  const { t } = useI18n();
  const { user, loading: authLoading } = useAuth();
  const tier = useIdentity((s) => s.tier);
  const displayName = useIdentity((s) => s.displayName);
  const [localHour, setLocalHour] = useState<number | null>(null);
  const [nameGreetingUserId, setNameGreetingUserId] = useState<string | null>(null);

  useEffect(() => {
    setLocalHour(new Date().getHours());
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      if (nameGreetingUserId !== null) setNameGreetingUserId(null);
      return;
    }
    if (!displayName?.trim() || nameGreetingUserId === user.id) return;
    if (claimNameGreetingForSession()) setNameGreetingUserId(user.id);
  }, [authLoading, user, displayName, nameGreetingUserId]);

  const identityLabel =
    tier === "trusted"
      ? t("identity.trusted")
      : tier === "identified"
        ? t("identity.identified")
        : user
        ? t("identity.member")
        : t("identity.guest");

  const greetingKey =
    localHour === null || authLoading ? "home.welcome" : getHomeGreetingKey(localHour);
  const greetingName =
    user && nameGreetingUserId === user.id && displayName?.trim()
      ? `, ${displayName.trim()}`
      : "";
  const greeting = t(greetingKey).replace("{name}", greetingName);

  const demoFlashes = createDemoFlashes();
  const demoTitles: Record<string, string> = {
    "demo:flash:childcare-weekend": t("home.demo.childcare"),
    "demo:flash:moving-urgent": t("home.demo.moving"),
    "demo:flash:meeting-dishes": t("home.demo.meeting"),
  };

  return (
    <div className="page-shell stack-8">
      <section
        aria-labelledby="home-welcome-title"
        className="relative isolate flex min-h-[25rem] overflow-hidden rounded-[2rem] bg-card shadow-sm sm:min-h-[31rem]"
      >
        <img
          src={heroPhoto}
          srcSet={`${heroPhotoSmall} 800w, ${heroPhoto} 1600w`}
          sizes="(min-width: 1024px) 64rem, 100vw"
          alt={t("home.hero.photoAlt")}
          width={1600}
          height={1200}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 z-0 size-full object-cover object-[50%_35%]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-background/95 via-background/75 to-background/25"
        />
        <div className="relative z-20 flex w-full min-w-0 flex-col justify-between gap-10 p-5 text-foreground sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full border border-border bg-surface/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
              {identityLabel}
            </span>
            <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              {t("app.tagline")}
            </span>
          </div>
          <div className="max-w-2xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {t("home.hero.eyebrow")}
            </p>
            <h1
              id="home-welcome-title"
              className="max-w-[13ch] text-4xl font-semibold leading-[1.04] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              {greeting}
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("home.subtitle")}
            </p>
          </div>
        </div>
      </section>

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
            example={t("home.engine.flash.example")}
            exampleLabel={t("home.engine.exampleLabel")}
            action={t("home.engine.action")}
            tone="warm"
          />
          <EngineCard
            to="/scan"
            icon={ScanLine}
            title={t("home.engine.scan.title")}
            description={t("home.engine.scan.desc")}
            example={t("home.engine.scan.example")}
            exampleLabel={t("home.engine.exampleLabel")}
            action={t("home.engine.action")}
            tone="info"
          />
          <EngineCard
            to="/reel"
            icon={RadioTower}
            title={t("home.engine.reel.title")}
            description={t("home.engine.reel.desc")}
            example={t("home.engine.reel.example")}
            exampleLabel={t("home.engine.exampleLabel")}
            action={t("home.engine.action")}
            tone="primary"
          />
          <EngineCard
            to="/radar"
            icon={Radar}
            title={t("home.engine.radar.title")}
            description={t("home.engine.radar.desc")}
            example={t("home.engine.radar.example")}
            exampleLabel={t("home.engine.exampleLabel")}
            action={t("home.engine.action")}
            tone="violet"
          />
        </div>
      </section>

      <section className="stack-4" aria-labelledby="home-demo-title">
        <div className="stack-1">
          <h2 id="home-demo-title" className="text-title-md">
            {t("home.demo.title")}
          </h2>
          <p className="text-sm text-muted-foreground">{t("home.demo.desc")}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {demoFlashes.map((flash) => (
            <Surface
              key={flash.id}
              variant="elevated"
              padding="md"
              bordered
              className="flex min-h-32 flex-col justify-between gap-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground">Flash</span>
                <Indicator tone="primary" label={t("demo.label")} />
              </div>
              <p className="text-base font-semibold leading-snug">
                {demoTitles[flash.id] ?? t("home.demo.fallback")}
              </p>
              {flash.authorPreview ? (
                <PublicProfilePreview profile={flash.authorPreview} origin="demo" />
              ) : null}
            </Surface>
          ))}
        </div>
      </section>

      <VitalisVisionCard />

      <Surface variant="sunken" padding="md" bordered className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-muted-foreground">
          <span className="text-xl leading-none" aria-hidden="true">
            ✧
          </span>
        </span>
        <p className="text-sm leading-relaxed text-muted-foreground">{t("home.menuHint")}</p>
      </Surface>
    </div>
  );
}
