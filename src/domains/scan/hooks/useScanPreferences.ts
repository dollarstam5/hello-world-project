import { useState } from "react";

const SCAN_RADII_KM = [1, 2] as const;
export type ScanRadiusKm = (typeof SCAN_RADII_KM)[number];

export function useScanPreferences() {
  const [radiusKm, setRadiusKm] = useState<ScanRadiusKm>(1);

  return {
    radiusKm,
    setRadiusKm,
    availableRadii: SCAN_RADII_KM,
  };
}
