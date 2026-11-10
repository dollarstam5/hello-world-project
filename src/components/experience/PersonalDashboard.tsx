import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Eye, Settings2, ShieldCheck, UserRound, SlidersHorizontal } from "lucide-react";
import { Surface } from "@/components/app/Surface";
import { Indicator } from "@/components/app/Indicator";
import { useI18n } from "@/lib/i18n/useI18n";
import { useIdentity } from "@/lib/experience/identity";

const cards = [
  { to: "/espace/profil", icon: UserRound, titleKey: "space.card.profile.title", descKey: "space.card.profile.desc" },
  { to: "/espace/informations", icon: ShieldCheck, titleKey: "space.card.info.title", descKey: "space.card.info.desc" },
  { to: "/espace/parametres/profil", icon: SlidersHorizontal, titleKey: "space.card.profileSettings.title", descKey: "space.card.profileSettings.desc" },
  { to: "/espace/apercu", icon: Eye, titleKey: "space.card.preview.title", descKey: "space.card.preview.desc" },
  { to: "/espace/parametres/application", icon: Settings2, titleKey: "space.card.settings.title", descKey: "space.card.settings.desc" },
] as const;

export function PersonalDashboard() {
  const { t } = useI18n();
  const displayName = useIdentity((state) => state.displayName);

  return (
    <div className="page-shell stack-8">
      <header className="stack-2 motion-rise-in">
        <Indicator tone="primary" dot label={t("page.espace.eyebrow")} />
        <h1 className="text-fluid-display-sm">{t("space.title")}</h1>
        <p className="text-subtitle max-w-prose">{displayName ? t("space.welcome").replace("{name}", displayName) : t("space.subtitle")}</p>
      </header>

      <section className="stack-3" aria-labelledby="space-management-title">
        <div className="stack-1">
          <h2 id="space-management-title" className="text-title-md">{t("space.management.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("space.management.desc")}</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.to} to={card.to} className="group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <Surface variant="elevated" padding="md" bordered interactive className="flex h-full min-h-36 items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{t(card.titleKey)}</span>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{t(card.descKey)}</span>
                  </span>
                </Surface>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="stack-2">
        <h2 className="text-title-md">{t("space.engines.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("space.engines.desc")}</p>
        <div className="grid grid-cols-2 gap-2">
          {(["flash", "scan", "reel", "radar"] as const).map((engine) => (
            <Link key={engine} to={`/${engine}`} className="rounded-xl border border-border-soft bg-surface px-3 py-3 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {t(`nav.${engine}`)}
              <span className="mt-1 block text-xs font-normal text-muted-foreground">{t("space.engines.open")}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
