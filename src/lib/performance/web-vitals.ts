export type WebVitalName = "LCP" | "INP" | "CLS";

/** Browser event emitted for each accepted Web Vital observation. */
export const WEB_VITAL_EVENT = "vitalis:web-vital";

/**
 * Publishes a metric to the current page without sending telemetry over the network
 * or persisting user data. Runtime diagnostics can subscribe to WEB_VITAL_EVENT.
 */
export function publishWebVitalMetric(metric: WebVitalMetric): void {
  if (typeof window === "undefined" || typeof window.dispatchEvent !== "function") {
    return;
  }

  window.dispatchEvent(new CustomEvent<WebVitalMetric>(WEB_VITAL_EVENT, { detail: metric }));
}

export interface WebVitalMetric {
  name: WebVitalName;
  value: number;
  navigationType: string;
}

export type WebVitalsSink = (metric: WebVitalMetric) => void;

let latestMetrics: Partial<Record<WebVitalName, WebVitalMetric>> = {};

function record(metric: WebVitalMetric, sink: WebVitalsSink): void {
  if (!Number.isFinite(metric.value) || metric.value < 0) {
    return;
  }
  latestMetrics = { ...latestMetrics, [metric.name]: metric };
  sink(metric);
}

export function getWebVitalsSnapshot(): Partial<Record<WebVitalName, WebVitalMetric>> {
  return { ...latestMetrics };
}

export function resetWebVitalsSnapshot(): void {
  latestMetrics = {};
}

function navigationType(): string {
  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
  return navigation?.type ?? "unknown";
}

interface InteractionCandidate {
  duration: number;
}

/**
 * Returns the INP candidate using the 98th-percentile interaction rank:
 * the worst interaction for fewer than 50 interactions, then one fewer
 * worst interaction for each additional group of 50.
 */
function getInpCandidate(
  interactions: Map<number, InteractionCandidate>,
  interactionCount: number,
): number | undefined {
  if (interactions.size === 0) {
    return undefined;
  }

  const ranked = [...interactions.values()].sort((a, b) => b.duration - a.duration);
  const percentileIndex = Math.floor(interactionCount / 50);
  // Event Timing only reports entries at or above the 16 ms minimum threshold.
  // If the percentile falls below the observed candidates, its value is therefore <16 ms.
  return ranked[percentileIndex]?.duration ?? 16;
}

function getPageInteractionCount(fallbackCount: number): number {
  const count = (performance as Performance & { interactionCount?: number }).interactionCount;
  return typeof count === "number" && Number.isFinite(count) && count >= 0
    ? Math.max(fallbackCount, count)
    : fallbackCount;
}

export function startWebVitalsMonitoring(sink: WebVitalsSink): () => void {
  if (typeof window === "undefined" || typeof PerformanceObserver === "undefined") {
    return () => undefined;
  }

  const observers: PerformanceObserver[] = [];
  let stopped = false;

  const observe = (
    type: string,
    handler: (entries: PerformanceEntryList) => void,
    options?: PerformanceObserverInit,
  ) => {
    try {
      const observer = new PerformanceObserver((list) => {
        if (!stopped) {
          handler(list.getEntries());
        }
      });
      observer.observe(options ? { type, ...options } : { type, buffered: true });
      observers.push(observer);
    } catch {
      // Unsupported PerformanceObserver entry types are ignored.
    }
  };

  observe("largest-contentful-paint", (entries) => {
    const entry = entries.at(-1);
    if (entry) {
      record({ name: "LCP", value: entry.startTime, navigationType: navigationType() }, sink);
    }
  });

  let clsValue = 0;
  let clsSessionValue = 0;
  let clsSessionStart = 0;
  let clsSessionLast = 0;

  observe("layout-shift", (entries) => {
    for (const entry of entries as PerformanceEntry[]) {
      const shift = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
      if (shift.hadRecentInput || !Number.isFinite(shift.value)) {
        continue;
      }

      const timestamp = entry.startTime;
      if (
        clsSessionStart === 0 ||
        timestamp - clsSessionLast > 1_000 ||
        timestamp - clsSessionStart > 5_000
      ) {
        clsSessionStart = timestamp;
        clsSessionValue = 0;
      }

      clsSessionValue += shift.value ?? 0;
      clsSessionLast = timestamp;
      clsValue = Math.max(clsValue, clsSessionValue);
      record({ name: "CLS", value: clsValue, navigationType: navigationType() }, sink);
    }
  });

  const interactions = new Map<number, InteractionCandidate>();
  const observedInteractionIds = new Set<number>();

  observe(
    "event",
    (entries) => {
      for (const entry of entries as PerformanceEntry[]) {
        const event = entry as PerformanceEntry & {
          duration?: number;
          interactionId?: number;
        };
        const interactionId = event.interactionId;
        const duration = event.duration;

        if (
          !interactionId ||
          !Number.isFinite(interactionId) ||
          !Number.isFinite(duration) ||
          (duration ?? 0) < 0
        ) {
          continue;
        }

        observedInteractionIds.add(interactionId);
        const current = interactions.get(interactionId);
        if (!current || (duration ?? 0) > current.duration) {
          interactions.set(interactionId, { duration: duration ?? 0 });
        }
      }

      const interactionCount = getPageInteractionCount(observedInteractionIds.size);
      const inp = getInpCandidate(interactions, interactionCount);
      if (inp !== undefined) {
        record({ name: "INP", value: inp, navigationType: navigationType() }, sink);
      }
    },
    { buffered: true, durationThreshold: 16 },
  );

  const stop = () => {
    if (stopped) {
      return;
    }
    stopped = true;
    for (const observer of observers) {
      observer.disconnect();
    }
    interactions.clear();
    observedInteractionIds.clear();
  };

  return stop;
}
