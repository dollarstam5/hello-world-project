import { useCallback, useEffect, useState } from "react";
import {
  clearScanHistory as clearStoredHistory,
  readScanHistory,
  recordScanHistory,
  type ScanHistoryEntry,
} from "../services/scan-history.service";

export function useScanHistory() {
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);

  useEffect(() => {
    setHistory(readScanHistory());
  }, []);

  const addEntry = useCallback((resultCount: number) => {
    setHistory(recordScanHistory(resultCount));
  }, []);

  const clearHistory = useCallback(() => {
    clearStoredHistory();
    setHistory([]);
  }, []);

  return { history, addEntry, clearHistory };
}
