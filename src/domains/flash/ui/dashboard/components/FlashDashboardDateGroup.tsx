import type { FlashRecord } from "@eco/core-contracts";
import { useI18n } from "@/lib/i18n/useI18n";
import {
  FLASH_STATUS_PRESENTATION,
  groupFlashRecordsByStatus,
} from "../utils/flashDashboardStatus";
import type { FlashTimelineGroup } from "../types/flashDashboard.types";
import { FlashDashboardRecordCard } from "./FlashDashboardRecordCard";

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
  const statusGroups = groupFlashRecordsByStatus(group.items);

  return (
    <section className="stack-3 border-l-2 border-primary/20 pl-3 sm:pl-4">
      <div className="stack-2 border-b border-border-soft pb-2">
        <button
          type="button"
          aria-expanded={!collapsed}
          aria-controls={`flash-timeline-${group.key}`}
          onClick={() => onToggle(group.key)}
          className="flex w-full items-center justify-between gap-3 text-left text-sm font-semibold"
        >
          <span className="flex min-w-0 items-center gap-2">
            <span role="heading" aria-level={3} className="truncate">
              {t(group.label)}
            </span>
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
        <div
          className="flex flex-wrap gap-1.5"
          aria-label={t("flash.mine.timeline.statusSummary")}
        >
          {statusGroups.map((statusGroup) => (
            <span
              key={statusGroup.key}
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${FLASH_STATUS_PRESENTATION[statusGroup.key].className}`}
            >
              {t(statusGroup.label)}
              <span className="tabular-nums">{statusGroup.items.length}</span>
            </span>
          ))}
        </div>
      </div>
      <div
        id={`flash-timeline-${group.key}`}
        hidden={collapsed}
        className="stack-3"
      >
        {statusGroups.map((statusGroup) => (
          <div key={statusGroup.key} className="stack-2">
            <h4 className="flex items-center justify-between gap-2 text-xs font-medium text-foreground/80">
              <span>{t(statusGroup.label)}</span>
              <span className="text-[11px] tabular-nums text-muted-foreground">
                {statusGroup.items.length}
              </span>
            </h4>
            <div className="stack-2">
              {statusGroup.items.map((record) => (
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
        ))}
      </div>
    </section>
  );
}
