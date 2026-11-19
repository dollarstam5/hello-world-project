import { useState } from "react";
import { Archive, Eye, Pencil, Trash2 } from "lucide-react";
import type { FlashRecord } from "@eco/core-contracts";
import { resolveFlashStatus } from "@eco/core-logic";
import { Surface } from "@/components/app/Surface";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n/useI18n";

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
    <Surface variant="elevated" padding="md" bordered>
      <div className="flex items-start justify-between gap-3">
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
            <p className="font-semibold leading-snug">{record.title}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            {t(statusKeys[status])}{" "}
            {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(record.createdAt)}
          </p>
        </div>
        {status === "live" ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => onArchive(record)}
          >
            <Archive className="mr-2 h-4 w-4" aria-hidden />
            {t("flash.mine.archive")}
          </Button>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={() => setDetailsOpen(true)}
        >
          <Eye className="mr-2 h-4 w-4" aria-hidden />
          {t("flash.mine.viewDetails")}
        </Button>
        {!editing ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={busy || status === "archived" || status === "expired"}
            onClick={() => {
              setDraft(record.body);
              setEditing(true);
            }}
          >
            <Pencil className="mr-2 h-4 w-4" aria-hidden />
            {t("flash.mine.edit")}
          </Button>
        ) : null}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="text-muted-foreground"
          disabled={busy || editing}
          onClick={() => onDelete(record)}
        >
          <Trash2 className="mr-2 h-4 w-4" aria-hidden />
          {t("flash.mine.delete")}
        </Button>
      </div>
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-h-[85dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="pr-8">{record.title}</DialogTitle>
            <DialogDescription>
              {t(statusKeys[status])} ·{" "}
              {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(record.createdAt)}
            </DialogDescription>
          </DialogHeader>
          <div className="stack-3 text-sm">
            <div className="rounded-xl border bg-muted/30 p-3">
              <p className="whitespace-pre-wrap break-words">{record.body}</p>
            </div>
            <div className="stack-2 text-muted-foreground">
              <p>
                {t("flash.mine.detailCreated")}:{" "}
                {new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(
                  record.createdAt,
                )}
              </p>
              {record.expiresAt ? (
                <p>
                  {t("flash.mine.detailExpires")}:{" "}
                  {new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(
                    record.expiresAt,
                  )}
                </p>
              ) : null}
              {record.areaLabel ? (
                <p>
                  {t("flash.mine.detailArea")}: {record.areaLabel}
                </p>
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Surface>
  );
}
