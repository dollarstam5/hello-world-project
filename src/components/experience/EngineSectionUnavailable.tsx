import { Indicator } from "@/components/app/Indicator";
import { Surface } from "@/components/app/Surface";
import { useI18n } from "@/lib/i18n/useI18n";
import type { MessageKey } from "@/lib/i18n/messages";

export function EngineSectionUnavailable({ descriptionKey }: { descriptionKey: MessageKey }) {
  const { t } = useI18n();
  return (
    <Surface variant="sunken" padding="md" bordered className="stack-2">
      <Indicator tone="neutral" label={t("common.soon")} />
      <p className="text-sm leading-relaxed text-muted-foreground">{t(descriptionKey)}</p>
    </Surface>
  );
}
