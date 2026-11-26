import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, Zap, ScanLine, RadioTower, Radar } from "lucide-react";
import { Surface } from "@/components/app/Surface";
import { Button } from "@/components/ui/button";
import { PublicProfilePreview } from "@/components/app/PublicProfilePreview";
import { Indicator } from "@/components/app/Indicator";
import { useI18n } from "@/lib/i18n/useI18n";
import { useIdentity } from "@/domains/profile/model/identity";
import { useAuth } from "@/domains/auth/model/useAuth";
import {
  claimNameGreetingForSession,
  getHomeGreetingKey,
} from "@/features/communication/model/greeting";
import { formatCommunicationMessage } from "@/features/communication/model/format";
import { createDemoFlashes } from "@/domains/flash/model/demo-flashes";
import { VitalisVisionCard } from "@/components/experience/VitalisVisionCard";
import { HomeEngineCard } from "@/components/experience/HomeEngineCard";

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
      {/* Accueil illustré : une présence humaine, sans photographie de stock. */}
      <section
        aria-labelledby="home-welcome-title"
        className="relative isolate flex min-h-[21rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(ellipse_at_78%_20%,hsl(var(--primary)/0.22),transparent_42%),linear-gradient(145deg,hsl(var(--card)),hsl(var(--background)))] shadow-xl sm:min-h-[23rem]"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-10 -top-12 h-64 w-64 rounded-full border border-primary/20 bg-primary/10 blur-[1px]" />
          <div className="absolute right-16 top-10 h-40 w-40 rounded-full border border-white/10 bg-white/[0.03]" />
          <svg viewBox="0 0 420 300" className="absolute -bottom-3 right-0 h-[78%] w-[min(76%,26rem)] opacity-90 sm:right-5" fill="none">
            <circle cx="310" cy="74" r="35" fill="hsl(var(--primary) / .18)" />
            <path d="M186 300c4-65 26-103 67-112 39-9 76 10 91 45l24 67H186Z" fill="hsl(var(--primary) / .32)" />
            <circle cx="278" cy="111" r="27" fill="hsl(var(--warm) / .9)" />
            <path d="M235 197c3-35 17-55 43-59 29-4 48 15 52 51" stroke="hsl(var(--foreground) / .72)" strokeWidth="7" strokeLinecap="round"/>
            <path d="M40 300c6-52 26-84 62-92 38-8 69 10 83 42l17 50H40Z" fill="hsl(var(--intelligence) / .26)" />
            <circle cx="119" cy="139" r="25" fill="hsl(var(--primary) / .72)" />
            <path d="M80 207c5-29 18-45 39-48 25-4 42 11 47 38" stroke="hsl(var(--foreground) / .72)" strokeWidth="7" strokeLinecap="round"/>
            <path d="M154 300c5-43 20-68 48-75 29-7 54 7 65 34l13 41H154Z" fill="hsl(var(--warm) / .35)" />
            <circle cx="218" cy="176" r="21" fill="hsl(var(--warm) / .78)" />
            <path d="M190 229c4-23 14-36 29-38 19-3 33 8 37 29" stroke="hsl(var(--foreground) / .68)" strokeWidth="6" strokeLinecap="round"/>
            <path d="M60 76l8 16 18 3-13 12 3 18-16-9-16 9 3-18-13-12 18-3 8-16Z" fill="hsl(var(--primary) / .72)" />
            <circle cx="355" cy="174" r="6" fill="hsl(var(--warm))" />
            <circle cx="55" cy="190" r="4" fill="hsl(var(--primary))" />
          </svg>
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/65 to-transparent" />
        </div>

        <div className="relative z-10 flex w-full min-w-0 flex-col justify-between gap-10 p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {identityLabel ? (
              <span className="rounded-full border border-white/10 bg-background/55 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-xl">
                {identityLabel}
              </span>
            ) : <span />}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-background/45 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
              {t("app.tagline")}
            </span>
          </div>

          <div className="max-w-[34rem] space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              {t("home.hero.eyebrow")}
            </p>
            <h1 id="home-welcome-title" className="text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
              {greeting}
            </h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
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
            exampleAction={t("home.engine.exampleAction")}
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
              variant="glass-soft"
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
