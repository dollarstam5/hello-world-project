import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import type { ScanCandidateAssessment, ScanQuery, ScanResult } from "@eco/core-contracts";
import { buildScanSourceEvidence, interpretScanRequest, selectScanResults } from "@eco/core-logic";
import { scanNearby } from "../api/scan.functions";
import { subscribeToFlashChanges } from "../services/scan-realtime.service";
import { useScanHistory } from "./useScanHistory";


export function useScan() {
  const run = useServerFn(scanNearby);
  const runRef = useRef(run);
  const queryRef = useRef<ScanQuery | undefined>(undefined);
  const inFlightRef = useRef(false);
  const [rows, setRows] = useState<ScanResult[]>([]);
  const [assessments, setAssessments] = useState<ScanCandidateAssessment[]>([]);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const { history, addEntry, clearHistory } = useScanHistory();

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
        const sourceRows = await runRef.current({ data: query });
        const interpretation = interpretScanRequest(query.text);
        const evidencedRows = sourceRows.map((row) => ({
          ...row,
          evidence: buildScanSourceEvidence(row, interpretation),
        }));
        const nextAssessments = selectScanResults(evidencedRows, interpretation);
        const nextRows = nextAssessments.map((assessment) => assessment.result);
        setRows(nextRows);
        setAssessments(nextAssessments);
        if (options.recordHistory !== false) {
          addEntry(nextRows.length);
        }
      } catch {
        setFailed(true);
      } finally {
        inFlightRef.current = false;
        setBusy(false);
      }
    },
    [addEntry],
  );

  useEffect(
    () =>
      subscribeToFlashChanges(() => {
        const query = queryRef.current;
        if (query) void execute(query, { recordHistory: false });
      }),
    [execute],
  );

  return { rows, assessments, busy, failed, execute, history, clearHistory };
}
