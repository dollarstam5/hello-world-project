import type { FlashRecord } from "@eco/core-contracts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n/useI18n";

type Props = {
  record: FlashRecord;
  locale: string;
  statusLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function FlashDashboardDetailDialog({
  record,
  locale,
  statusLabel,
  open,
  onOpenChange,
}: Props) {
  const { t } = useI18n();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="pr-8">{record.title}</DialogTitle>
          <DialogDescription>
            {statusLabel} {"·"}{" "}
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
              {new Intl.DateTimeFormat(locale, {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(record.createdAt)}
            </p>
            {record.expiresAt ? (
              <p>
                {t("flash.mine.detailExpires")}:{" "}
                {new Intl.DateTimeFormat(locale, {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(record.expiresAt)}
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
  );
}
