import { useCallback, useState } from "react";

export type ScanLocationError = "permission" | "unavailable" | "timeout" | "unknown";

export interface ScanCoordinates {
  latitude: number;
  longitude: number;
}

export function useScanLocation() {
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<ScanLocationError | null>(null);
  const [unsupported, setUnsupported] = useState(false);

  const locate = useCallback((): Promise<ScanCoordinates | null> => {
    setLocationError(null);
    setUnsupported(false);

    if (!navigator.geolocation?.getCurrentPosition) {
      setUnsupported(true);
      return Promise.resolve(null);
    }

    setLocating(true);
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocating(false);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setLocating(false);
          const code: ScanLocationError =
            error.code === 1
              ? "permission"
              : error.code === 2
                ? "unavailable"
                : error.code === 3
                  ? "timeout"
                  : "unknown";
          setLocationError(code);
          resolve(null);
        },
        { enableHighAccuracy: false, timeout: 8000 },
      );
    });
  }, []);

  return { locate, locating, locationError, unsupported };
}
