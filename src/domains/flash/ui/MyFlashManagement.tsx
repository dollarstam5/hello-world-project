import { useEffect, useState } from "react";
import { Archive, Eye, Pencil, Trash2 } from "lucide-react";
import type { FlashRecord } from "@eco/core-contracts";
import { resolveFlashStatus } from "@eco/core-logic";
import { EmptyState } from "@/components/app/EmptyState";
import { Surface } from "@/components/app/Surface";
import { FlashDeleteDialog } from "./FlashDeleteDialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n/useI18n";
import { useCommunicationRuntime } from "@/lib/communication/CommunicationRuntimeProvider";
import { publishFlashCommunicationEvent } from "../communication-events";
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
  const communication = useCommunicationRuntime();
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
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
      publishFlashCommunicationEvent(communication, record, "archived");
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
      const updated = await updateFlash(record.id, editDraft);
      publishFlashCommunicationEvent(communication, updated, "updated");
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
      publishFlashCommunicationEvent(communication, record, "deleted");
      setPendingDelete(null);
    } catch {
      setActionError(true);
    } finally {
      setBusyId(null);
    }
  }

  const startOfDay = (value: number) => {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  };
  const today = startOfDay(Date.now());
  const day = 86_400_000;
  const groups = [
    { key: "today", label: "flash.mine.period.today", predicate: (r: FlashRecord) => startOfDay(r.createdAt) === today },
    { key: "yesterday", label: "flash.mine.period.yesterday", predicate: (r: FlashRecord) => startOfDay(r.createdAt) === today - day },
    { key: "twoDays", label: "flash.mine.period.twoDays", predicate: (r: FlashRecord) => startOfDay(r.createdAt) === today - 2 * day },
    { key: "week", label: "flash.mine.period.week", predicate: (r: FlashRecord) => startOfDay(r.createdAt) >= today - 6 * day && startOfDay(r.createdAt) < today - 2 * day },
    { key: "older", label: "flash.mine.period.older", predicate: (r: FlashRecord) => startOfDay(r.createdAt) < today - 6 * day },
  ].map((group) => ({ ...group, items: records?.filter(group.predicate).sort((a, b) => b.createdAt - a.createdAt) ?? [] }))
    .filter((group) => group.items.length > 0);

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

      {groups.map((group) => (
        <section key={group.key}>
          <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
            {t(group.label)} ({group.items.length})
          </h3>
          <div className="stack-3">
            {group.items.map((record) => {
              const resolvedStatus = resolveFlashStatus(record);

              return (
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
                        {t(statusKeys[resolvedStatus])}
                        {" · "}
                        {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
                          record.createdAt,
                        )}
                      </p>
                    </div>

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

                  <div className="mt-3 flex flex-wrap justify-end gap-2">
                    <Button type="button" size="sm" variant="outline" disabled={editingId !== null || busyId !== null} onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}>
                      <Eye className="mr-2 h-4 w-4" aria-hidden />
                      {expandedId === record.id ? t("flash.mine.hideDetails") : t("flash.mine.viewDetails")}
                    </Button>
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
                  {expandedId === record.id ? (
                    <div className="mt-3 rounded-lg border bg-muted/30 p-3 stack-2 text-sm">
                      <p className="whitespace-pre-wrap break-words">{record.body}</p>
                      <p>{t("flash.mine.detailCreated")}: {new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(record.createdAt)}</p>
                      {record.expiresAt ? <p>{t("flash.mine.detailExpires")}: {new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(record.expiresAt)}</p> : null}
                      {record.areaLabel ? <p>{t("flash.mine.detailArea")}: {record.areaLabel}</p> : null}
                      <div className="stack-1">
                        <p className="font-medium">{t("flash.mine.detailMedia")}</p>
                        {record.mediaIds.length ? <ul className="list-disc pl-5">{record.mediaIds.map((mediaId) => <li key={mediaId} className="break-all">{mediaId}</li>)}</ul> : <p className="text-muted-foreground">{t("flash.mine.detailNoMedia")}</p>}
                        <p className="text-xs text-muted-foreground">{t("flash.mine.detailMediaPending")}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{t("flash.mine.detailInteractionsPending")}</p>
                    </div>
                  ) : null}
                </Surface>
              );
            })}
          </div>
        </section>
      ))}

      <FlashDeleteDialog
        open={pendingDelete !== null}
        busy={busyId !== null}
        onOpenChange={(open) => {
          if (!open && !busyId) setPendingDelete(null);
        }}
        onConfirm={() => {
          if (pendingDelete) void remove(pendingDelete);
        }}
      />
    </div>
  );
}
