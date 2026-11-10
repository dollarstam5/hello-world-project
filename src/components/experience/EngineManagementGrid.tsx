import { Indicator } from "@/components/app/Indicator";
import { Surface } from "@/components/app/Surface";
import { useI18n } from "@/lib/i18n/useI18n";
import type { MessageKey } from "@/lib/i18n/messages";

export function EngineManagementGrid({
  items,
  descriptionKey,
}: {
  items: { key: string; titleKey: MessageKey }[];
  descriptionKey: MessageKey;
}) {
  const { t } = useI18n();
  return (
    <div className="stack-3">
      <p className="text-sm leading-relaxed text-muted-foreground">{t(descriptionKey)}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <Surface key={item.key} variant="elevated" padding="md" bordered className="stack-2">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium">{t(item.titleKey)}</p>
              <Indicator tone="neutral" label={t("common.soon")} />
            </div>
          </Surface>
        ))}
      </div>
    </div>
  );
}
