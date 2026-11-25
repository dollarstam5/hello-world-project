import { Surface } from "@/components/app/Surface";
import { FlashDashboardDeleteDialog } from "./components/FlashDashboardDeleteDialog";
import { FlashDashboardEmptyState } from "./components/FlashDashboardEmptyState";
import { FlashDashboardDateGroup } from "./components/FlashDashboardDateGroup";
import { FlashDashboardHeader } from "./components/FlashDashboardHeader";
import { FlashDashboardOverview } from "./components/FlashDashboardOverview";
import { FlashDashboardFilters } from "./components/FlashDashboardFilters";
import { useI18n } from "@/lib/i18n/useI18n";
import { useFlashDashboardActions } from "./hooks/useFlashDashboardActions";
import { useFlashDashboardData } from "./hooks/useFlashDashboardData";
import { useFlashDashboardFilters } from "./hooks/useFlashDashboardFilters";
import { useFlashDashboardTimeline } from "./hooks/useFlashDashboardTimeline";
import { useFlashDashboardDeletion } from "./hooks/useFlashDashboardDeletion";

export function FlashDashboard({
  onCreateFlash,
  onAccessAvailable,
}: {
  onCreateFlash: () => void;
  onAccessAvailable?: (available: boolean) => void;
}) {
  const { t, locale } = useI18n();
  const { records, userId } = useFlashDashboardData();
  const filters = useFlashDashboardFilters(records ?? []);
  const { groups, collapsedGroups, toggleGroup } = useFlashDashboardTimeline(
    filters.filteredRecords,
  );
  const { busyId, actionError, archive, saveEdit, remove } = useFlashDashboardActions();
  const deletion = useFlashDashboardDeletion(remove, busyId);

  if (userId === undefined || records === undefined) {
    return (
      <p className="text-sm text-muted-foreground" role="status">
        {t("app.loading")}
      </p>
    );
  }

  if (records === null) {
    return (
      <Surface variant="sunken" padding="md" bordered>
        <p className="text-sm text-muted-foreground">{t("flash.mine.signIn")}</p>
      </Surface>
    );
  }

  return (
    <div className="stack-4">
      <FlashDashboardHeader onCreateFlash={onCreateFlash} />
      <FlashDashboardOverview records={records} />
      {records.length > 0 ? (
        <FlashDashboardFilters
          query={filters.query}
          onQueryChange={filters.setQuery}
          status={filters.status}
          onStatusChange={filters.setStatus}
          period={filters.period}
          onPeriodChange={filters.setPeriod}
          hasActiveFilters={filters.hasActiveFilters}
          onReset={filters.resetFilters}
        />
      ) : null}
      {records.length === 0 ? <FlashDashboardEmptyState /> : null}
      {records.length > 0 && filters.filteredRecords.length === 0 ? (
        <Surface variant="sunken" padding="md" bordered>
          <p className="text-sm text-muted-foreground">{t("flash.mine.filters.noResults")}</p>
        </Surface>
      ) : null}
      {records.length > 0 ? (
        <p className="rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          {t("flash.mine.localHint")}
        </p>
      ) : null}
      {actionError ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
          {t("flash.mine.actionError")}
        </p>
      ) : null}
      {groups.map((group) => (
        <FlashDashboardDateGroup
          key={group.key}
          group={group}
          collapsed={Boolean(collapsedGroups[group.key])}
          onToggle={toggleGroup}
          locale={locale}
          busyId={busyId}
          onArchive={archive}
          onSave={saveEdit}
          onDelete={deletion.requestDelete}
        />
      ))}
      <FlashDashboardDeleteDialog
        open={deletion.pending !== null}
        busy={busyId !== null}
        onOpenChange={deletion.onOpenChange}
        onConfirm={deletion.confirm}
      />
    </div>
  );
}
