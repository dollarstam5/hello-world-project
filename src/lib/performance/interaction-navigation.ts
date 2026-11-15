export const PERFORMANCE_INTERACTION_EVENT = "vitalis:interaction";
export const PERFORMANCE_NAVIGATION_EVENT = "vitalis:navigation";

export interface InteractionPerformanceMetric {
  duration: number;
  eventType: string;
  routeId: string;
}

export interface NavigationPerformanceMetric {
  duration: number;
  fromRoute: string;
  toRoute: string;
}

type MetricSink<T> = (metric: T) => void;

function publish<T>(eventName: string, metric: T, sink?: MetricSink<T>): void {
  sink?.(metric);
  if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
    window.dispatchEvent(new CustomEvent<T>(eventName, { detail: metric }));
  }
}

interface InteractionCandidate {
  duration: number;
  eventType: string;
}

const SUPPORTED_INTERACTION_EVENTS = new Set([
  "click",
  "keydown",
  "pointerdown",
  "pointerup",
  "mousedown",
  "mouseup",
  "touchstart",
  "touchend",
]);

/**
 * Observes browser Event Timing entries and emits one privacy-minimal metric
 * per observed interaction update. No target text, selectors, URLs or user IDs
 * are collected. Interaction IDs stay in memory and are never published.
 */
export function startInteractionMonitoring(
  getRouteId: () => string,
  sink?: MetricSink<InteractionPerformanceMetric>,
): () => void {
  if (typeof window === "undefined" || typeof PerformanceObserver === "undefined") {
    return () => undefined;
  }

  const interactions = new Map<number, InteractionCandidate>();
  let stopped = false;
  let observer: PerformanceObserver;

  try {
    observer = new PerformanceObserver((list) => {
      if (stopped) return;

      for (const entry of list.getEntries()) {
        const event = entry as PerformanceEntry & {
          duration?: number;
          interactionId?: number;
          name?: string;
        };
        const id = event.interactionId;
        const duration = event.duration;
        const eventType = event.name ?? "";

        if (
          !id ||
          !Number.isFinite(id) ||
          !Number.isFinite(duration) ||
          (duration ?? 0) < 0 ||
          !SUPPORTED_INTERACTION_EVENTS.has(eventType)
        ) {
          continue;
        }

        const current = interactions.get(id);
        if (current && current.duration >= (duration ?? 0)) continue;

        const candidate = { duration: duration ?? 0, eventType };
        interactions.delete(id);
        interactions.set(id, candidate);

        publish(
          PERFORMANCE_INTERACTION_EVENT,
          { ...candidate, routeId: getRouteId() },
          sink,
        );

        // Bound memory for long-lived sessions; IDs are transient browser data.
        if (interactions.size > 200) {
          const oldestId = interactions.keys().next().value;
          if (oldestId !== undefined) interactions.delete(oldestId);
        }
      }
    });

    observer.observe({ type: "event", buffered: true, durationThreshold: 16 });
  } catch {
    return () => undefined;
  }

  return () => {
    if (stopped) return;
    stopped = true;
    observer.disconnect();
    interactions.clear();
  };
}

let currentRouteId: string | undefined;
let navigationStartedAt: number | undefined;

/**
 * Starts a timer for same-origin link navigation. Route completion is supplied
 * by the router state so the measurement includes the client-side transition.
 */
export function startNavigationMeasurement(): () => void {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return () => undefined;
  }

  const onClick = (event: MouseEvent) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Element)) return;
    const anchor = target.closest("a[href]");
    if (!(anchor instanceof HTMLAnchorElement)) return;
    if (anchor.target && anchor.target !== "_self") return;
    if (anchor.hasAttribute("download")) return;

    try {
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      if (
        destination.pathname === window.location.pathname &&
        destination.search === window.location.search
      ) {
        return;
      }
      navigationStartedAt = performance.now();
    } catch {
      // Invalid or unsupported destinations are ignored.
    }
  };

  const onPopState = () => {
    navigationStartedAt = performance.now();
  };

  document.addEventListener("click", onClick, true);
  window.addEventListener("popstate", onPopState);

  return () => {
    document.removeEventListener("click", onClick, true);
    window.removeEventListener("popstate", onPopState);
    navigationStartedAt = undefined;
  };
}

/** Completes a pending same-origin navigation when the router resolves a route. */
export function completeNavigationMeasurement(routeId: string): void {
  if (!routeId) return;

  const previousRouteId = currentRouteId;
  currentRouteId = routeId;

  if (
    !previousRouteId ||
    navigationStartedAt === undefined
  ) {
    return;
  }

  const duration = Math.max(0, performance.now() - navigationStartedAt);
  navigationStartedAt = undefined;

  publish<NavigationPerformanceMetric>(PERFORMANCE_NAVIGATION_EVENT, {
    duration,
    fromRoute: previousRouteId,
    toRoute: routeId,
  });
}

/** Resets module state for deterministic tests and isolated app lifecycles. */
export function resetNavigationMeasurement(): void {
  currentRouteId = undefined;
  navigationStartedAt = undefined;
}
