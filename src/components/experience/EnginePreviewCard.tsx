import type { MessageKey } from "@/lib/i18n/messages";
import { useI18n } from "@/lib/i18n/useI18n";

interface EnginePreviewCardProps {
  titleKey: MessageKey;
  descriptionKey: MessageKey;
}

/** A clearly labelled teaching example, never a fabricated live result. */
export function EnginePreviewCard({ titleKey, descriptionKey }: EnginePreviewCardProps) {
  const { t } = useI18n();

  return (
    <article className="rounded-2xl border border-border-soft bg-surface p-4 shadow-sm">
      <span className="inline-flex rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary">
        {t("home.engine.exampleLabel")}
      </span>
      <h3 className="mt-3 text-sm font-semibold">{t(titleKey)}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t(descriptionKey)}</p>
    </article>
  );
}
