import { useState } from "react";
import { LocateFixed, ScanLine } from "lucide-react";
import { useI18n } from "@/lib/i18n/useI18n";
import { useScan } from "../hooks/useScan";

const SCAN_RADIUS_KM = 5;
const SCAN_LIMIT = 20;

/**
 * Scan surface: asks for a temporary position, runs one proximity scan,
 * and lists public matches (distance only — never a precise location).
 * Presentation only; scanning logic lives in useScan.
 */
export function ScanPanel() {
  const { t } = useI18n();
  const { rows, busy, failed, execute } = useScan();
  const [locationError, setLocationError] = useState<
    "permission" | "unavailable" | "timeout" | "unknown" | null
  >(null);
  const [started, setStarted] = useState(false);
  const [locating, setLocating] = useState(false);
  const [unsupported, setUnsupported] = useState(false);

  const start = () => {
    setLocationError(null);
    setUnsupported(false);
    setStarted(true);

    if (!navigator.geolocation?.getCurrentPosition) {
      setUnsupported(true);
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        void execute({
          text: "",
          category: null,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          radiusKm: SCAN_RADIUS_KM,
          limit: SCAN_LIMIT,
        });
      },
      (error) => {
        setLocating(false);
        const code =
          error.code === 1
            ? "permission"
            : error.code === 2
              ? "unavailable"
              : error.code === 3
                ? "timeout"
                : "unknown";
        setLocationError(code);
      },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  };

  return (
    <div className="stack-4">
      <p className="text-sm text-muted-foreground">{t("scan.privacy")}</p>

      <button
        type="button"
        onClick={start}
        disabled={busy || locating}
        aria-busy={busy || locating}
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {busy || locating ? (
          <ScanLine className="h-4 w-4 animate-pulse" aria-hidden />
        ) : (
          <LocateFixed className="h-4 w-4" aria-hidden />
        )}
        {busy || locating ? t("scan.busy") : t("scan.start")}
      </button>

      {unsupported && (
        <p className="text-sm text-destructive" role="alert">
          {t("scan.unsupported")}
        </p>
      )}
      {locationError && (
        <p className="text-sm text-destructive" role="alert">
          {t(`scan.location.${locationError}`)}
        </p>
      )}
      {failed && (
        <p className="text-sm text-destructive" role="alert">
          {t("scan.error")}
        </p>
      )}

      {started &&
        !busy &&
        !locating &&
        !locationError &&
        !failed &&
        !unsupported &&
        rows.length === 0 && (
          <p className="text-sm text-muted-foreground" role="status">
            {t("scan.empty")}
          </p>
        )}

      {rows.length > 0 && (
        <ul className="stack-3">
          {rows.map((r) => (
            <li key={r.id} className="rounded-3xl border border-border-soft bg-surface p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-base font-medium">{r.title}</span>
                <span className="shrink-0 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary">
                  {r.distanceKm.toFixed(1)} km
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {t(`flash.kind.${r.kind}`)}
                {" · "}
                {t(`flash.category.${r.category}`)}
                {" · "}
                {t(`flash.slot.${r.timeSlot}`)}
                {" · "}
                {r.areaLabel}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
