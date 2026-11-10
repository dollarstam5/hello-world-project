import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearScanHistory,
  readScanHistory,
  recordScanHistory,
} from "@/domains/scan/services/scan-history.service";

describe("device-only Scan history", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("stores only the search date and result count", () => {
    vi.spyOn(Date, "now").mockReturnValue(1_800_000_000_000);

    expect(recordScanHistory(3)).toEqual([{ searchedAt: 1_800_000_000_000, resultCount: 3 }]);
    const stored = localStorage.getItem("vitalis.scan.history.v1") ?? "";

    expect(stored).toContain("searchedAt");
    expect(stored).toContain("resultCount");
    expect(stored).not.toContain("latitude");
    expect(stored).not.toContain("longitude");
    expect(stored).not.toContain("areaLabel");
  });

  it("keeps at most ten recent entries", () => {
    for (let count = 0; count < 12; count += 1) {
      vi.spyOn(Date, "now").mockReturnValue(1_800_000_000_000 + count);
      recordScanHistory(count);
    }

    expect(readScanHistory()).toHaveLength(10);
    expect(readScanHistory()[0].resultCount).toBe(11);
  });

  it("ignores invalid stored data and clears the history", () => {
    localStorage.setItem("vitalis.scan.history.v1", "{invalid");
    expect(readScanHistory()).toEqual([]);

    recordScanHistory(0);
    clearScanHistory();
    expect(readScanHistory()).toEqual([]);
  });

  it("does not store negative or non-integer result counts", () => {
    expect(recordScanHistory(-1)).toEqual([]);
    expect(recordScanHistory(1.5)).toEqual([]);
    expect(localStorage.getItem("vitalis.scan.history.v1")).toBeNull();
  });
});
