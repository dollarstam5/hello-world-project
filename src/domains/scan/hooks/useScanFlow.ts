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
  const { clearResults, execute, busy, failed, rows, assessments, history, clearHistory } = scan;
  const { locate, locating, locationError, unsupported } = location;
  const { radiusKm, setRadiusKm, availableRadii } = preferences;
  const [started, setStarted] = useState(false);
  const [needText, setNeedText] = useState("");
  const [stage, setStage] = useState<ScanPreparationStage>("need");

  const updateNeedText = useCallback(
    (value: SetStateAction<string>) => {
      setNeedText((current) => (typeof value === "function" ? value(current) : value));
      setStage("need");
      setStarted(false);
      clearResults();
    },
    [clearResults],
  );

  const updateRadiusKm = useCallback(
    (radius: typeof radiusKm) => {
      setRadiusKm(radius);
      setStarted(false);
      clearResults();
    },
    [setRadiusKm, clearResults],
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
    locating,
    busy,
    failed,
    unsupported,
    locationError,
    resultCount: rows.length,
  });

  const start = useCallback(() => {
    if (stage !== "final" || !needText.trim() || busy || locating) return;
    setStarted(true);
    void locate().then((coordinates) => {
      if (!coordinates) return;
      void execute({
        text: needText.trim(),
        category: null,
        ...coordinates,
        radiusKm,
        limit: SCAN_LIMIT,
      });
    });
  }, [stage, needText, busy, locating, locate, execute, radiusKm]);

  return {
    rows,
    assessments,
    busy,
    history,
    clearHistory,
    locating,
    locationError,
    unsupported,
    radiusKm,
    setRadiusKm: updateRadiusKm,
    availableRadii,
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
