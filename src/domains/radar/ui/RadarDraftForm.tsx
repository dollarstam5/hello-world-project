import type { FormEvent } from "react";
import { Radar as RadarIcon } from "lucide-react";
import type { RadarRadiusKm } from "@eco/core-contracts";
import type { MessageKey } from "@/lib/i18n/messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Surface } from "@/components/app/Surface";

type DurationDays = 3 | 7 | 14 | 30 | 60 | 90;

type RadarDraftFormProps = {
  editingId: string | null;
  busy: boolean;
  query: string;
  areaLabel: string;
  radiusKm: RadarRadiusKm;
  durationDays: DurationDays;
  radii: RadarRadiusKm[];
  durations: readonly DurationDays[];
  t: (key: MessageKey) => string;
  onQueryChange: (value: string) => void;
  onAreaChange: (value: string) => void;
  onRadiusChange: (value: RadarRadiusKm) => void;
  onDurationChange: (value: DurationDays) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancelEdit: () => void;
};

export function RadarDraftForm({
  editingId,
  busy,
  query,
  areaLabel,
  radiusKm,
  durationDays,
  radii,
  durations,
  t,
  onQueryChange,
  onAreaChange,
  onRadiusChange,
  onDurationChange,
  onSubmit,
  onCancelEdit,
}: RadarDraftFormProps) {
  return (
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
      <form onSubmit={onSubmit} className="stack-3">
        <label className="stack-1 text-sm font-medium" htmlFor="radar-query">
          {t("radar.manage.query.label")}
          <Textarea
            id="radar-query"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
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
            onChange={(event) => onAreaChange(event.target.value)}
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
              onChange={(event) => onRadiusChange(Number(event.target.value) as RadarRadiusKm)}
              disabled={busy}
              className="min-h-12 w-full rounded-xl border border-border bg-surface px-3 text-sm font-normal text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            >
              {radii.map((radius) => (
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
              onChange={(event) => onDurationChange(Number(event.target.value) as DurationDays)}
              disabled={busy}
              className="min-h-12 w-full rounded-xl border border-border bg-surface px-3 text-sm font-normal text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            >
              {durations.map((days) => (
                <option key={days} value={days}>
                  {t("radar.manage.duration.days").replace("{count}", String(days))}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {editingId ? (
            <Button type="button" variant="ghost" disabled={busy} onClick={onCancelEdit}>
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
  );
}
