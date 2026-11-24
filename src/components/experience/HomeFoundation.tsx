import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { Surface } from "@/components/app/Surface";
import { Button } from "@/components/ui/button";
import { PublicProfilePreview } from "@/components/app/PublicProfilePreview";
import { Indicator } from "@/components/app/Indicator";
import { useI18n } from "@/lib/i18n/useI18n";
import { useIdentity } from "@/lib/experience/identity";
import { useAuth } from "@/domains/auth/model/useAuth";
import { claimNameGreetingForSession, getHomeGreetingKey } from "@/lib/communication/greeting";
import { formatCommunicationMessage } from "@/lib/communication/format";
import { createDemoFlashes } from "@/domains/flash/model/demo-flashes";
import { VitalisVisionCard } from "@/components/experience/VitalisVisionCard";
import { HomeEngineCard } from "@/components/experience/HomeEngineCard";
import heroPhoto from "@/assets/images/experience/home-neighbours-1600.webp";
import heroPhotoSmall from "@/assets/images/experience/home-neighbours-800.webp";

/** Home is the calm entry point; examples are previews, never live activity. */
export function HomeFoundation() {
  const { t } = useI18n();
  const { user, loading: authLoading } = useAuth();
  const displayName = useIdentity((s) => s.displayName);
  const displayNameOwnerId = useIdentity((s) => s.displayNameOwnerId);
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
    // A cached name is usable only for the account that supplied it.
    if (displayNameOwnerId !== user.id || !displayName?.trim() || nameGreetingUserId === user.id) {
      return;
    }
    if (claimNameGreetingForSession()) setNameGreetingUserId(user.id);
  }, [authLoading, user, displayName, displayNameOwnerId, nameGreetingUserId]);

  // Authentication is the source of truth for member/guest recognition.
  // UDI trust levels are not inferred from the local identity placeholder.
  const identityLabel = authLoading ? null : user ? t("identity.member") : t("identity.guest");

  const greetingKey =
    localHour === null || authLoading ? "home.welcome" : getHomeGreetingKey(localHour);
  const greetingName =
    user && displayNameOwnerId === user.id && nameGreetingUserId === user.id && displayName?.trim()
      ? `, ${displayName.trim()}`
      : "";
  const greeting = formatCommunicationMessage(t, greetingKey, { name: greetingName });

  const demoFlashes = createDemoFlashes();
  const demoTitles: Record<string, string> = {
    "demo:flash:childcare-weekend": t("home.demo.childcare"),
    "demo:flash:moving-urgent": t("home.demo.moving"),
    "demo:flash:meeting-dishes": t("home.demo.meeting"),
  };

  return (
    <div className="page-shell stack-8">
      {/* Hero Photographique Immersif Native App */}
      <section
        aria-labelledby="home-welcome-title"
        className="relative isolate flex min-h-[26rem] overflow-hidden rounded-[2.25rem] border border-white/10 bg-card shadow-xl sm:min-h-[32rem]"
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
          className="absolute inset-0 z-0 size-full scale-105 object-cover object-[50%_35%] transition-transform duration-700 ease-out"
        />
        {/* Masque dégradé cinématographique en verre teinté */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-background via-background/80 to-background/30 backdrop-blur-[1px]"
        />

        <div className="relative z-20 flex w-full min-w-0 flex-col justify-between gap-8 p-5 text-foreground sm:p-8">
          {/* Badges d'identité et de contexte, sans état local ou réseau simulé */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              {identityLabel && (
                <span className="rounded-full border border-white/10 bg-background/60 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-md">
                  {identityLabel}
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-surface/60 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
              {t("app.tagline")}
            </span>
          </div>

          <div className="max-w-2xl space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/90">
              {t("home.hero.eyebrow")}
            </p>
            <h1
              id="home-welcome-title"
              className="text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              {greeting}
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t("home.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {!authLoading ? (
        <Surface
          variant="sunken"
          padding="md"
          bordered
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          aria-labelledby="home-journey-title"
        >
          <div className="min-w-0 stack-2">
            <h2 id="home-journey-title" className="text-base font-semibold">
              {t(user ? "home.journey.member.title" : "home.journey.guest.title")}
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {t(user ? "home.journey.member.body" : "home.journey.guest.body")}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            {user ? (
              <Button asChild className="min-h-11">
                <Link to="/espace/profil">{t("home.journey.member.profile")}</Link>
              </Button>
            ) : (
              <>
                <Button asChild className="min-h-11">
                  <Link to="/reel">{t("home.journey.guest.live")}</Link>
                </Button>
                <Button asChild variant="outline" className="min-h-11">
                  <Link to="/auth" search={{ mode: "signUp" }}>
                    {t("home.journey.guest.signup")}
                  </Link>
                </Button>
              </>
            )}
          </div>
        </Surface>
      ) : null}

      <section className="stack-4" aria-labelledby="home-engines-title">
        <div className="stack-1">
          <h2 id="home-engines-title" className="text-title-md">
            {t("home.engines.title")}
          </h2>
          <p className="text-sm text-muted-foreground">{t("home.engines.desc")}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <HomeEngineCard
            to="/flash"
            icon={Zap}
            title={t("home.engine.flash.title")}
            description={t("home.engine.flash.desc")}
            example={t("home.engine.flash.example")}
            exampleLabel={t("home.engine.exampleLabel")}
            action={t("home.engine.action")}
            tone="warm"
          />
          <HomeEngineCard
            to="/scan"
            icon={ScanLine}
            title={t("home.engine.scan.title")}
            description={t("home.engine.scan.desc")}
            example={t("home.engine.scan.example")}
            exampleLabel={t("home.engine.exampleLabel")}
            action={t("home.engine.action")}
            tone="info"
          />
          <HomeEngineCard
            to="/reel"
            icon={RadioTower}
            title={t("home.engine.reel.title")}
            description={t("home.engine.reel.desc")}
            example={t("home.engine.reel.example")}
            exampleLabel={t("home.engine.exampleLabel")}
            action={t("home.engine.action")}
            tone="primary"
          />
          <HomeEngineCard
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
