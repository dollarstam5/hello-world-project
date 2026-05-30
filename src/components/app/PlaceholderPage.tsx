import { useI18n, type MessageKey } from "@/lib/i18n/useI18n";

interface PlaceholderPageProps {
  titleKey: MessageKey;
  descKey: MessageKey;
}

/**
 * Generic placeholder shell for routes that have no business UI yet.
 * Visual continuity with the rest of the shell; no domain logic.
 */
export function PlaceholderPage({ titleKey, descKey }: PlaceholderPageProps) {
  const { t } = useI18n();
  return (
    <section className="flex min-h-[80dvh] flex-col items-center justify-center px-6 text-center">
      <span className="mb-4 inline-flex items-center rounded-full border border-border-soft bg-surface px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {t("common.soon")}
      </span>
      <h1 className="text-balance text-2xl font-medium tracking-tight sm:text-3xl">
        {t(titleKey)}
      </h1>
      <p className="mt-3 max-w-sm text-balance text-sm text-muted-foreground">
        {t(descKey)}
      </p>
    </section>
  );
}
