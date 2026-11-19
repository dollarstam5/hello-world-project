import { useMemo, useState } from "react";
import type { FlashRecord } from "@eco/core-contracts";
import {
  filterFlashDashboardRecords,
  type FlashDashboardFilters,
  type FlashDashboardPeriodFilter,
  type FlashDashboardStatusFilter,
} from "../utils/filterFlashDashboardRecords";

export function useFlashDashboardFilters(records: FlashRecord[]) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<FlashDashboardStatusFilter>("all");
  const [period, setPeriod] = useState<FlashDashboardPeriodFilter>("all");
  const filteredRecords = useMemo(
    () => filterFlashDashboardRecords(records, { query, status, period } satisfies FlashDashboardFilters),
    [records, query, status, period],
  );
  const hasActiveFilters = query.trim().length > 0 || status !== "all" || period !== "all";
  function resetFilters() {
    setQuery("");
    setStatus("all");
    setPeriod("all");
  }
  return { query, setQuery, status, setStatus, period, setPeriod, filteredRecords, hasActiveFilters, resetFilters };
}
