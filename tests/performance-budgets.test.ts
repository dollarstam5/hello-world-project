import { describe, expect, it } from "vitest";
import {
  assertPerformanceBudgets,
  type PerformanceBudgetResult,
} from "@/lib/performance/performance-budget-policy";

describe("performance budgets", () => {
  const withinBudgets: PerformanceBudgetResult = {
    initialJavaScriptGzipKb: 100,
    initialCssGzipKb: 20,
    criticalResourcesGzipKb: 250,
  };

  it("accepts measurements inside all budgets", () => {
    expect(() => assertPerformanceBudgets(withinBudgets)).not.toThrow();
  });

  it("rejects a critical JavaScript budget regression", () => {
    expect(() =>
      assertPerformanceBudgets({ ...withinBudgets, initialJavaScriptGzipKb: 251 }),
    ).toThrow(/initial JavaScript gzip/);
  });

  it("rejects non-finite measurements instead of silently passing", () => {
    expect(() =>
      assertPerformanceBudgets({ ...withinBudgets, initialCssGzipKb: Number.NaN }),
    ).toThrow(/finite, non-negative number/);
  });

  it("rejects negative measurements", () => {
    expect(() =>
      assertPerformanceBudgets({ ...withinBudgets, criticalResourcesGzipKb: -1 }),
    ).toThrow(/finite, non-negative number/);
  });
});
