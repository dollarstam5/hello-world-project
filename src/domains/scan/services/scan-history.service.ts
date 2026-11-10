export interface ScanHistoryEntry {
  searchedAt: number;
  resultCount: number;
}

const STORAGE_KEY = "vitalis.scan.history.v1";
const HISTORY_LIMIT = 10;

/** Keeps a small, device-only record. Coordinates and result details are never stored. */
export function readScanHistory(): ScanHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (entry): entry is ScanHistoryEntry =>
          typeof entry === "object" &&
          entry !== null &&
          typeof entry.searchedAt === "number" &&
          Number.isFinite(entry.searchedAt) &&
          typeof entry.resultCount === "number" &&
          Number.isInteger(entry.resultCount) &&
          entry.resultCount >= 0,
      )
      .slice(0, HISTORY_LIMIT);
  } catch {
    return [];
  }
}

export function recordScanHistory(resultCount: number): ScanHistoryEntry[] {
  if (!Number.isInteger(resultCount) || resultCount < 0) return readScanHistory();
  const next = [
    { searchedAt: Date.now(), resultCount },
    ...readScanHistory(),
  ].slice(0, HISTORY_LIMIT);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // A full or unavailable device store must not prevent Scan from working.
  }
  return next;
}

export function clearScanHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Clearing local history is best-effort when device storage is unavailable.
  }
}
