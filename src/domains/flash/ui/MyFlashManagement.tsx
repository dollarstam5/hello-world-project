import { useEffect, useState } from "react";
import { Archive, ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import type { FlashRecord } from "@eco/core-contracts";
import { resolveFlashStatus } from "@eco/core-logic";
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
import { groupFlashesByDate } from "../model/date-groups";

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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [userId, setUserId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    let receivedAuthEvent = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      receivedAuthEvent = true;
      if (active) setUserId(session?.user.id ?? null);
    });

    void supabase.auth
      .getSession()
      .then(({ data, error }) => {
        // Do not overwrite a newer sign-in/sign-out event with an older snapshot.
        if (active && !receivedAuthEvent) {
          setUserId(error ? null : (data.session?.user.id ?? null));
        }
      })
      .catch(() => {
        if (active && !receivedAuthEvent) setUserId(null);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
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

  const dateGroups = groupFlashesByDate(records ?? []);
  const statusOrder = ["draft", "live", "expired", "archived"] as const;

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

      {dateGroups.map((dateGroup) => (
        <section key={dateGroup.group} className="stack-3">
          <h2 className="text-base font-semibold">
            {t(`flash.mine.date.${dateGroup.group}`)} ({dateGroup.items.length})
          </h2>
          {statusOrder.map((status) => {
            const items = dateGroup.items.filter((record) => resolveFlashStatus(record) === status);
            if (items.length === 0) return null;
            return (
              <section key={status} className="stack-2">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  {t(statusKeys[status])} ({items.length})
                </h3>
                <div className="stack-3">
              {items.map((record) => {
                const resolvedStatus = resolveFlashStatus(record);
  
                return (
                  <Surface key={record.id} variant="elevated" padding="md" bordered>
                    <div className="flex flex-wrap items-start justify-between gap-3">
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
                          {t(statusKeys[resolvedStatus])}
                          {" · "}
                          {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
                            record.createdAt,
                          )}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        aria-expanded={expandedId === record.id}
                        onClick={() => setExpandedId((current) => current === record.id ? null : record.id)}
                      >
                        {expandedId === record.id ? <ChevronUp className="mr-1 h-4 w-4" aria-hidden /> : <ChevronDown className="mr-1 h-4 w-4" aria-hidden />}
                        {expandedId === record.id ? t("flash.mine.closeDetails") : t("flash.mine.details")}
                      </Button>
  
                      {resolvedStatus === "live" ? (
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
  
                    {expandedId === record.id ? (
                      <div className="mt-3 rounded-xl border border-border bg-muted/40 p-3">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{record.body}</p>
                        <p className="mt-3 text-xs text-muted-foreground">
                          {t("flash.mine.createdAt")} {new Intl.DateTimeFormat(locale, { dateStyle: "full", timeStyle: "short" }).format(record.createdAt)}
                        </p>
                        {record.areaLabel ? <p className="mt-1 text-xs text-muted-foreground">{t("flash.mine.location")} : {record.areaLabel}</p> : null}
                        {record.mediaIds.length > 0 ? <p className="mt-1 text-xs text-muted-foreground">{t("flash.mine.mediaCount")} : {record.mediaIds.length}</p> : null}
                      </div>
                    ) : null}
  
                    <div className="mt-3 flex flex-wrap justify-end gap-2">
                      {editingId !== record.id ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={
                            busyId !== null ||
                            resolvedStatus === "archived" ||
                            resolvedStatus === "expired"
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
                );
              })}
                </div>
              </section>
            );
          })}
        </section>
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
