import { Sparkles } from "lucide-react";
import { EmptyState } from "@/components/app/EmptyState";
import { Surface } from "@/components/app/Surface";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/useI18n";

type Props = { onCreateFlash: () => void };

export function FlashDashboardEmptyState({ onCreateFlash }: Props) {
  const { t } = useI18n();
  return (
    <div className="stack-3">
      <p className="text-xs text-muted-foreground">{t("flash.mine.localHint")}</p>
      <Surface variant="sunken" padding="md" bordered>
        <EmptyState
          icon={<Sparkles className="size-6" aria-hidden="true" />}
          title={t("flash.mine.empty.title")}
          description={t("flash.mine.empty.desc")}
          action={<Button type="button" size="lg" className="min-h-11 rounded-full" onClick={onCreateFlash}>{t("flash.mine.empty.action")}</Button>}
          className="max-w-none px-2 py-7"
        />
        <div className="grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
          {(["step1", "step2", "step3"] as const).map((step) => (
            <div key={step} className="rounded-xl bg-card/70 p-3">
              <p className="text-sm font-semibold">{t(`flash.mine.empty.${step}Title`)}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t(`flash.mine.empty.${step}Body`)}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-xl border border-dashed border-border p-3">
          <p className="text-sm font-medium">{t("flash.mine.empty.statusGuideTitle")}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t("flash.mine.empty.statusGuideBody")}</p>
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">{t("flash.mine.empty.timelineHint")}</p>
      </Surface>
    </div>
  );
}
