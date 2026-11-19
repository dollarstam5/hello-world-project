import { useEffect, useState } from "react";
import type { FlashRecord } from "@eco/core-contracts";
import { resolveFlashStatus } from "@eco/core-logic";
import { Surface } from "@/components/app/Surface";
import { FlashDashboardDeleteDialog } from "./components/FlashDashboardDeleteDialog";
import { FlashDashboardEmptyState } from "./components/FlashDashboardEmptyState";
import { FlashDashboardRecordCard } from "./components/FlashDashboardRecordCard";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n/useI18n";
import { useCommunicationRuntime } from "@/lib/communication/CommunicationRuntimeProvider";
import { publishFlashCommunicationEvent } from "../../communication-events";
import { flashesRepository, useLocalQuery } from "@/platform/offline";
import { archiveFlash, deleteFlash, updateFlash } from "../../data";

type PendingDelete = FlashRecord | null;

/** Shows only records owned by the signed-in person and present in their local database. */
export function FlashDashboard({
  onCreateFlash,
  onAccessAvailable,
}: {
  onCreateFlash: () => void;
  onAccessAvailable?: (available: boolean) => void;
}) {
  const { t, locale } = useI18n();
  const communication = useCommunicationRuntime();
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState(false);
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

  async function saveEdit(record: FlashRecord, body: string): Promise<boolean> {
    setBusyId(record.id);
    setActionError(false);
    try {
      const updated = await updateFlash(record.id, body);
      publishFlashCommunicationEvent(communication, updated, "updated");
      return true;
    } catch {
      setActionError(true);
      return false;
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
  const startOfWeek = (value: number) => {
    const date = new Date(value);
    const mondayOffset = (date.getDay() + 6) % 7;
    date.setDate(date.getDate() - mondayOffset);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  };
  const thisWeekStart = startOfWeek(today);
  const lastWeekStart = thisWeekStart - 7 * day;
  useEffect(() => {
    if (records && records.length > 0) onAccessAvailable?.(true);
  }, [records, onAccessAvailable]);

  const groups = [
    {
      key: "today",
      label: "flash.mine.period.today",
      predicate: (r: FlashRecord) => startOfDay(r.createdAt) === today,
    },
    {
      key: "yesterday",
      label: "flash.mine.period.yesterday",
      predicate: (r: FlashRecord) => startOfDay(r.createdAt) === today - day,
    },
    {
      key: "twoDays",
      label: "flash.mine.period.twoDays",
      predicate: (r: FlashRecord) => startOfDay(r.createdAt) === today - 2 * day,
    },
    {
      key: "week",
      label: "flash.mine.period.week",
      predicate: (r: FlashRecord) =>
        startOfDay(r.createdAt) >= thisWeekStart && startOfDay(r.createdAt) < today - 2 * day,
    },
    {
      key: "lastWeek",
      label: "flash.mine.period.lastWeek",
      predicate: (r: FlashRecord) =>
        startOfDay(r.createdAt) >= lastWeekStart &&
        startOfDay(r.createdAt) < thisWeekStart &&
        startOfDay(r.createdAt) < today - 2 * day,
    },
    {
      key: "older",
      label: "flash.mine.period.older",
      predicate: (r: FlashRecord) => startOfDay(r.createdAt) < lastWeekStart,
    },
  ]
    .map((group) => ({
      ...group,
      items: records?.filter(group.predicate).sort((a, b) => b.createdAt - a.createdAt) ?? [],
    }))
    .filter((group) => group.items.length > 0);

  const statusGroups = [
    { key: "live", label: "flash.mine.status.live" },
    { key: "draft", label: "flash.mine.status.draft" },
    { key: "expired", label: "flash.mine.status.expired" },
    { key: "archived", label: "flash.mine.status.archived" },
  ] as const;

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

  if (records.length === 0) return <FlashDashboardEmptyState onCreateFlash={onCreateFlash} />;

  return (
    <div className="stack-4">
      <p className="rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        {t("flash.mine.localHint")}
      </p>

      {actionError ? (
        <p role="alert" className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {t("flash.mine.actionError")}
        </p>
      ) : null}

      {groups.map((group) => (
        <section key={group.key} className="stack-3">
          <h3 className="flex items-center justify-between gap-3 border-b border-border-soft pb-2 text-sm font-semibold">
            <span>{t(group.label)}</span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
              {group.items.length}
            </span>
          </h3>
          <div className="stack-3">
            {statusGroups.map((statusGroup) => {
              const statusItems = group.items.filter(
                (record) => resolveFlashStatus(record) === statusGroup.key,
              );
              if (statusItems.length === 0) return null;

              return (
                <div key={statusGroup.key} className="stack-2">
                  <h4 className="flex items-center justify-between gap-2 text-xs font-medium text-foreground/80">
                    <span>{t(statusGroup.label)}</span>
                    <span className="text-[11px] tabular-nums text-muted-foreground">
                      {statusItems.length}
                    </span>
                  </h4>
                  <div className="stack-2">
                    {statusItems.map((record) => (
                      <FlashDashboardRecordCard
                        key={record.id}
                        record={record}
                        locale={locale}
                        busyId={busyId}
                        onArchive={archive}
                        onSave={saveEdit}
                        onDelete={setPendingDelete}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <FlashDashboardDeleteDialog
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
