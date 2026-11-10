import { useState } from "react";
import { Archive, Trash2 } from "lucide-react";
import type { FlashRecord } from "@eco/core-contracts";
import { EmptyState } from "@/components/app/EmptyState";
import { Surface } from "@/components/app/Surface";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n/useI18n";
import { useLocalQuery, flashesRepository } from "@/platform/offline";
import { archiveFlash, deleteFlash } from "../data";

type PendingDelete = FlashRecord | null;

const statusKeys = {
  draft: "flash.mine.status.draft",
  live: "flash.mine.status.live",
  expired: "flash.mine.status.expired",
  archived: "flash.mine.status.archived",
} as const;

/** Shows only records owned by the signed-in person and present in their local database. */
export function MyFlashManagement() {
  const { t, locale } = useI18n();
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState(false);

  const records = useLocalQuery(async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    const all = await flashesRepository.list();
    return all
      .filter((flash) => flash.authorId === data.user.id && !flash.deletedAt)
      .sort((a, b) => b.createdAt - a.createdAt);
  }, []);

  async function archive(record: FlashRecord) {
    setBusyId(record.id);
    setActionError(false);
    try {
      await archiveFlash(record.id);
    } catch {
      setActionError(true);
    } finally {
      setBusyId(null);
    }
  }

  async function remove(record: FlashRecord) {
    setBusyId(record.id);
    setActionError(false);
    try {
      await deleteFlash(record.id);
      setPendingDelete(null);
    } catch {
      setActionError(true);
    } finally {
      setBusyId(null);
    }
  }

  if (records === undefined) {
    return <p className="text-sm text-muted-foreground" role="status">{t("app.loading")}</p>;
  }

  if (records === null) {
    return (
      <Surface variant="sunken" padding="md" bordered>
        <p className="text-sm text-muted-foreground">{t("flash.mine.signIn")}</p>
      </Surface>
    );
  }

  if (records.length === 0) {
    return (
      <Surface variant="sunken" padding="none" bordered>
        <EmptyState title={t("flash.mine.empty.title")} description={t("flash.mine.empty.desc")} />
      </Surface>
    );
  }

  return (
    <div className="stack-3">
      <p className="text-xs text-muted-foreground">{t("flash.mine.localHint")}</p>
      {actionError ? <p role="alert" className="text-sm text-destructive">{t("flash.mine.actionError")}</p> : null}
      {records.map((record) => (
        <Surface key={record.id} variant="elevated" padding="md" bordered>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-semibold leading-snug">{record.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t(statusKeys[record.status])} · {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(record.createdAt)}
              </p>
            </div>
            {record.status === "live" ? (
              <Button type="button" size="sm" variant="outline" disabled={busyId === record.id} onClick={() => void archive(record)}>
                <Archive className="mr-2 h-4 w-4" aria-hidden />{t("flash.mine.archive")}
              </Button>
            ) : null}
          </div>
          <div className="mt-3 flex justify-end">
            <Button type="button" size="sm" variant="ghost" className="text-muted-foreground" disabled={busyId === record.id} onClick={() => setPendingDelete(record)}>
              <Trash2 className="mr-2 h-4 w-4" aria-hidden />{t("flash.mine.delete")}
            </Button>
          </div>
        </Surface>
      ))}
      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => { if (!open && !busyId) setPendingDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("flash.mine.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("flash.mine.deleteConfirm")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busyId !== null}>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction disabled={!pendingDelete || busyId !== null} onClick={() => { if (pendingDelete) void remove(pendingDelete); }}>
              {t("flash.mine.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
