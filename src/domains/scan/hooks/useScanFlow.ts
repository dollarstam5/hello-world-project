import { useState } from "react";
import { useScan } from "./useScan";
import { useScanLocation } from "./useScanLocation";
import { useScanPreferences } from "./useScanPreferences";
import { useScanStatus } from "./useScanStatus";

const SCAN_LIMIT = 20;

export function useScanFlow() {
  const scan = useScan();
  const location = useScanLocation();
  const preferences = useScanPreferences();
  const [started, setStarted] = useState(false);
  const [needText, setNeedText] = useState("");

  const status = useScanStatus({
    started,
    locating: location.locating,
    busy: scan.busy,
    unsupported: location.unsupported,
    locationError: location.locationError,
    failed: scan.failed,
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
    ...scan,
    ...location,
    ...preferences,
    needText,
    setNeedText,
    started,
    status,
    start,
  };
}
