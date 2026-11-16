import { useEffect, useRef, useState, type ComponentType } from "react";

/**
 * Loads the sync bridge after the first paint without making offline startup
 * depend on a network-fetched lazy chunk. If the first import cannot complete,
 * retry when connectivity returns or the app becomes visible again.
 */
export function SyncEngineLoader() {
  const [Bootstrap, setBootstrap] = useState<ComponentType | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let loading = false;

    const load = () => {
      if (cancelled || loaded.current || loading || !navigator.onLine) return;
      loading = true;

      void import("./SyncEngineBootstrap")
        .then(({ SyncEngineBootstrap }) => {
          if (cancelled) return;
          loaded.current = true;
          setBootstrap(() => SyncEngineBootstrap);
        })
        .catch(() => {
          loading = false;
        });
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") load();
    };

    load();
    window.addEventListener("online", load);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      window.removeEventListener("online", load);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return Bootstrap ? <Bootstrap /> : null;
}
