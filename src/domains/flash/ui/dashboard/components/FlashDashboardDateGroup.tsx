import type { FlashRecord } from "@eco/core-contracts";
import { resolveFlashStatus } from "@eco/core-logic";
import { useI18n } from "@/lib/i18n/useI18n";
import { FlashDashboardRecordCard } from "./FlashDashboardRecordCard";
import type { FlashTimelineGroup } from "../types/flashDashboard.types";

type Props = {
  group: FlashTimelineGroup;
  collapsed: boolean;
  onToggle: (key: FlashTimelineGroup["key"]) => void;
  locale: string;
  busyId: string | null;
  onArchive: (record: FlashRecord) => void;
  onSave: (record: FlashRecord, body: string) => Promise<boolean>;
  onDelete: (record: FlashRecord) => void;
};

const STATUS_GROUPS = [
  { key: "live", label: "flash.mine.status.live" },
  { key: "draft", label: "flash.mine.status.draft" },
  { key: "expired", label: "flash.mine.status.expired" },
  { key: "archived", label: "flash.mine.status.archived" },
] as const;

export function FlashDashboardDateGroup({
  group,
  collapsed,
  onToggle,
  locale,
  busyId,
  onArchive,
  onSave,
  onDelete,
}: Props) {
  const { t } = useI18n();

  return (
    <section className="stack-3">
      <h3 className="border-b border-border-soft pb-2">
        <button
          type="button"
          aria-expanded={!collapsed}
          aria-controls={`flash-timeline-${group.key}`}
          onClick={() => onToggle(group.key)}
          className="flex w-full items-center justify-between gap-3 text-left text-sm font-semibold"
        >
          <span className="flex min-w-0 items-center gap-2">
            <span>{t(group.label)}</span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
              {group.items.length}
            </span>
          </span>
          <span
            aria-hidden="true"
            className={`shrink-0 text-muted-foreground transition-transform ${collapsed ? "" : "rotate-180"}`}
          >
            ▾
          </span>
        </button>
      </h3>
      <div id={`flash-timeline-${group.key}`} hidden={collapsed} className="stack-3">
        {STATUS_GROUPS.map((statusGroup) => {
          const statusItems = group.items.filter(
            (record) => resolveFlashStatus(record) === statusGroup.key,
          );
          if (statusItems.length === 0) return null;

          return (
            <div key={statusGroup.key} className="stack-2">
              <h4 className="flex items-center justify-between gap-2 text-xs font-medium text-foreground/80">
                <span>{t(statusGroup.label)}</span>
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {statusItems.length}
                </span>
              </h4>
              <div className="stack-2">
                {statusItems.map((record) => (
                  <FlashDashboardRecordCard
                    key={record.id}
                    record={record}
                    locale={locale}
                    busyId={busyId}
                    onArchive={onArchive}
                    onSave={onSave}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
