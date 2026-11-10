import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import type { ScanQuery, ScanResult } from "@eco/core-contracts";
import { rankScanResults } from "@eco/core-logic";
import { scanNearby } from "../api/scan.functions";
import { subscribeToFlashChanges } from "../services/scan-realtime.service";
import {
  clearScanHistory,
  readScanHistory,
  recordScanHistory,
  type ScanHistoryEntry,
} from "../services/scan-history.service";

export function useScan() {
  const run = useServerFn(scanNearby);
  const runRef = useRef(run);
  const queryRef = useRef<ScanQuery | undefined>(undefined);
  const inFlightRef = useRef(false);
  const [rows, setRows] = useState<ScanResult[]>([]);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);

  useEffect(() => {
    setHistory(readScanHistory());
  }, []);

  useEffect(() => {
    runRef.current = run;
  }, [run]);

  const execute = useCallback(
    async (query: ScanQuery, options: { recordHistory?: boolean } = {}) => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      queryRef.current = query;
      setBusy(true);
      setFailed(false);
      try {
        const nextRows = rankScanResults(await runRef.current({ data: query }));
        setRows(nextRows);
        if (options.recordHistory !== false) {
          setHistory(recordScanHistory(nextRows.length));
        }
      } catch {
        setFailed(true);
      } finally {
        inFlightRef.current = false;
        setBusy(false);
      }
    },
    [],
  );

  useEffect(
    () =>
      subscribeToFlashChanges(() => {
        const query = queryRef.current;
        if (query) void execute(query, { recordHistory: false });
      }),
    [execute],
  );

  const clearHistory = useCallback(() => {
    clearScanHistory();
    setHistory([]);
  }, []);

  return { rows, busy, failed, execute, history, clearHistory };
}
