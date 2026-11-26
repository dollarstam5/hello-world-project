/**
 * Service worker update awareness: exposes "a new version is ready" as
 * reactive state, plus the action that applies it. No UI, no business logic.
 */
import { useEffect, useState } from "react";

let waitingWorker: ServiceWorker | null = null;
const listeners = new Set<(ready: boolean) => void>();

function announce(worker: ServiceWorker | null) {
  waitingWorker = worker;
  listeners.forEach((listener) => listener(worker !== null));
}

/** Called once by the registration layer, with the fresh registration. */
export function watchForUpdates(registration: ServiceWorkerRegistration): void {
  if (registration.waiting && navigator.serviceWorker.controller) {
    announce(registration.waiting);
  }

  registration.addEventListener("updatefound", () => {
    const installing = registration.installing;
    if (!installing) return;
    installing.addEventListener("statechange", () => {
      if (installing.state === "installed" && navigator.serviceWorker.controller) {
        announce(installing);
      }
    });
  });

  // Periodic check so long-lived sessions still learn about new releases.
  const interval = window.setInterval(
    () => {
      void registration.update().catch(() => undefined);
    },
    60 * 60 * 1000,
  );
  window.addEventListener("pagehide", () => window.clearInterval(interval), { once: true });
}

/**
 * Ask the waiting worker to activate and resolve only when it actually takes
 * control. A timeout is a recoverable failure, never a reason to reload.
 */
export function requestServiceWorkerActivation(
  worker: ServiceWorker,
  serviceWorker: ServiceWorkerContainer,
  timeoutMs = 10_000,
): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (activated: boolean) => {
      if (settled) return;
      settled = true;
      serviceWorker.removeEventListener("controllerchange", onControllerChange);
      window.clearTimeout(timeout);
      resolve(activated);
    };

    const onControllerChange = () => finish(true);
    serviceWorker.addEventListener("controllerchange", onControllerChange);
    const timeout = window.setTimeout(() => finish(false), timeoutMs);

    try {
      worker.postMessage({ type: "SKIP_WAITING" });
    } catch {
      finish(false);
    }
  });
}

export function useAppUpdate() {
  const [ready, setReady] = useState(waitingWorker !== null);
  const [applying, setApplying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const listener = (value: boolean) => setReady(value);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  function apply() {
    if (!waitingWorker || applying) return;
    setApplying(true);
    setFailed(false);

    void requestServiceWorkerActivation(waitingWorker, navigator.serviceWorker).then(
      (activated) => {
        if (activated) {
          window.location.reload();
          return;
        }
        setApplying(false);
        setFailed(true);
      },
    );
  }

  return { ready, applying, failed, apply };
}
