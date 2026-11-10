import { useState, type FormEvent } from "react";
import { Pencil, Radar as RadarIcon, X } from "lucide-react";
import type { RadarRadiusKm, RadarRecord, RadarStatus } from "@eco/core-contracts";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Indicator } from "@/components/app/Indicator";
import { Surface } from "@/components/app/Surface";
import { useAuth } from "@/domains/auth/model/useAuth";
import { useI18n } from "@/lib/i18n/useI18n";
import { cancelRadar, createRadarDraft, editRadarDraft, useMyRadars } from "../data";

const DAY_MS = 24 * 60 * 60 * 1000;
const RADII: RadarRadiusKm[] = [1, 3, 5, 10, 25, 50];
const DURATIONS = [3, 7, 14, 30, 60, 90] as const;

const statusKeys: Record<RadarStatus, MessageKey> = {
  draft: "radar.manage.status.draft",
  active: "radar.manage.status.active",
  watching: "radar.manage.status.watching",
  matched: "radar.manage.status.matched",
  paused: "radar.manage.status.paused",
  expired: "radar.manage.status.expired",
  cancelled: "radar.manage.status.cancelled",
};

const statusTones: Record<RadarStatus, "neutral" | "primary" | "success" | "warning" | "info"> = {
  draft: "neutral",
  active: "success",
  watching: "info",
  matched: "primary",
  paused: "warning",
  expired: "neutral",
  cancelled: "neutral",
};

/**
 * Radar V1: save and manage private search intentions offline-first.
 * Automatic matching and alerts stay explicitly unavailable until their engine
 * and scheduled processing are connected.
 */
export function RadarManagement() {
  const { t, locale } = useI18n();
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id ?? null;
  const [query, setQuery] = useState("");
  const [areaLabel, setAreaLabel] = useState("");
  const [radiusKm, setRadiusKm] = useState<RadarRadiusKm>(5);
  const [durationDays, setDurationDays] = useState<(typeof DURATIONS)[number]>(7);
  const [busy, setBusy] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState(false);
  const [pendingCancel, setPendingCancel] = useState<RadarRecord | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const records = useMyRadars(authLoading ? undefined : userId);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = query.trim();
    const area = areaLabel.trim();
    if (text.length < 3 || area.length < 2) return;

    setBusy(true);
    setActionError(false);
    const startsAt = Date.now();

    try {
      const input = {
        title: text.length > 160 ? text.slice(0, 157) + "…" : text,
        query: text,
        category: null,
        areaLabel: area,
        radiusKm,
        startsAt,
        expiresAt: startsAt + durationDays * DAY_MS,
      };
      if (editingId) {
        await editRadarDraft(editingId, input);
      } else {
        await createRadarDraft(input);
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
    try {
      await cancelRadar(pendingCancel.id);
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
      <Surface variant="elevated" padding="md" bordered>
        <div className="mb-3 flex items-center gap-2">
          <RadarIcon className="h-5 w-5 text-primary" aria-hidden />
          <h3 className="font-semibold">
            {t(editingId ? "radar.manage.edit.title" : "radar.manage.create.title")}
          </h3>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          {t("radar.manage.intro")}
        </p>
        <form onSubmit={(event) => void save(event)} className="stack-3">
          <label className="stack-1 text-sm font-medium" htmlFor="radar-query">
            {t("radar.manage.query.label")}
            <Textarea
              id="radar-query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("radar.manage.query.placeholder")}
              maxLength={2000}
              rows={3}
              required
              minLength={3}
              disabled={busy}
            />
          </label>
          <label className="stack-1 text-sm font-medium" htmlFor="radar-area">
            {t("radar.manage.area.label")}
            <Input
              id="radar-area"
              value={areaLabel}
              onChange={(event) => setAreaLabel(event.target.value)}
              placeholder={t("radar.manage.area.placeholder")}
              maxLength={80}
              minLength={2}
              required
              disabled={busy}
            />
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="stack-1 text-sm font-medium" htmlFor="radar-radius">
              {t("radar.manage.radius.label")}
              <select
                id="radar-radius"
                value={radiusKm}
                onChange={(event) => setRadiusKm(Number(event.target.value) as RadarRadiusKm)}
                disabled={busy}
                className="min-h-12 w-full rounded-xl border border-border bg-surface px-3 text-sm font-normal text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
              >
                {RADII.map((radius) => (
                  <option key={radius} value={radius}>
                    {radius} km
                  </option>
                ))}
              </select>
            </label>
            <label className="stack-1 text-sm font-medium" htmlFor="radar-duration">
              {t("radar.manage.duration.label")}
              <select
                id="radar-duration"
                value={durationDays}
                onChange={(event) =>
                  setDurationDays(Number(event.target.value) as (typeof DURATIONS)[number])
                }
                disabled={busy}
                className="min-h-12 w-full rounded-xl border border-border bg-surface px-3 text-sm font-normal text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
              >
                {DURATIONS.map((days) => (
                  <option key={days} value={days}>
                    {t("radar.manage.duration.days").replace("{count}", String(days))}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {editingId ? (
              <Button
                type="button"
                variant="ghost"
                disabled={busy}
                onClick={() => {
                  setEditingId(null);
                  setQuery("");
                  setAreaLabel("");
                  setRadiusKm(5);
                  setDurationDays(7);
                }}
              >
                {t("common.cancel")}
              </Button>
            ) : null}
            <Button
              type="submit"
              disabled={busy || query.trim().length < 3 || areaLabel.trim().length < 2}
            >
              {busy
                ? t("app.loading")
                : t(editingId ? "radar.manage.edit.action" : "radar.manage.create.action")}
            </Button>
          </div>
        </form>
      </Surface>

      {actionError ? (
        <p role="alert" className="text-sm text-destructive">
          {t("radar.manage.actionError")}
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
                          setAreaLabel(record.areaLabel);
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
