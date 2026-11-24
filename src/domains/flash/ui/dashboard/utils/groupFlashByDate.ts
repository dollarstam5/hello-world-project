import type { FlashRecord } from "@eco/core-contracts";
import type { MessageKey } from "@/lib/i18n/messages";
import type { FlashTimelineGroup, FlashTimelineGroupKey } from "../types/flashDashboard.types";

function startOfDay(value: number): number {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function shiftCalendarDays(value: number, days: number): number {
  const date = new Date(value);
  date.setDate(date.getDate() + days);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function startOfWeek(value: number): number {
  const date = new Date(value);
  const mondayOffset = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - mondayOffset);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

/** Groups Flash records into the dashboard's fixed chronological buckets. */
export function groupFlashByDate(records: FlashRecord[], now = Date.now()): FlashTimelineGroup[] {
  const today = startOfDay(now);
  const thisWeekStart = startOfWeek(today);
  const lastWeekStart = shiftCalendarDays(thisWeekStart, -7);
  const twoDaysAgoStart = shiftCalendarDays(today, -2);

  const definitions: Array<{
    key: FlashTimelineGroupKey;
    label: MessageKey;
    predicate: (record: FlashRecord) => boolean;
  }> = [
    {
      key: "today",
      label: "flash.mine.period.today",
      predicate: (r) => startOfDay(r.createdAt) === today,
    },
    {
      key: "yesterday",
      label: "flash.mine.period.yesterday",
      predicate: (r) => startOfDay(r.createdAt) === shiftCalendarDays(today, -1),
    },
    {
      key: "twoDays",
      label: "flash.mine.period.twoDays",
      predicate: (r) => startOfDay(r.createdAt) === shiftCalendarDays(today, -2),
    },
    {
      key: "week",
      label: "flash.mine.period.week",
      predicate: (r) =>
        startOfDay(r.createdAt) >= thisWeekStart && startOfDay(r.createdAt) < twoDaysAgoStart,
    },
    {
      key: "lastWeek",
      label: "flash.mine.period.lastWeek",
      predicate: (r) =>
        startOfDay(r.createdAt) >= lastWeekStart &&
        startOfDay(r.createdAt) < thisWeekStart &&
        startOfDay(r.createdAt) < twoDaysAgoStart,
    },
    {
      key: "older",
      label: "flash.mine.period.older",
      predicate: (r) => startOfDay(r.createdAt) < lastWeekStart,
    },
  ];

  return definitions
    .map(({ key, label, predicate }) => ({
      key,
      label,
      items: records.filter(predicate).sort((a, b) => b.createdAt - a.createdAt),
    }))
    .filter((group) => group.items.length > 0);
}
