import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/useI18n";

type Props = { onCreateFlash: () => void };

export function FlashDashboardHeader({ onCreateFlash }: Props) {
  const { t } = useI18n();

  return (
    <header className="flex flex-col gap-4 rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/10 via-card to-card p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20">
          <Sparkles className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight">{t("flash.mine.title")}</h1>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {t("flash.mine.desc")}
          </p>
        </div>
      </div>
      <Button type="button" onClick={onCreateFlash} className="min-h-11 shrink-0 rounded-full">
        <Plus className="size-4" aria-hidden="true" />
        {t("flash.mine.empty.action")}
      </Button>
    </header>
  );
}
