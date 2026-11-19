import { CalendarDays, Search, X } from "lucide-react";
import type {
  FlashDashboardPeriodFilter,
  FlashDashboardStatusFilter,
} from "../utils/filterFlashDashboardRecords";
import { useI18n } from "@/lib/i18n/useI18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  status: FlashDashboardStatusFilter;
  onStatusChange: (value: FlashDashboardStatusFilter) => void;
  period: FlashDashboardPeriodFilter;
  onPeriodChange: (value: FlashDashboardPeriodFilter) => void;
  hasActiveFilters: boolean;
  onReset: () => void;
};
const STATUS_OPTIONS: FlashDashboardStatusFilter[] = [
  "all",
  "live",
  "draft",
  "expired",
  "archived",
];
const PERIOD_OPTIONS: FlashDashboardPeriodFilter[] = ["all", "today", "week", "month"];

export function FlashDashboardFilters(props: Props) {
  const { t } = useI18n();
  return (
    <section className="stack-2" aria-label={t("flash.mine.filters.title")}>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={props.query}
          onChange={(event) => props.onQueryChange(event.target.value)}
          placeholder={t("flash.mine.filters.searchPlaceholder")}
          aria-label={t("flash.mine.filters.searchPlaceholder")}
          className="h-11 rounded-xl pl-9 pr-10"
        />
        {props.query ? (
          <button
            type="button"
            onClick={() => props.onQueryChange("")}
            aria-label={t("flash.mine.filters.clearSearch")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        role="group"
        aria-label={t("flash.mine.filters.statusLabel")}
      >
        {STATUS_OPTIONS.map((option) => (
          <Button
            key={option}
            type="button"
            size="sm"
            variant={props.status === option ? "default" : "outline"}
            className="min-h-9 shrink-0 rounded-full px-3"
            aria-pressed={props.status === option}
            onClick={() => props.onStatusChange(option)}
          >
            {t(`flash.mine.filters.status.${option}`)}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarDays className="size-4" aria-hidden="true" />
          {t("flash.mine.filters.periodLabel")}
        </span>
        {PERIOD_OPTIONS.map((option) => (
          <Button
            key={option}
            type="button"
            size="sm"
            variant={props.period === option ? "secondary" : "ghost"}
            className="min-h-8 rounded-lg px-2.5 text-xs"
            aria-pressed={props.period === option}
            onClick={() => props.onPeriodChange(option)}
          >
            {t(`flash.mine.filters.period.${option}`)}
          </Button>
        ))}
        {props.hasActiveFilters ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="ml-auto min-h-8 px-2 text-xs"
            onClick={props.onReset}
          >
            {t("flash.mine.filters.reset")}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
