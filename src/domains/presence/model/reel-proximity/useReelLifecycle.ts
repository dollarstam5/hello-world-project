import { useEffect, useRef, useState } from "react";

export function useReelLifecycle() {
  const [isPageVisible, setIsPageVisible] = useState(
    () => typeof document === "undefined" || document.visibilityState === "visible",
  );
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator === "undefined" ? true : navigator.onLine,
  );
  const [isRefreshingDiscovery, setIsRefreshingDiscovery] = useState(false);
  const discoveryRequestId = useRef(0);

  useEffect(() => {
    const handleVisibility = () => {
      const visible = document.visibilityState === "visible";
      setIsPageVisible(visible);
      if (!visible) {
        discoveryRequestId.current += 1;
        setIsRefreshingDiscovery(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return {
    isPageVisible,
    setIsPageVisible,
    isOnline,
    setIsOnline,
    isRefreshingDiscovery,
    setIsRefreshingDiscovery,
    discoveryRequestId,
  };
}
