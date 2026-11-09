/**
 * Compatibility exports for the canonical Web Vitals collector.
 * Keep metric observation and snapshot state in one implementation.
 */
export {
  getWebVitalsSnapshot,
  resetWebVitalsSnapshot,
  startWebVitalsMonitoring,
} from "@/lib/performance/web-vitals";
