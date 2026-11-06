import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Radar, ScanLine, UsersRound, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n/useI18n";
import { useAuth } from "@/domains/auth";
import { PRIMARY_ENGINES, type PrimaryEngineKey } from "@/lib/navigation/primary-engines";

const ENGINE_ICONS = {
  reel: UsersRound,
  flash: Zap,
  scan: ScanLine,
  radar: Radar,
} satisfies Record<PrimaryEngineKey, typeof UsersRound>;



/**
 * Home is the application entry and navigation hub.
 * It reads the existing auth session but never owns authentication or engine logic.
 */
export function HomeFoundation() {
  const { t } = useI18n();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-shell py-12 text-sm text-muted-foreground" role="status">
        {t("app.loading")}
      </div>
    );
  }

  return (
    <div className="page-shell stack-10">
      <header className="stack-2 motion-rise-in">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">
          {t(user ? "identity.identified" : "identity.guest")}
        </p>
        <h1 className="text-fluid-display-sm">{t("home.welcome")}</h1>
        <p className="text-subtitle max-w-prose">{t("home.subtitle")}</p>
      </header>

      {user ? (
        <section className="stack-3" aria-labelledby="home-engines-title">
          <h2
            id="home-engines-title"
            className="text-caption font-medium tracking-tight text-foreground/80"
          >
            {t("home.engines.title")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {PRIMARY_ENGINES.map((engine) => {
              const Icon = ENGINE_ICONS[engine.key];
              return (
                <Link
                  key={engine.to}
                  to={engine.to}
                  className="group flex min-h-24 items-center gap-3 rounded-3xl border border-border-soft bg-surface p-4 outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-medium">{t(engine.titleKey)}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {t(engine.descriptionKey)}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">{t("home.menu.hint")}</p>
        </section>
      ) : (
        <section className="stack-4 rounded-3xl border border-border-soft bg-surface p-5 sm:p-6">
          <div className="stack-2">
            <h2 className="text-xl font-semibold tracking-tight">{t("home.explainer.title")}</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {t("home.explainer.description")}
            </p>
            <p className="text-sm leading-6 text-muted-foreground">{t("home.explainer.engines")}</p>
          </div>
          <Link
            to="/auth"
            className="inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t("home.explainer.cta")}
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>
      )}
      <footer className="pt-2 pb-2 text-center text-meta">Vitalis</footer>
    </div>
  );
}
