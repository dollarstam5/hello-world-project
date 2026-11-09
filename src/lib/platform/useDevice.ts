import { useEffect, useState } from "react";
import { getPlatformCapabilities, type BrowserName, type PlatformOS } from "./capabilities";

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
  standalone: boolean;
  secureContext: boolean;
  serviceWorker: boolean;
  geolocation: boolean;
  notifications: boolean;
  clipboard: boolean;
  share: boolean;
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
    touch: matchMedia("(pointer: coarse)").matches,
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    isLowEnd: cores <= 4 && memory <= 2,
    os: capabilities.os,
    browser: capabilities.browser,
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
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");

    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    reducedMotionQuery.addEventListener("change", update);
    coarsePointerQuery.addEventListener("change", update);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      reducedMotionQuery.removeEventListener("change", update);
      coarsePointerQuery.removeEventListener("change", update);
    };
  }, []);
  return info;
}
