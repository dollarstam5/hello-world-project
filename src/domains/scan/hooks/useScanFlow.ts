import { useCallback, useState } from "react";
import { useScan } from "./useScan";
import { useScanLocation } from "./useScanLocation";
import { useScanPreferences } from "./useScanPreferences";
import { getScanStatus } from "../utils/scanStatus";

const SCAN_LIMIT = 20;

export function useScanFlow() {
  const scan = useScan();
  const location = useScanLocation();
  const preferences = useScanPreferences();
  const [started, setStarted] = useState(false);
  const [needText, setNeedText] = useState("");

  const updateNeedText = useCallback((value: string) => {
    setNeedText(value);
    setStarted(false);
    scan.clearResults();
  }, [scan.clearResults]);

  const status = getScanStatus({
    started,
    locating: location.locating,
    busy: scan.busy,
    failed: scan.failed,
    unsupported: location.unsupported,
    locationError: location.locationError,
    resultCount: scan.rows.length,
  });

  const start = () => {
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
  };

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
    setRadiusKm: preferences.setRadiusKm,
    availableRadii: preferences.availableRadii,
    needText,
    setNeedText: updateNeedText,
    status,
    start,
  };
}
