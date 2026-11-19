import { SlidersHorizontal } from "lucide-react";
import type { ScanRadiusKm } from "../hooks/useScanPreferences";
import type { MessageKey } from "@/lib/i18n/messages";

type ScanPreferencesProps = {
  radiusKm: ScanRadiusKm;
  availableRadii: readonly ScanRadiusKm[];
  disabled: boolean;
  onRadiusChange: (radius: ScanRadiusKm) => void;
  t: (key: MessageKey) => string;
};

export function ScanPreferences({
  radiusKm,
  availableRadii,
  disabled,
  onRadiusChange,
  t,
}: ScanPreferencesProps) {
  return (
    <details className="group rounded-2xl border border-border-soft bg-surface px-4 py-3">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-2 text-sm font-medium">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" aria-hidden />
          {t("scan.preferences.title")}
        </span>
        <span className="text-xs text-muted-foreground">{t("scan.preferences.optional")}</span>
      </summary>
      <div className="stack-2 pt-3">
        <label className="stack-1 text-sm font-medium" htmlFor="scan-radius">
          <span>{t("scan.radius")}</span>
          <select
            id="scan-radius"
            value={radiusKm}
            onChange={(event) => onRadiusChange(Number(event.target.value) as ScanRadiusKm)}
            disabled={disabled}
            className="min-h-12 w-full rounded-xl border border-border bg-background px-3 text-sm font-normal text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          >
            {availableRadii.map((radius) => (
              <option key={radius} value={radius}>
                {radius} {t("scan.radius.unit")}
              </option>
            ))}
          </select>
        </label>
        <p className="text-xs leading-relaxed text-muted-foreground">{t("scan.preferences.radiusNote")}</p>
      </div>
    </details>
  );
}
