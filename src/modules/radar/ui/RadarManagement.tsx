import { useState, type FormEvent } from "react";
import { Pencil, X } from "lucide-react";
import type { RadarRadiusKm, RadarRecord } from "@eco/core-contracts";
import type { MessageKey } from "@/lib/i18n/messages";
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
import { Indicator } from "@/shared/components/Indicator";
import { RadarDraftForm } from "./RadarDraftForm";
import { Surface } from "@/shared/components/Surface";
import { useAuth } from "@/modules/auth/model/useAuth";
import { useI18n } from "@/lib/i18n/useI18n";
import { formatCommunicationMessage } from "@/features/communication";
import { useCommunicationRuntime } from "@/features/communication/CommunicationRuntimeProvider";
import { publishRadarCommunicationEvent } from "../communication-events";
import { statusKeys, statusTones } from "./radar-presentation";
import { cancelRadar, createRadarDraft, editRadarDraft, useMyRadars } from "../data";

const DAY_MS = 24 * 60 * 60 * 1000;
const RADII: RadarRadiusKm[] = [1, 3, 5, 10, 25, 50];
const DURATIONS = [3, 7, 14, 30, 60, 90] as const;

/**
 * Radar V1: save and manage private search intentions offline-first.
 * Automatic matching and alerts stay explicitly unavailable until their engine
 * and scheduled processing are connected.
 */
