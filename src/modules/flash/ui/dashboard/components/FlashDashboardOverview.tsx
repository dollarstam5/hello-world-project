import { Archive, Clock3, FileText, Radio } from "lucide-react";
import type { FlashRecord } from "@eco/core-contracts";
import { resolveFlashStatus } from "@eco/core-logic";
import { Surface } from "@/shared/components/Surface";
import { useI18n } from "@/lib/i18n/useI18n";

type Props = { records: FlashRecord[] };

type StatusKey = "live" | "draft" | "expired" | "archived";

const STATUS_CARDS: Array<{
  key: StatusKey;
  icon: typeof Radio;
  style: string;
}> = [
  { key: "live", icon: Radio, style: "text-primary bg-primary/10" },
  { key: "draft", icon: FileText, style: "text-muted-foreground bg-muted" },
  { key: "expired", icon: Clock3, style: "text-warning bg-warning/10" },
  { key: "archived", icon: Archive, style: "text-muted-foreground bg-muted/70" },
];

export function FlashDashboardOverview({ records }: Props) {
  const { t } = useI18n();

  return (
    <section
      aria-label={t("flash.mine.title")}
      className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3"
    >
      {STATUS_CARDS.map(({ key, icon: Icon, style }) => {
        const count = records.filter((record) => resolveFlashStatus(record) === key).length;
        return (
          <Surface key={key} variant="elevated" padding="sm" bordered className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${style}`}
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="truncate text-xs font-medium text-muted-foreground">
                {t(`flash.mine.status.${key}`)}
              </span>
            </div>
            <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight">{count}</p>
          </Surface>
        );
      })}
    </section>
  );
}
