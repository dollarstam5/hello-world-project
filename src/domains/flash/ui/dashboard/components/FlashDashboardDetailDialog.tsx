import { Archive, Pencil, Trash2 } from "lucide-react";
import type { FlashRecord } from "@eco/core-contracts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/useI18n";

type Props = {
  record: FlashRecord;
  locale: string;
  statusLabel: string;
  open: boolean;
  busy: boolean;
  canEdit: boolean;
  canArchive: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
};

export function FlashDashboardDetailDialog({
  record,
  locale,
  statusLabel,
  open,
  busy,
  canEdit,
  canArchive,
  onOpenChange,
  onEdit,
  onArchive,
  onDelete,
}: Props) {
  const { t } = useI18n();
  const dateTimeFormat = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border px-2.5 py-1 text-xs font-medium">
              {statusLabel}
            </span>
            <span className="text-xs text-muted-foreground">
              {dateTimeFormat.format(record.createdAt)}
            </span>
          </div>
          <DialogTitle className="break-words pr-8 text-left text-lg leading-snug">
            {record.title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t("flash.mine.detailCreated")}: {dateTimeFormat.format(record.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <section className="stack-2">
          <h3 className="text-sm font-medium">{t("flash.mine.detailContent")}</h3>
          <div className="rounded-xl border bg-muted/30 p-4">
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
              {record.body}
            </p>
          </div>
        </section>

        <section className="stack-2 border-t border-border-soft pt-3">
          <h3 className="text-sm font-medium">{t("flash.mine.detailCreated")}</h3>
          <div className="stack-2 text-sm text-muted-foreground">
            <p>{dateTimeFormat.format(record.createdAt)}</p>
            {record.expiresAt ? (
              <p>
                {t("flash.mine.detailExpires")}: {dateTimeFormat.format(record.expiresAt)}
              </p>
            ) : null}
            {record.areaLabel ? (
              <p>
                {t("flash.mine.detailArea")}: {record.areaLabel}
              </p>
            ) : null}
          </div>
        </section>

        <section className="stack-2 border-t border-border-soft pt-3">
          <h3 className="text-sm font-medium">{t("flash.mine.detailActions")}</h3>
          <div className="flex flex-wrap gap-2">
            {canEdit ? (
              <Button type="button" variant="outline" size="sm" disabled={busy} onClick={onEdit}>
                <Pencil aria-hidden />
                {t("flash.mine.edit")}
              </Button>
            ) : null}
            {canArchive ? (
              <Button type="button" variant="outline" size="sm" disabled={busy} onClick={onArchive}>
                <Archive aria-hidden />
                {t("flash.mine.archive")}
              </Button>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              disabled={busy}
              onClick={onDelete}
            >
              <Trash2 aria-hidden />
              {t("flash.mine.delete")}
            </Button>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}
