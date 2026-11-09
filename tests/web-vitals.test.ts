import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getWebVitalsSnapshot,
  resetWebVitalsSnapshot,
  startWebVitalsMonitoring,
} from "@/lib/performance/web-vitals";

const originalObserver = globalThis.PerformanceObserver;

afterEach(() => {
  Object.defineProperty(globalThis, "PerformanceObserver", {
    configurable: true,
    value: originalObserver,
  });
  resetWebVitalsSnapshot();
});

describe("real Web Vitals monitoring", () => {
  it("is browser-safe when PerformanceObserver is unavailable", () => {
    Object.defineProperty(globalThis, "PerformanceObserver", {
      configurable: true,
      value: undefined,
    });

    const sink = vi.fn();
    expect(startWebVitalsMonitoring(sink)).toBeTypeOf("function");
    expect(sink).not.toHaveBeenCalled();
  });

  it("records observed LCP, CLS, and INP metrics and disconnects observers", () => {
    resetWebVitalsSnapshot();
    const sink = vi.fn();
    const observers: Array<{
      type: string;
      callback: PerformanceObserverCallback;
      disconnect: ReturnType<typeof vi.fn>;
    }> = [];

    class MockPerformanceObserver {
      private readonly disconnectMock = vi.fn();

      constructor(private readonly callback: PerformanceObserverCallback) {}

      observe(options: PerformanceObserverInit) {
        observers.push({
          type: options.type ?? "",
          callback: this.callback,
          disconnect: this.disconnectMock,
        });
      }

      disconnect() {
        this.disconnectMock();
      }
    }

    Object.defineProperty(globalThis, "PerformanceObserver", {
      configurable: true,
      value: MockPerformanceObserver,
    });

    const stop = startWebVitalsMonitoring(sink);
    expect(observers.map((observer) => observer.type)).toEqual([
      "largest-contentful-paint",
      "layout-shift",
      "event",
    ]);

    const emit = (type: string, entries: PerformanceEntry[]) => {
      const observer = observers.find((item) => item.type === type);
      expect(observer).toBeDefined();
      observer?.callback(
        { getEntries: () => entries } as PerformanceObserverEntryList,
        {} as PerformanceObserver,
      );
    };

    emit("largest-contentful-paint", [{ startTime: 1200 } as PerformanceEntry]);
    emit("layout-shift", [
      {
        startTime: 1300,
        value: 0.05,
        hadRecentInput: false,
      } as PerformanceEntry,
    ]);
    emit("event", [
      {
        startTime: 1400,
        duration: 180,
        interactionId: 1,
      } as PerformanceEntry,
    ]);

    const snapshot = getWebVitalsSnapshot();
    expect(snapshot.LCP?.value).toBe(1200);
    expect(snapshot.CLS?.value).toBe(0.05);
    expect(snapshot.INP?.value).toBe(180);
    expect(sink).toHaveBeenCalledTimes(3);

    stop();
    expect(observers.every((observer) => observer.disconnect.mock.calls.length === 1)).toBe(true);
  });
});
