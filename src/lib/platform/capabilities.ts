export type PlatformOS = "android" | "ios" | "windows" | "macos" | "linux" | "other" | "unknown";
export type BrowserName =
  | "chrome"
  | "edge"
  | "samsung"
  | "firefox"
  | "safari"
  | "phoenix"
  | "uc"
  | "opera"
  | "brave"
  | "vivaldi"
  | "yandex"
  | "duckduckgo"
  | "webview"
  | "other"
  | "unknown";

export interface PlatformIdentity {
  os: PlatformOS;
  browser: BrowserName;
  browserVersion?: string;
  windowsVersion?: "11" | "10" | "older" | "unknown";
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
  userAgentData?: {
    platform?: string;
    platformVersion?: string;
    brands?: Array<{ brand: string; version?: string }>;
  };
}

/** Pure identity detection, separated so Android/iOS edge cases can be tested. */
export function detectPlatformIdentity(input: NavigatorHints): PlatformIdentity {
  const ua = input.userAgent ?? "";
  const platform = input.userAgentData?.platform || input.platform || "";
  const normalized = platform.toLowerCase();
  const isIPadOS = /macintosh/i.test(ua) && (input.maxTouchPoints ?? 0) > 1;

  let os: PlatformOS = "other";
  if (/android/i.test(ua) || normalized === "android") os = "android";
  else if (/iphone|ipad|ipod/i.test(ua) || isIPadOS || /ios/i.test(normalized)) os = "ios";
  else if (/win/i.test(normalized) || /windows/i.test(ua)) os = "windows";
  else if (/mac/i.test(normalized) || /macintosh|mac os/i.test(ua)) os = "macos";
  else if (/linux/i.test(normalized) || /linux/i.test(ua)) os = "linux";
  else if (!ua && !platform) os = "unknown";

  const brands = input.userAgentData?.brands ?? [];
  const normalizedBrands = brands.map((item) => item.brand.toLowerCase());
  let browser: BrowserName = "other";
  let browserVersion: string | undefined;

  const uaVersion = (pattern: RegExp) => ua.match(pattern)?.[1];
  const brandVersion = (name: string) =>
    brands.find((item) => item.brand.toLowerCase().includes(name))?.version;

  if (/;\s*wv\)|\bwv\b/i.test(ua)) browser = "webview";
  else if (/phoenix\//i.test(ua) || /\bphoenix browser\b/i.test(ua)) {
    browser = "phoenix";
    browserVersion = uaVersion(/phoenix\/([\d.]+)/i);
  } else if (/ucbrowser\//i.test(ua)) {
    browser = "uc";
    browserVersion = uaVersion(/ucbrowser\/([\d.]+)/i);
  } else if (/edg(e|a|ios)?\//i.test(ua) || normalizedBrands.some((brand) => brand.includes("edge"))) {
    browser = "edge";
    browserVersion = uaVersion(/edg(?:e|a|ios)?\/([\d.]+)/i) ?? brandVersion("edge");
  } else if (/samsungbrowser\//i.test(ua)) {
    browser = "samsung";
    browserVersion = uaVersion(/samsungbrowser\/([\d.]+)/i);
  } else if (/opr\//i.test(ua) || /opera/i.test(ua)) {
    browser = "opera";
    browserVersion = uaVersion(/(?:opr|opera)\/([\d.]+)/i);
  } else if (/vivaldi\//i.test(ua)) {
    browser = "vivaldi";
    browserVersion = uaVersion(/vivaldi\/([\d.]+)/i);
  } else if (/yabrowser\//i.test(ua)) {
    browser = "yandex";
    browserVersion = uaVersion(/yabrowser\/([\d.]+)/i);
  } else if (/duckduckgo\//i.test(ua)) {
    browser = "duckduckgo";
    browserVersion = uaVersion(/duckduckgo\/([\d.]+)/i);
  } else if (/brave\//i.test(ua)) {
    browser = "brave";
    browserVersion = uaVersion(/brave\/([\d.]+)/i);
  } else if (/firefox|fxios/i.test(ua)) {
    browser = "firefox";
    browserVersion = uaVersion(/(?:firefox|fxios)\/([\d.]+)/i);
  } else if (/crios/i.test(ua)) {
    browser = "chrome";
    browserVersion = uaVersion(/crios\/([\d.]+)/i);
  } else if (
    normalizedBrands.some((brand) => brand.includes("chrome")) ||
    /chrome\//i.test(ua)
  ) {
    browser = "chrome";
    browserVersion = uaVersion(/chrome\/([\d.]+)/i) ?? brandVersion("chrome");
  } else if (/safari/i.test(ua) && !/android/i.test(ua)) {
    browser = "safari";
    browserVersion = uaVersion(/version\/([\d.]+)/i);
  } else if (!ua && !platform && brands.length === 0) {
    browser = "unknown";
  }

  const platformMajor = Number.parseInt(input.userAgentData?.platformVersion?.split(".")[0] ?? "", 10);
  const windowsVersion =
    os === "windows"
      ? Number.isNaN(platformMajor)
        ? "unknown"
        : platformMajor >= 13
          ? "11"
          : platformMajor >= 1
            ? "10"
            : "older"
      : undefined;

  return {
    os,
    browser,
    ...(browserVersion ? { browserVersion } : {}),
    ...(windowsVersion ? { windowsVersion } : {}),
    isIPadOS,
  };
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
    standalone: media("(display-mode: standalone)") || nav.standalone === true,
    coarsePointer: media("(pointer: coarse)"),
    reducedMotion: media("(prefers-reduced-motion: reduce)"),
  };
}
