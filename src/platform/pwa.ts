import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let registrationScheduled = false;

export function registerServiceWorker(): void {
  if (registrationScheduled || typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }
  registrationScheduled = true;

  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js", { scope: "/" });
  });
}

export function useInstallPrompt(): {
  available: boolean;
  install: () => Promise<void>;
} {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) {
      return;
    }

    const prompt = deferredPrompt;
    setDeferredPrompt(null);
    await prompt.prompt();
    await prompt.userChoice;
  };

  return {
    available: deferredPrompt !== null,
    install,
  };
}

export function useAppUpdate(): {
  ready: boolean;
  applying: boolean;
  apply: () => void;
} {
  const [ready, setReady] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    let disposed = false;
    let registration: ServiceWorkerRegistration | null = null;

    const markWaiting = (worker: ServiceWorker | null) => {
      if (worker && !disposed) {
        setReady(true);
      }
    };

    const watchRegistration = async () => {
      const current = await navigator.serviceWorker.ready;
      if (disposed) {
        return;
      }

      registration = current;
      markWaiting(registration.waiting);

      registration.addEventListener("updatefound", () => {
        const installing = registration?.installing;
        if (!installing) {
          return;
        }

        installing.addEventListener("statechange", () => {
          if (installing.state === "installed") {
            markWaiting(registration?.waiting ?? installing);
          }
        });
      });

      await registration.update().catch(() => undefined);
      markWaiting(registration.waiting);
    };

    void watchRegistration();

    const handleControllerChange = () => {
      if (applying) {
        window.location.reload();
      }
    };

    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

    return () => {
      disposed = true;
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
    };
  }, [applying]);

  const apply = () => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const worker = registrationWorker();
    if (!worker) {
      return;
    }

    setApplying(true);
    worker.postMessage({ type: "SKIP_WAITING" });
  };

  return {
    ready,
    applying,
    apply,
  };
}

function registrationWorker(): ServiceWorker | null {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  return navigator.serviceWorker.getRegistration("/").then ? null : null;
}
