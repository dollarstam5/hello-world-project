import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { registerServiceWorker } from "@/platform/pwa";
import { publishWebVitalMetric, startWebVitalsMonitoring } from "@/lib/performance/web-vitals";
import {
  completeNavigationMeasurement,
  startInteractionMonitoring,
  startNavigationMeasurement,
} from "@/lib/performance/interaction-navigation";

/**
 * Root lifecycle orchestration: service worker, Web Vitals, interaction/navigation
 * monitoring, and route-change measurement. Cleanup mirrors each started service.
 */
export function useRootLifecycle() {
  const routeId = useRouterState({ select: (state) => state.matches.at(-1)?.routeId ?? "/" });
  const locationKey = useRouterState({
    select: (state) => state.location.pathname + state.location.searchStr,
  });
  const routeIdRef = useRef(routeId);
  routeIdRef.current = routeId;

  useEffect(() => {
    registerServiceWorker();
    const stopWebVitals = startWebVitalsMonitoring(publishWebVitalMetric);
    const stopInteractions = startInteractionMonitoring(() => routeIdRef.current);
    const stopNavigation = startNavigationMeasurement();

    return () => {
      stopWebVitals();
      stopInteractions();
      stopNavigation();
    };
  }, []);

  useEffect(() => {
    completeNavigationMeasurement(routeId);
  }, [routeId, locationKey]);
}
