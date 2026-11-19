import type { ScanLocationError } from "../hooks/useScanLocation";

export type ScanStatus =
  | "idle"
  | "locating"
  | "scanning"
  | "unsupported"
  | "location-error"
  | "scan-error"
  | "empty"
  | "results";

interface ScanStatusInput {
  started: boolean;
  locating: boolean;
  busy: boolean;
  unsupported: boolean;
  locationError: ScanLocationError | null;
  failed: boolean;
  resultCount: number;
}

export function getScanStatus(input: ScanStatusInput): ScanStatus {
  if (input.locating) return "locating";
  if (input.busy) return "scanning";
  if (input.unsupported) return "unsupported";
  if (input.locationError) return "location-error";
  if (input.failed) return "scan-error";
  if (!input.started) return "idle";
  return input.resultCount > 0 ? "results" : "empty";
}
