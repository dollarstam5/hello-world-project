import { useEffect, useState } from "react";
import {
  getDetailedPlatformIdentity,
  getPlatformCapabilities,
  type BrowserName,
  type PlatformOS,
} from "./capabilities";

/**
 * Device awareness — multi-device foundation & low-end optimization.
 * Single source of truth. Components must NOT read window directly.
 */
export type DeviceClass = "mobile" | "tablet" | "desktop";

export interface DeviceInfo {
  device: DeviceClass;
  width: number;
  height: number;
  orientation: "portrait" | "landscape";
  touch: boolean;
  reducedMotion: boolean;
  /** Approximate hardware capability — used to gate heavy effects. */
  isLowEnd: boolean;
  os: PlatformOS;
  browser: BrowserName;
  browserVersion?: string;
  windowsVersion?: "11" | "10" | "older" | "unknown";
  standalone: boolean;
  secureContext: boolean;
  serviceWorker: boolean;
  geolocation: boolean;
  notifications: boolean;
  clipboard: boolean;
  share: boolean;
}

/** Match media queries safely when an older embedded browser lacks matchMedia. */
export function matchesMediaQuery(query: string): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(query).matches
  );
}

/**
 * Subscribe through modern MediaQueryList events, with the legacy addListener
 * fallback used by older Safari/WebViews. Missing APIs become a harmless no-op.
 */
export function subscribeToMediaQuery(query: string, listener: () => void): () => void {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => undefined;
  }

  let media: MediaQueryList;
  try {
    media = window.matchMedia(query);
  } catch {
    return () => undefined;
  }

  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }

  if (typeof media.addListener === "function") {
    media.addListener(listener);
    return () => media.removeListener(listener);
  }

  return () => undefined;
}

function read(): DeviceInfo {
  if (typeof window === "undefined") {
    return {
      device: "mobile",
      width: 390,
      height: 844,
      orientation: "portrait",
      touch: true,
      reducedMotion: false,
      isLowEnd: false,
      os: "unknown",
      browser: "unknown",
      standalone: false,
      secureContext: false,
      serviceWorker: false,
      geolocation: false,
      notifications: false,
      clipboard: false,
      share: false,
    };
  }
  const w = window.innerWidth;
  const h = window.innerHeight;
  const device: DeviceClass = w < 768 ? "mobile" : w < 1280 ? "tablet" : "desktop";
  const nav = navigator as Navigator & { deviceMemory?: number };
  const capabilities = getPlatformCapabilities();
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  return {
    device,
    width: w,
    height: h,
    orientation: w >= h ? "landscape" : "portrait",
    touch: matchesMediaQuery("(pointer: coarse)"),
    reducedMotion: matchesMediaQuery("(prefers-reduced-motion: reduce)"),
    isLowEnd: cores <= 4 && memory <= 2,
    os: capabilities.os,
    browser: capabilities.browser,
    browserVersion: capabilities.browserVersion,
    windowsVersion: capabilities.windowsVersion,
    standalone: capabilities.standalone,
    secureContext: capabilities.secureContext,
    serviceWorker: capabilities.serviceWorker,
    geolocation: capabilities.geolocation,
    notifications: capabilities.notifications,
    clipboard: capabilities.clipboard,
    share: capabilities.share,
  };
}

export function useDevice(): DeviceInfo {
  const [info, setInfo] = useState<DeviceInfo>(() => read());
  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setInfo(read());
    void getDetailedPlatformIdentity().then((identity) => {
      setInfo((current) => ({
        ...current,
        os: identity.os,
        browser: identity.browser,
        browserVersion: identity.browserVersion,
        windowsVersion: identity.windowsVersion,
      }));
    });

    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    const unsubscribeReducedMotion = subscribeToMediaQuery(
      "(prefers-reduced-motion: reduce)",
      update,
    );
    const unsubscribeCoarsePointer = subscribeToMediaQuery("(pointer: coarse)", update);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      unsubscribeReducedMotion();
      unsubscribeCoarsePointer();
    };
  }, []);
  return info;
}
