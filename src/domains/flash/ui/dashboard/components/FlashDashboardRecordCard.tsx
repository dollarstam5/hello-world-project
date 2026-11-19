import { useState } from "react";
import { Archive, Eye, Pencil, Trash2 } from "lucide-react";
import type { FlashRecord } from "@eco/core-contracts";
import { resolveFlashStatus } from "@eco/core-logic";
import { Surface } from "@/components/app/Surface";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n/useI18n";
import { FlashDashboardDetailDialog } from "./FlashDashboardDetailDialog";

type Props = {
  record: FlashRecord;
  locale: string;
  busyId: string | null;
  onArchive: (record: FlashRecord) => void;
  onSave: (record: FlashRecord, body: string) => Promise<boolean>;
  onDelete: (record: FlashRecord) => void;
};

const statusKeys = {
  draft: "flash.mine.status.draft",
  live: "flash.mine.status.live",
  expired: "flash.mine.status.expired",
  archived: "flash.mine.status.archived",
} as const;

const statusStyles = {
  draft: "border-muted-foreground/25 bg-muted text-muted-foreground",
  live: "border-primary/25 bg-primary/10 text-primary",
  expired: "border-warning/25 bg-warning/10 text-warning",
  archived: "border-muted-foreground/20 bg-muted/60 text-muted-foreground",
} as const;

export function FlashDashboardRecordCard({
  record,
  locale,
  busyId,
  onArchive,
  onSave,
  onDelete,
}: Props) {
  const { t } = useI18n();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(record.body);
  const status = resolveFlashStatus(record);
  const busy = busyId === record.id;

  return (
    <Surface variant="elevated" padding="sm" bordered className="stack-2">
      <div className="flex min-w-0 items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="stack-2">
              <Textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                maxLength={600}
                rows={3}
                aria-label={t("flash.composer.placeholder")}
              />
              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="min-h-9 h-9 px-3 [&_svg]:size-4"
                  disabled={busy}
                  onClick={() => {
                    setEditing(false);
                    setDraft(record.body);
                  }}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="min-h-9 h-9 px-3 [&_svg]:size-4"
                  disabled={busy || !draft.trim()}
                  onClick={async () => {
                    if (await onSave(record, draft)) setEditing(false);
                  }}
                >
                  {t("common.save")}
                </Button>
              </div>
            </div>
          ) : (
            <p className="line-clamp-2 break-words font-medium leading-snug">{record.title}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(record.createdAt)}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2 py-1 text-[11px] font-medium ${statusStyles[status]}`}
        >
          {t(statusKeys[status])}
        </span>
      </div>

      <div className="flex items-center justify-between gap-1 border-t border-border-soft pt-2">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="min-h-9 h-9 px-2 text-xs [&_svg]:size-4"
          disabled={busy}
          onClick={() => setDetailsOpen(true)}
        >
          <Eye aria-hidden />
          <span className="hidden sm:inline">{t("flash.mine.viewDetails")}</span>
        </Button>
        <div className="flex items-center gap-1">
          {!editing ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="min-h-9 h-9 px-2 [&_svg]:size-4"
              aria-label={t("flash.mine.edit")}
              title={t("flash.mine.edit")}
              disabled={busy || status === "archived" || status === "expired"}
              onClick={() => {
                setDraft(record.body);
                setEditing(true);
              }}
            >
              <Pencil aria-hidden />
              <span className="hidden sm:inline text-xs">{t("flash.mine.edit")}</span>
            </Button>
          ) : null}
          {status === "live" ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="min-h-9 h-9 px-2 [&_svg]:size-4"
              aria-label={t("flash.mine.archive")}
              title={t("flash.mine.archive")}
              disabled={busy}
              onClick={() => onArchive(record)}
            >
              <Archive aria-hidden />
              <span className="hidden sm:inline text-xs">{t("flash.mine.archive")}</span>
            </Button>
          ) : null}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="min-h-9 h-9 px-2 text-muted-foreground [&_svg]:size-4"
            aria-label={t("flash.mine.delete")}
            title={t("flash.mine.delete")}
            disabled={busy || editing}
            onClick={() => onDelete(record)}
          >
            <Trash2 aria-hidden />
            <span className="hidden sm:inline text-xs">{t("flash.mine.delete")}</span>
          </Button>
        </div>
      </div>
      <FlashDashboardDetailDialog
        record={record}
        locale={locale}
        statusLabel={t(statusKeys[status])}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </Surface>
  );
}
