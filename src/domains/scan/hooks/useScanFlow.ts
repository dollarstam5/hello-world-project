import { useCallback, useState, type SetStateAction } from "react";
import { useScan } from "./useScan";
import { useScanLocation } from "./useScanLocation";
import { useScanPreferences } from "./useScanPreferences";
import { getScanStatus } from "../utils/scanStatus";

const SCAN_LIMIT = 20;
export type ScanPreparationStage = "need" | "confirmation" | "criteria" | "final";

export function useScanFlow() {
  const scan = useScan();
  const location = useScanLocation();
  const preferences = useScanPreferences();
  const [started, setStarted] = useState(false);
  const [needText, setNeedText] = useState("");
  const [stage, setStage] = useState<ScanPreparationStage>("need");

  const updateNeedText = useCallback(
    (value: SetStateAction<string>) => {
      setNeedText(current => typeof value === "function" ? value(current) : value);
      setStage("need");
      setStarted(false);
      scan.clearResults();
    },
    [scan.clearResults],
  );

  const updateRadiusKm = useCallback(
    (radius: typeof preferences.radiusKm) => {
      preferences.setRadiusKm(radius);
      setStarted(false);
      scan.clearResults();
    },
    [preferences.setRadiusKm, scan.clearResults],
  );

  const confirmNeed = useCallback(() => {
    if (needText.trim()) setStage("confirmation");
  }, [needText]);

  const confirmInterpretation = useCallback(() => setStage("criteria"), []);

  const confirmCriteria = useCallback(() => setStage("final"), []);
  const backToNeed = useCallback(() => setStage("need"), []);
  const backToCriteria = useCallback(() => setStage("criteria"), []);

  const status = getScanStatus({
    started,
    locating: location.locating,
    busy: scan.busy,
    failed: scan.failed,
    unsupported: location.unsupported,
    locationError: location.locationError,
    resultCount: scan.rows.length,
  });

  const start = useCallback(() => {
    if (stage !== "final" || !needText.trim() || scan.busy || location.locating) return;
    setStarted(true);
    void location.locate().then((coordinates) => {
      if (!coordinates) return;
      void scan.execute({
        text: needText.trim(),
        category: null,
        ...coordinates,
        radiusKm: preferences.radiusKm,
        limit: SCAN_LIMIT,
      });
    });
  }, [
    stage,
    needText,
    scan.busy,
    location.locating,
    location.locate,
    scan.execute,
    preferences.radiusKm,
  ]);

  return {
    rows: scan.rows,
    assessments: scan.assessments,
    busy: scan.busy,
    history: scan.history,
    clearHistory: scan.clearHistory,
    locating: location.locating,
    locationError: location.locationError,
    unsupported: location.unsupported,
    radiusKm: preferences.radiusKm,
    setRadiusKm: updateRadiusKm,
    availableRadii: preferences.availableRadii,
    needText,
    setNeedText: updateNeedText,
    stage,
    confirmNeed,
    confirmInterpretation,
    confirmCriteria,
    backToNeed,
    backToCriteria,
    status,
    start,
  };
}
