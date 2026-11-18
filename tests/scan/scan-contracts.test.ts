import { describe, expect, it } from "vitest";
import type {
  ScanSearchContinuation,
  ScanSearchPage,
  ScanSearchPageRequest,
} from "../../packages/core-contracts/src/scan";

describe("Scan paged-search contracts", () => {
  it("represents an exhausted search without a continuation cursor", () => {
    const continuation = { status: "exhausted" } satisfies ScanSearchContinuation;
    const page = {
      items: [{ id: "flash-1" }],
      examinedCount: 12,
      completeness: "complete",
      continuation,
    } satisfies ScanSearchPage<{ id: string }>;

    expect(page.completeness).toBe("complete");
    expect(page.continuation.status).toBe("exhausted");
    expect(page.examinedCount).toBeGreaterThanOrEqual(page.items.length);
  });

  it("represents a bounded partial search that can safely resume", () => {
    const continuation = {
      status: "available",
      cursor: "opaque-server-cursor",
    } satisfies ScanSearchContinuation;
    const page = {
      items: [{ id: "flash-2" }],
      examinedCount: 25,
      completeness: "partial",
      continuation,
    } satisfies ScanSearchPage<{ id: string }>;

    expect(page.completeness).toBe("partial");
    expect(page.continuation.status).toBe("available");
    if (page.continuation.status === "available") {
      expect(page.continuation.cursor).toBeTruthy();
    }
  });

  it("allows a request to resume without changing the original query contract", () => {
    const request = {
      query: {
        text: "aide au déménagement",
        category: null,
        latitude: 4.0511,
        longitude: 9.7679,
        radiusKm: 5,
        limit: 50,
      },
      pageSize: 20,
      cursor: "opaque-server-cursor",
    } satisfies ScanSearchPageRequest;

    expect(request.pageSize).toBe(20);
    expect(request.cursor).toBe("opaque-server-cursor");
    expect(request.query.limit).toBe(50);
  });

  it("can report a partial result when the candidate budget is reached", () => {
    const continuation = {
      status: "budget_reached",
    } satisfies ScanSearchContinuation;

    expect(continuation.status).toBe("budget_reached");
  });

  it("can report an unavailable source without pretending the search is complete", () => {
    const page = {
      items: [],
      examinedCount: 0,
      completeness: "partial",
      continuation: { status: "source_unavailable" },
    } satisfies ScanSearchPage<{ id: string }>;

    expect(page.completeness).toBe("partial");
    expect(page.continuation.status).toBe("source_unavailable");
  });
});
