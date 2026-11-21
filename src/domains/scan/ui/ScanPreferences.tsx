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
    <details className="group rounded-xl border border-border-soft bg-surface px-3 py-2.5 sm:rounded-2xl sm:px-4 sm:py-3">
      <summary className="flex min-h-10 cursor-pointer sm:min-h-11 list-none items-center justify-between gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-2 text-sm font-medium">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" aria-hidden />
          {t("scan.preferences.title")}
        </span>
        <span className="text-xs text-muted-foreground">{t("scan.preferences.optional")}</span>
      </summary>
      <div className="stack-2 pt-3">
        <fieldset className="stack-2">
          <legend className="text-sm font-medium">{t("scan.radius")}</legend>
          <div className="grid grid-cols-2 gap-2">
            {availableRadii.map((radius) => (
              <button
                key={radius}
                type="button"
                aria-pressed={radiusKm === radius}
                disabled={disabled}
                onClick={() => onRadiusChange(radius)}
                className={`min-h-12 rounded-xl border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 ${radiusKm === radius ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-background text-foreground hover:bg-muted"}`}
              >
                {radius} {t("scan.radius.unit")}
              </button>
            ))}
          </div>
        </fieldset>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {t("scan.preferences.radiusNote")}
        </p>
      </div>
    </details>
  );
}
