import { afterEach, describe, expect, it, vi } from "vitest";
import {
  completeNavigationMeasurement,
  PERFORMANCE_INTERACTION_EVENT,
  PERFORMANCE_NAVIGATION_EVENT,
  resetNavigationMeasurement,
  startInteractionMonitoring,
  startNavigationMeasurement,
} from "@/lib/performance/interaction-navigation";

const originalObserver = globalThis.PerformanceObserver;

afterEach(() => {
  Object.defineProperty(globalThis, "PerformanceObserver", {
    configurable: true,
    value: originalObserver,
  });
  resetNavigationMeasurement();
  vi.restoreAllMocks();
});

function installEventObserverMock() {
  let callback: PerformanceObserverCallback | undefined;
  const disconnect = vi.fn();

  class MockPerformanceObserver {
    constructor(nextCallback: PerformanceObserverCallback) {
      callback = nextCallback;
    }
    observe = vi.fn();
    disconnect = disconnect;
  }

  Object.defineProperty(globalThis, "PerformanceObserver", {
    configurable: true,
    value: MockPerformanceObserver,
  });

  return {
    disconnect,
    emit(entries: PerformanceEntry[]) {
      callback?.(
        { getEntries: () => entries } as PerformanceObserverEntryList,
        {} as PerformanceObserver,
      );
    },
  };
}

describe("PERF-003 interaction and navigation metrics", () => {
  it("groups event entries by interaction and publishes only the longest duration", () => {
    const observer = installEventObserverMock();
    const listener = vi.fn();
    window.addEventListener(PERFORMANCE_INTERACTION_EVENT, listener);
    const stop = startInteractionMonitoring(() => "/flash");

    observer.emit([
      { name: "click", duration: 140, interactionId: 10 } as PerformanceEntry,
      { name: "click", duration: 110, interactionId: 10 } as PerformanceEntry,
      { name: "keydown", duration: 90, interactionId: 11 } as PerformanceEntry,
      { name: "pointermove", duration: 500, interactionId: 12 } as PerformanceEntry,
      { name: "click", duration: 600, interactionId: 0 } as PerformanceEntry,
    ]);

    expect(listener).toHaveBeenCalledTimes(2);
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual({
      duration: 140,
      eventType: "click",
      routeId: "/flash",
    });
    expect((listener.mock.calls[1][0] as CustomEvent).detail).toEqual({
      duration: 90,
      eventType: "keydown",
      routeId: "/flash",
    });

    stop();
    expect(observer.disconnect).toHaveBeenCalledTimes(1);
    window.removeEventListener(PERFORMANCE_INTERACTION_EVENT, listener);
  });

  it("ignores unsupported browsers without throwing", () => {
    Object.defineProperty(globalThis, "PerformanceObserver", {
      configurable: true,
      value: undefined,
    });

    expect(startInteractionMonitoring(() => "/")).toBeTypeOf("function");
  });

  it("measures same-origin link navigation when the router resolves the next route", () => {
    let currentTime = 100;
    vi.spyOn(performance, "now").mockImplementation(() => currentTime);

    const listener = vi.fn();
    window.addEventListener(PERFORMANCE_NAVIGATION_EVENT, listener);

    const stop = startNavigationMeasurement();
    completeNavigationMeasurement("/");
    const anchor = document.createElement("a");
    anchor.href = "/flash";
    document.body.append(anchor);
    anchor.dispatchEvent(new MouseEvent("click", { bubbles: true, button: 0 }));
    currentTime = 245;

    completeNavigationMeasurement("/flash");

    expect(listener).toHaveBeenCalledTimes(1);
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual({
      duration: 145,
      fromRoute: "/",
      toRoute: "/flash",
    });

    stop();
    anchor.remove();
    window.removeEventListener(PERFORMANCE_NAVIGATION_EVENT, listener);
  });

  it("measures transitions within the same dynamic route pattern", () => {
    let currentTime = 300;
    vi.spyOn(performance, "now").mockImplementation(() => currentTime);

    const listener = vi.fn();
    window.addEventListener(PERFORMANCE_NAVIGATION_EVENT, listener);
    const stop = startNavigationMeasurement();

    completeNavigationMeasurement("/profiles/$profileId");
    const anchor = document.createElement("a");
    anchor.href = "/profiles/next";
    document.body.append(anchor);
    anchor.dispatchEvent(new MouseEvent("click", { bubbles: true, button: 0 }));
    currentTime = 390;
    completeNavigationMeasurement("/profiles/$profileId");

    expect(listener).toHaveBeenCalledTimes(1);
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual({
      duration: 90,
      fromRoute: "/profiles/$profileId",
      toRoute: "/profiles/$profileId",
    });

    stop();
    anchor.remove();
    window.removeEventListener(PERFORMANCE_NAVIGATION_EVENT, listener);
  });

  it("does not publish a navigation metric for the initial route or unchanged route", () => {
    const listener = vi.fn();
    window.addEventListener(PERFORMANCE_NAVIGATION_EVENT, listener);

    completeNavigationMeasurement("/");
    completeNavigationMeasurement("/");
    expect(listener).not.toHaveBeenCalled();

    window.removeEventListener(PERFORMANCE_NAVIGATION_EVENT, listener);
  });
});
