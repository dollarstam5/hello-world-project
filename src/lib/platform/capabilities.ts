export type PlatformOS = "android" | "ios" | "windows" | "macos" | "linux" | "other" | "unknown";
export type BrowserName = "chrome" | "edge" | "samsung" | "firefox" | "safari" | "other" | "unknown";

export interface PlatformIdentity {
  os: PlatformOS;
  browser: BrowserName;
  isIPadOS: boolean;
}

export interface PlatformCapabilities extends PlatformIdentity {
  secureContext: boolean;
  serviceWorker: boolean;
  geolocation: boolean;
  notifications: boolean;
  clipboard: boolean;
  share: boolean;
  standalone: boolean;
  coarsePointer: boolean;
  reducedMotion: boolean;
}

interface NavigatorHints {
  userAgent?: string;
  platform?: string;
  maxTouchPoints?: number;
  userAgentData?: { platform?: string; brands?: Array<{ brand: string }> };
}

/** Pure identity detection, separated so Android/iOS edge cases can be tested. */
export function detectPlatformIdentity(input: NavigatorHints): PlatformIdentity {
  const ua = input.userAgent ?? "";
  const platform = input.userAgentData?.platform || input.platform || "";
  const normalized = platform.toLowerCase();
  const isIPadOS =
    /macintosh/i.test(ua) && (input.maxTouchPoints ?? 0) > 1;

  let os: PlatformOS = "other";
  if (/android/i.test(ua) || normalized === "android") os = "android";
  else if (/iphone|ipad|ipod/i.test(ua) || isIPadOS || /ios/i.test(normalized)) os = "ios";
  else if (/win/i.test(normalized) || /windows/i.test(ua)) os = "windows";
  else if (/mac/i.test(normalized) || /macintosh|mac os/i.test(ua)) os = "macos";
  else if (/linux/i.test(normalized) || /linux/i.test(ua)) os = "linux";
  else if (!ua && !platform) os = "unknown";

  const brands = input.userAgentData?.brands?.map((item) => item.brand.toLowerCase()) ?? [];
  let browser: BrowserName = "other";
  if (brands.some((brand) => brand.includes("edge")) || /edg\//i.test(ua)) browser = "edge";
  else if (/samsungbrowser/i.test(ua)) browser = "samsung";
  else if (brands.some((brand) => brand.includes("chrome")) || /crios|chrome/i.test(ua)) browser = "chrome";
  else if (/firefox|fxios/i.test(ua)) browser = "firefox";
  else if (/safari/i.test(ua) && !/chrome|crios|android/i.test(ua)) browser = "safari";
  else if (!ua && !platform && brands.length === 0) browser = "unknown";

  return { os, browser, isIPadOS };
}

/** Read actual browser APIs at runtime; never infer support from OS alone. */
export function getPlatformCapabilities(): PlatformCapabilities {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      os: "unknown",
      browser: "unknown",
      isIPadOS: false,
      secureContext: false,
      serviceWorker: false,
      geolocation: false,
      notifications: false,
      clipboard: false,
      share: false,
      standalone: false,
      coarsePointer: false,
      reducedMotion: false,
    };
  }

  const nav = navigator as Navigator & NavigatorHints & { standalone?: boolean };
  const identity = detectPlatformIdentity(nav);
  const media = (query: string) =>
    typeof window.matchMedia === "function" && window.matchMedia(query).matches;

  return {
    ...identity,
    secureContext: window.isSecureContext,
    serviceWorker: "serviceWorker" in navigator,
    geolocation: "geolocation" in navigator,
    notifications: "Notification" in window,
    clipboard: Boolean(navigator.clipboard?.writeText),
    share: typeof navigator.share === "function",
    standalone:
      media("(display-mode: standalone)") ||
      nav.standalone === true,
    coarsePointer: media("(pointer: coarse)"),
    reducedMotion: media("(prefers-reduced-motion: reduce)"),
  };
}
