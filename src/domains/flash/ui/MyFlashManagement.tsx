import { useEffect, useState } from "react";
import { Archive, Pencil, Trash2 } from "lucide-react";
import type { FlashRecord } from "@eco/core-contracts";
import { EmptyState } from "@/components/app/EmptyState";
import { Surface } from "@/components/app/Surface";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n/useI18n";
import { flashesRepository, useLocalQuery } from "@/platform/offline";
import { archiveFlash, deleteFlash, updateFlash } from "../data";

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [userId, setUserId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    let active = true;

    void supabase.auth
      .getUser()
      .then(({ data, error }) => {
        if (active) setUserId(error || !data.user ? null : data.user.id);
      })
      .catch(() => {
        if (active) setUserId(null);
      });

    return () => {
      active = false;
    };
  }, []);

  const records = useLocalQuery(async () => {
    if (userId === undefined || !userId) return null;

    const all = await flashesRepository.list();

    return all
      .filter((flash) => flash.authorId === userId && !flash.deletedAt)
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [userId]);

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

  async function saveEdit(record: FlashRecord) {
    setBusyId(record.id);
    setActionError(false);
    try {
      await updateFlash(record.id, editDraft);
      setEditingId(null);
      setEditDraft("");
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

  if (records.length === 0) {
    return (
      <div className="stack-3">
        <p className="text-xs text-muted-foreground">{t("flash.mine.localHint")}</p>
        <Surface variant="sunken" padding="none" bordered>
          <EmptyState
            title={t("flash.mine.empty.title")}
            description={t("flash.mine.empty.desc")}
          />
        </Surface>
      </div>
    );
  }

  return (
    <div className="stack-3">
      <p className="text-xs text-muted-foreground">{t("flash.mine.localHint")}</p>

      {actionError ? (
        <p role="alert" className="text-sm text-destructive">
          {t("flash.mine.actionError")}
        </p>
      ) : null}

      {records.map((record) => (
        <Surface key={record.id} variant="elevated" padding="md" bordered>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {editingId === record.id ? (
                <div className="stack-2">
                  <Textarea
                    value={editDraft}
                    onChange={(event) => setEditDraft(event.target.value)}
                    maxLength={600}
                    rows={3}
                    aria-label={t("flash.composer.placeholder")}
                  />
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={busyId === record.id}
                      onClick={() => {
                        setEditingId(null);
                        setEditDraft("");
                      }}
                    >
                      {t("common.cancel")}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      disabled={busyId === record.id || !editDraft.trim()}
                      onClick={() => void saveEdit(record)}
                    >
                      {t("common.save")}
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="font-semibold leading-snug">{record.title}</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                {t(statusKeys[record.status])}
                {" · "}
                {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(record.createdAt)}
              </p>
            </div>

            {record.status === "live" ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={busyId === record.id}
                onClick={() => void archive(record)}
              >
                <Archive className="mr-2 h-4 w-4" aria-hidden />
                {t("flash.mine.archive")}
              </Button>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap justify-end gap-2">
            {editingId !== record.id ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={
                  busyId !== null ||
                  record.status === "archived" ||
                  record.status === "expired"
                }
                onClick={() => {
                  setEditingId(record.id);
                  setEditDraft(record.body);
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
              disabled={busyId !== null || editingId === record.id}
              onClick={() => setPendingDelete(record)}
            >
              <Trash2 className="mr-2 h-4 w-4" aria-hidden />
              {t("flash.mine.delete")}
            </Button>
          </div>
        </Surface>
      ))}

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open && !busyId) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("flash.mine.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("flash.mine.deleteConfirm")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busyId !== null}>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              disabled={!pendingDelete || busyId !== null}
              onClick={() => {
                if (pendingDelete) void remove(pendingDelete);
              }}
            >
              {t("flash.mine.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
