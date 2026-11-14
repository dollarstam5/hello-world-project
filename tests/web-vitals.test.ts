import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getWebVitalsSnapshot,
  resetWebVitalsSnapshot,
  startWebVitalsMonitoring,
  publishWebVitalMetric,
} from "@/lib/performance/web-vitals";

const originalObserver = globalThis.PerformanceObserver;
const originalInteractionCount = Object.getOwnPropertyDescriptor(performance, "interactionCount");

afterEach(() => {
  Object.defineProperty(globalThis, "PerformanceObserver", {
    configurable: true,
    value: originalObserver,
  });
  if (originalInteractionCount) {
    Object.defineProperty(performance, "interactionCount", originalInteractionCount);
  } else {
    Reflect.deleteProperty(performance, "interactionCount");
  }
  resetWebVitalsSnapshot();
});

function installPerformanceObserverMock() {
  const observers: Array<{
    type: string;
    options: PerformanceObserverInit;
    callback: PerformanceObserverCallback;
    disconnect: ReturnType<typeof vi.fn>;
  }> = [];

  class MockPerformanceObserver {
    private readonly disconnectMock = vi.fn();

    constructor(private readonly callback: PerformanceObserverCallback) {}

    observe(options: PerformanceObserverInit) {
      observers.push({
        type: options.type ?? "",
        options,
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

  const emit = (type: string, entries: PerformanceEntry[]) => {
    const observer = observers.find((observer) => observer.type === type);
    expect(observer).toBeDefined();
    observer?.callback(
      { getEntries: () => entries } as PerformanceObserverEntryList,
      {} as PerformanceObserver,
    );
  };

  return { observers, emit };
}

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

  it("publishes metrics as a browser event without requiring a remote telemetry service", () => {
    const listener = vi.fn();
    window.addEventListener("vitalis:web-vital", listener);

    const metric = { name: "LCP" as const, value: 1200, navigationType: "navigate" };
    publishWebVitalMetric(metric);

    expect(listener).toHaveBeenCalledTimes(1);
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual(metric);
    window.removeEventListener("vitalis:web-vital", listener);
  });

  it("records observed LCP, CLS, and INP metrics and disconnects observers", () => {
    resetWebVitalsSnapshot();
    const sink = vi.fn();
    const { observers, emit } = installPerformanceObserverMock();

    const stop = startWebVitalsMonitoring(sink);
    expect(observers.map((observer) => observer.type)).toEqual([
      "largest-contentful-paint",
      "layout-shift",
      "event",
    ]);
    expect(observers.find((observer) => observer.type === "event")?.options.durationThreshold).toBe(
      16,
    );

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

  it("groups event entries by interactionId and uses the longest event duration", () => {
    const { emit } = installPerformanceObserverMock();
    const stop = startWebVitalsMonitoring(vi.fn());

    emit("event", [
      { duration: 220, interactionId: 7 } as PerformanceEntry,
      { duration: 180, interactionId: 7 } as PerformanceEntry,
      { duration: 190, interactionId: 8 } as PerformanceEntry,
      { duration: 500, interactionId: 0 } as PerformanceEntry,
    ]);

    expect(getWebVitalsSnapshot().INP?.value).toBe(220);
    stop();
  });

  it("ignores one worst interaction for every 50 page interactions", () => {
    Object.defineProperty(performance, "interactionCount", {
      configurable: true,
      value: 50,
    });
    const { emit } = installPerformanceObserverMock();
    const stop = startWebVitalsMonitoring(vi.fn());

    const entries = Array.from({ length: 50 }, (_, index) => ({
      duration: index + 16,
      interactionId: index + 1,
    })) as PerformanceEntry[];

    emit("event", entries);

    expect(getWebVitalsSnapshot().INP?.value).toBe(64);
    stop();
  });
});
