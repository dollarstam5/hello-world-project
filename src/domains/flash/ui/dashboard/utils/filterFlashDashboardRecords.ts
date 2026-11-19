import type { FlashRecord, FlashStatus } from "@eco/core-contracts";
import { resolveFlashStatus } from "@eco/core-logic";

export type FlashDashboardStatusFilter = "all" | FlashStatus;
export type FlashDashboardPeriodFilter = "all" | "today" | "week" | "month";
export type FlashDashboardFilters = { query: string; status: FlashDashboardStatusFilter; period: FlashDashboardPeriodFilter };

function getPeriodStart(period: FlashDashboardPeriodFilter, now: Date): number | null {
  if (period === "all") return null;
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  if (period === "week") start.setDate(start.getDate() - 6);
  if (period === "month") start.setDate(start.getDate() - 29);
  return start.getTime();
}

export function filterFlashDashboardRecords(records: FlashRecord[], filters: FlashDashboardFilters, now = new Date()): FlashRecord[] {
  const query = filters.query.trim().toLocaleLowerCase();
  const periodStart = getPeriodStart(filters.period, now);
  return records.filter((record) => {
    if (filters.status !== "all" && resolveFlashStatus(record) !== filters.status) return false;
    if (periodStart !== null && record.createdAt < periodStart) return false;
    if (!query) return true;
    return record.title.toLocaleLowerCase().includes(query) || record.body.toLocaleLowerCase().includes(query);
  });
}
