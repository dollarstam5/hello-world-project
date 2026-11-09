/**
 * Installability platform layer: registers the service worker and exposes the
 * native install prompt as reactive state. No UI, no business logic.
 */
import { useEffect, useState } from "react";

import { getPlatformCapabilities, type PlatformOS } from "@/lib/platform/capabilities";
import { watchForUpdates } from "./update";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function getManualInstallInstructions(
  os: PlatformOS,
  secureContext: boolean,
  serviceWorker: boolean,
  standalone: boolean,
): "ios" | "android" | null {
  if (standalone || !secureContext || !serviceWorker) return null;
  return os === "ios" || os === "android" ? os : null;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let registrationScheduled = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function isStandalone(): boolean {
  return getPlatformCapabilities().standalone;
}

/** Registers the service worker once, in production, even when load has passed. */
export function registerServiceWorker(): void {
  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator) ||
    !import.meta.env.PROD ||
    registrationScheduled
  ) {
    return;
  }

  registrationScheduled = true;

  const register = () => {
    void navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => watchForUpdates(registration))
      .catch(() => {
        registrationScheduled = false;
      });
  };

  if (document.readyState === "complete") {
    register();
  } else {
    window.addEventListener("load", register, { once: true });
  }
}

export function useInstallPrompt() {
  const capabilities = getPlatformCapabilities();
  const [available, setAvailable] = useState(deferredPrompt !== null);
  const [installed, setInstalled] = useState(capabilities.standalone);

  useEffect(() => {
    const onListener = () => setAvailable(deferredPrompt !== null);
    listeners.add(onListener);

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      deferredPrompt = event as BeforeInstallPromptEvent;
      notify();
    };
    const onInstalled = () => {
      deferredPrompt = null;
      setInstalled(true);
      notify();
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    setInstalled(isStandalone());

    return () => {
      listeners.delete(onListener);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install(): Promise<"accepted" | "dismissed" | "unavailable"> {
    if (!deferredPrompt) return "unavailable";
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    notify();
    return outcome;
  }

  const manualInstructions = getManualInstallInstructions(
    capabilities.os,
    capabilities.secureContext,
    capabilities.serviceWorker,
    installed,
  );
  const canOfferManualInstall = manualInstructions !== null;

  return {
    available: !installed && (available || canOfferManualInstall),
    installed,
    install,
    manualInstructions: available ? null : manualInstructions,
  };
}
