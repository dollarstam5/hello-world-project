import { useEffect, useState } from "react";
import type { FlashRecord } from "@eco/core-contracts";
import { Surface } from "@/components/app/Surface";
import { FlashDashboardDeleteDialog } from "./components/FlashDashboardDeleteDialog";
import { FlashDashboardEmptyState } from "./components/FlashDashboardEmptyState";
import { FlashDashboardDateGroup } from "./components/FlashDashboardDateGroup";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n/useI18n";
import { flashesRepository, useLocalQuery } from "@/platform/offline";
import { groupFlashByDate } from "./utils/groupFlashByDate";
import { useFlashDashboardActions } from "./hooks/useFlashDashboardActions";

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
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    week: true,
    lastWeek: true,
    older: true,
  });
  const { busyId, actionError, archive, saveEdit, remove } = useFlashDashboardActions();
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

  const groups = groupFlashByDate(records ?? []);

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
        <p
          role="alert"
          className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
          {t("flash.mine.actionError")}
        </p>
      ) : null}

      {groups.map((group) => (
        <FlashDashboardDateGroup
          key={group.key}
          group={group}
          collapsed={Boolean(collapsedGroups[group.key])}
          onToggle={(key) =>
            setCollapsedGroups((previous) => ({ ...previous, [key]: !previous[key] }))
          }
          locale={locale}
          busyId={busyId}
          onArchive={archive}
          onSave={saveEdit}
          onDelete={setPendingDelete}
        />
      ))}
      <FlashDashboardDeleteDialog
        open={pendingDelete !== null}
        busy={busyId !== null}
        onOpenChange={(open) => {
          if (!open && !busyId) setPendingDelete(null);
        }}
        onConfirm={() => {
          if (pendingDelete) {
            void remove(pendingDelete).then((success) => {
              if (success) setPendingDelete(null);
            });
          }
        }}
      />
    </div>
  );
}
