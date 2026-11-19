import type { FlashRecord } from "@eco/core-contracts";
import { Surface } from "@/components/app/Surface";
import { FlashDashboardDeleteDialog } from "./components/FlashDashboardDeleteDialog";
import { FlashDashboardEmptyState } from "./components/FlashDashboardEmptyState";
import { FlashDashboardDateGroup } from "./components/FlashDashboardDateGroup";
import { useI18n } from "@/lib/i18n/useI18n";
import { useFlashDashboardActions } from "./hooks/useFlashDashboardActions";
import { useFlashDashboardData } from "./hooks/useFlashDashboardData";
import { useFlashDashboardTimeline } from "./hooks/useFlashDashboardTimeline";

type PendingDelete = FlashRecord | null;

export function FlashDashboard({
  onCreateFlash,
  onAccessAvailable,
}: {
  onCreateFlash: () => void;
  onAccessAvailable?: (available: boolean) => void;
}) {
  const { t, locale } = useI18n();
  const { records } = useFlashDashboardData();
  const { groups, collapsedGroups, toggleGroup } = useFlashDashboardTimeline(records ?? []);
  const { busyId, actionError, archive, saveEdit, remove } = useFlashDashboardActions();
  const [pendingDelete, setPendingDelete] = useFlashDashboardPendingDelete();

  if (records === undefined) {
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

  if (records.length === 0) return <FlashDashboardEmptyState onCreateFlash={onCreateFlash} />;

  return (
    <div className="stack-4">
      <p className="rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        {t("flash.mine.localHint")}
      </p>
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
          onDelete={setPendingDelete}
        />
      ))}
      <FlashDashboardDeleteDialog
        open={pendingDelete !== null}
        busy={busyId !== null}
        onOpenChange={(open) => {
          if (!open && !busyId) setPendingDelete(null);
        }}
        onConfirm={() => {
          if (pendingDelete) {
            void remove(pendingDelete).then((success) => {
              if (success) setPendingDelete(null);
            });
          }
        }}
      />
    </div>
  );
}
