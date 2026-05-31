import { useEffect, useState, type ReactNode } from "react";
import { Surface } from "@/components/app/Surface";
import { Indicator } from "@/components/app/Indicator";
import { EmptyState } from "@/components/app/EmptyState";
import {
  getDiscoverySections,
  type DiscoverySection,
} from "@/lib/experience/discovery";
import { useI18n } from "@/lib/i18n/useI18n";
import { useIdentity } from "@/lib/experience/identity";

function Section({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium tracking-tight text-foreground/80">{title}</h2>
      {children}
    </section>
  );
}

/**
 * HomeFoundation — orchestrates the home experience.
 *
 * It does NOT implement any domain. It exposes 4 calm slots (Flash,
 * Radar, Feed, Discovery) where domains plug in via registries.
 * Empty by default = calm by default.
 */
export function HomeFoundation() {
  const { t } = useI18n();
  const tier = useIdentity((s) => s.tier);

  // Resolve discovery sections client-side so registrations land in time.
  const [sections, setSections] = useState<DiscoverySection[]>([]);
  useEffect(() => {
    setSections(getDiscoverySections());
  }, []);

  const identityLabel =
    tier === "trusted"
      ? t("identity.trusted")
      : tier === "identified"
        ? t("identity.identified")
        : t("identity.guest");

  return (
    <div className="space-y-8 px-4 pt-6">
      <header className="space-y-2">
        <Indicator tone="primary" label={identityLabel} dot />
        <h1 className="font-display text-4xl tracking-tight">{t("home.welcome")}</h1>
        <p className="text-sm text-muted-foreground">{t("home.subtitle")}</p>
      </header>

      <Section title={t("home.section.flash")}>
        <Surface variant="sunken" padding="lg" bordered>
          <EmptyState title={t("common.empty")} description={t("common.empty.desc")} />
        </Surface>
      </Section>

      <Section title={t("home.section.radar")}>
        <Surface variant="sunken" padding="lg" bordered>
          <EmptyState title={t("common.empty")} description={t("common.empty.desc")} />
        </Surface>
      </Section>

      <Section title={t("home.section.feed")}>
        <Surface variant="sunken" padding="lg" bordered>
          <EmptyState title={t("common.empty")} description={t("common.empty.desc")} />
        </Surface>
      </Section>

      <Section title={t("home.section.discovery")}>
        {sections.length === 0 ? (
          <Surface variant="sunken" padding="lg" bordered>
            <EmptyState title={t("common.empty")} description={t("common.empty.desc")} />
          </Surface>
        ) : (
          <div className="space-y-3">
            {sections.map((s) => (
              <div key={s.key}>{s.render()}</div>
            ))}
          </div>
        )}
      </Section>

      <footer className="pt-4 pb-2 text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground/60">
        Phase 5 · Experience Foundation
      </footer>
    </div>
  );
}
