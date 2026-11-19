import { Archive, Eye, Pencil, Trash2 } from "lucide-react";
import type { FlashRecord } from "@eco/core-contracts";
import { Surface } from "@/components/app/Surface";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n/useI18n";
import { useFlashDashboardRecordCard } from "../hooks/useFlashDashboardRecordCard";
import { FlashDashboardDetailDialog } from "./FlashDashboardDetailDialog";

type Props = {
  record: FlashRecord;
  locale: string;
  busyId: string | null;
  onArchive: (record: FlashRecord) => void;
  onSave: (record: FlashRecord, body: string) => Promise<boolean>;
  onDelete: (record: FlashRecord) => void;
};

export function FlashDashboardRecordCard({
  record,
  locale,
  busyId,
  onArchive,
  onSave,
  onDelete,
}: Props) {
  const { t } = useI18n();
  const card = useFlashDashboardRecordCard(record, busyId, onSave);

  return (
    <Surface variant="elevated" padding="sm" bordered className="stack-3">
      <div className="flex min-w-0 items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {card.editing ? (
            <div className="stack-2">
              <Textarea
                value={card.draft}
                onChange={(event) => card.setDraft(event.target.value)}
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
                  disabled={card.busy}
                  onClick={card.cancelEdit}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="min-h-9 h-9 px-3 [&_svg]:size-4"
                  disabled={card.busy || !card.draft.trim()}
                  onClick={() => void card.save()}
                >
                  {t("common.save")}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="line-clamp-2 break-words font-semibold leading-snug">{record.title}</p>
              <p className="mt-1 line-clamp-2 break-words text-sm leading-relaxed text-muted-foreground">
                {record.body}
              </p>
            </>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            {new Intl.DateTimeFormat(locale, {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(record.createdAt)}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2 py-1 text-[11px] font-medium ${card.presentation.className}`}
        >
          {t(card.presentation.label)}
        </span>
      </div>

      <div className="flex items-center justify-between gap-1 border-t border-border-soft pt-2">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="min-h-9 h-9 px-2 text-xs [&_svg]:size-4"
          disabled={card.busy}
          onClick={() => card.setDetailsOpen(true)}
        >
          <Eye aria-hidden />
          <span className="hidden sm:inline">{t("flash.mine.viewDetails")}</span>
        </Button>
        <div className="flex items-center gap-1">
          {!card.editing ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="min-h-9 h-9 px-2 [&_svg]:size-4"
              aria-label={t("flash.mine.edit")}
              title={t("flash.mine.edit")}
              disabled={card.busy || !card.canEdit}
              onClick={card.startEdit}
            >
              <Pencil aria-hidden />
              <span className="hidden sm:inline text-xs">{t("flash.mine.edit")}</span>
            </Button>
          ) : null}
          {card.canArchive ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="min-h-9 h-9 px-2 [&_svg]:size-4"
              aria-label={t("flash.mine.archive")}
              title={t("flash.mine.archive")}
              disabled={card.busy}
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
            disabled={card.busy || card.editing}
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
        statusLabel={t(card.presentation.label)}
        open={card.detailsOpen}
        onOpenChange={card.setDetailsOpen}
      />
    </Surface>
  );
}