export function RadarManagement() {
  const { t, locale } = useI18n();
  const communication = useCommunicationRuntime();
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id ?? null;
  const [query, setQuery] = useState("");
  const [areaLabel, setAreaLabel] = useState("");
  const [radiusKm, setRadiusKm] = useState<RadarRadiusKm>(5);
  const [durationDays, setDurationDays] = useState<(typeof DURATIONS)[number]>(7);
  const [busy, setBusy] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState(false);
  const [actionNotice, setActionNotice] = useState<
    "radar.manage.saved" | "radar.manage.updated" | "radar.manage.cancelled" | null
  >(null);
  const [pendingCancel, setPendingCancel] = useState<RadarRecord | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const records = useMyRadars(authLoading ? undefined : userId);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = query.trim();
    const area = areaLabel.trim();
    if (text.length < 3) return;

    setBusy(true);
    setActionError(false);
    setActionNotice(null);
    const startsAt = Date.now();

    try {
      const input = {
        title: text.length > 160 ? text.slice(0, 157) + "…" : text,
        query: text,
        category: null,
        areaLabel: area.length >= 2 ? area : null,
        radiusKm,
        startsAt,
        expiresAt: startsAt + durationDays * DAY_MS,
      };
      if (editingId) {
        const updated = await editRadarDraft(editingId, input);
        publishRadarCommunicationEvent(communication, updated, "updated");
        setActionNotice("radar.manage.updated");
      } else {
        const saved = await createRadarDraft(input);
        publishRadarCommunicationEvent(communication, saved, "saved");
        setActionNotice("radar.manage.saved");
      }
      setEditingId(null);
      setQuery("");
      setAreaLabel("");
    } catch {
      setActionError(true);
    } finally {
      setBusy(false);
    }
  }

  async function confirmCancel() {
    if (!pendingCancel) return;
    setBusyId(pendingCancel.id);
    setActionError(false);
    setActionNotice(null);
    try {
      const cancelled = await cancelRadar(pendingCancel.id);
      publishRadarCommunicationEvent(communication, cancelled, "cancelled");
      setActionNotice("radar.manage.cancelled");
      setPendingCancel(null);
    } catch {
      setActionError(true);
    } finally {
      setBusyId(null);
    }
  }

  if (authLoading) {
    return (
      <p className="text-sm text-muted-foreground" role="status">
        {t("app.loading")}
      </p>
    );
  }

  if (!userId || records === null) {
    return (
      <Surface variant="sunken" padding="md" bordered>
        <p className="text-sm text-muted-foreground">{t("radar.manage.signIn")}</p>
      </Surface>
    );
  }

  if (records === undefined) {
    return (
      <p className="text-sm text-muted-foreground" role="status">
        {t("app.loading")}
      </p>
    );
  }

  return (
    <div className="stack-5">
      <RadarDraftForm
        editingId={editingId}
        busy={busy}
        query={query}
        areaLabel={areaLabel}
        radiusKm={radiusKm}
        durationDays={durationDays}
        radii={RADII}
        durations={DURATIONS}
        t={t}
        onQueryChange={setQuery}
        onAreaChange={setAreaLabel}
        onRadiusChange={setRadiusKm}
        onDurationChange={setDurationDays}
        onSubmit={(event) => void save(event)}
        onCancelEdit={() => {
          setEditingId(null);
          setQuery("");
          setAreaLabel("");
          setRadiusKm(5);
          setDurationDays(7);
        }}
      />

      {actionError ? (
        <p role="alert" className="text-sm text-destructive">
          {formatCommunicationMessage(t, "radar.manage.actionError")}
        </p>
      ) : actionNotice ? (
        <p role="status" className="text-sm text-muted-foreground">
          {formatCommunicationMessage(t, actionNotice)}
        </p>
      ) : null}

      <section className="stack-3" aria-labelledby="radar-mine-heading">
        <div className="flex items-center justify-between gap-3">
          <h3 id="radar-mine-heading" className="font-semibold">
            {t("radar.manage.mine.title")}
          </h3>
          <Indicator tone="neutral" label={String(records.length)} />
        </div>
        {records.length === 0 ? (
          <Surface variant="sunken" padding="md" bordered>
            <p className="text-sm text-muted-foreground">{t("radar.manage.empty")}</p>
          </Surface>
        ) : (
          <div className="stack-3">
            {records
              .slice()
              .sort((a, b) => b.updatedAt - a.updatedAt)
              .map((record) => (
                <Surface key={record.id} variant="elevated" padding="md" bordered>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium leading-snug">{record.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {record.areaLabel}
                        {" · "}
                        {record.radiusKm} km
                        {" · "}
                        {t("radar.manage.until").replace(
                          "{date}",
                          new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
                            record.expiresAt,
                          ),
                        )}
                      </p>
                    </div>
                    <Indicator
                      tone={statusTones[record.status]}
                      label={t(statusKeys[record.status])}
                    />
                  </div>
                  {record.status === "draft" ? (
                    <div className="mt-3 flex flex-wrap justify-end gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={busyId !== null || busy || editingId !== null}
                        onClick={() => {
                          setEditingId(record.id);
                          setQuery(record.query);
                          setAreaLabel(record.areaLabel ?? "");
                          setRadiusKm(record.radiusKm);
                          const savedDays = Math.round(
                            (record.expiresAt - record.startsAt) / DAY_MS,
                          ) as (typeof DURATIONS)[number];
                          setDurationDays(DURATIONS.includes(savedDays) ? savedDays : 7);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" aria-hidden />
                        {t("radar.manage.edit")}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={busyId !== null || busy}
                        onClick={() => setPendingCancel(record)}
                      >
                        <X className="mr-2 h-4 w-4" aria-hidden />
                        {t("radar.manage.cancel")}
                      </Button>
                    </div>
                  ) : null}
                </Surface>
              ))}
          </div>
        )}
      </section>

      <Surface variant="sunken" padding="md" bordered className="stack-2">
        <h3 className="font-semibold">{t("radar.manage.results.title")}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t("radar.manage.results.desc")}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t("radar.manage.alerts.desc")}
        </p>
      </Surface>

      <AlertDialog
        open={pendingCancel !== null}
        onOpenChange={(open) => {
          if (!open && !busyId) setPendingCancel(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("radar.manage.cancel.title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("radar.manage.cancel.confirm")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busyId !== null}>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              disabled={!pendingCancel || busyId !== null}
              onClick={() => void confirmCancel()}
            >
              {t("radar.manage.cancel")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
