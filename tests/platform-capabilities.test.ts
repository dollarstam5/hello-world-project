import { describe, expect, it, vi } from "vitest";
import {
  detectPlatformIdentity,
  getDetailedPlatformIdentity,
  getPlatformCapabilities,
} from "@/lib/platform/capabilities";

describe("platform identity detection", () => {
  it("reads Windows 11 and full browser versions from high-entropy client hints", async () => {
    const original = Object.getOwnPropertyDescriptor(navigator, "userAgentData");
    Object.defineProperty(navigator, "userAgentData", {
      configurable: true,
      value: {
        platform: "Windows",
        brands: [{ brand: "Google Chrome", version: "120" }],
        getHighEntropyValues: vi.fn(async () => ({
          platformVersion: "13.0.0",
          fullVersionList: [{ brand: "Google Chrome", version: "128.0.6613.120" }],
        })),
      },
    });

    try {
      await expect(getDetailedPlatformIdentity()).resolves.toMatchObject({
        os: "windows",
        windowsVersion: "11",
        browser: "chrome",
        browserVersion: "128.0.6613.120",
      });
    } finally {
      if (original) {
        Object.defineProperty(navigator, "userAgentData", original);
      } else {
        Reflect.deleteProperty(navigator, "userAgentData");
      }
    }
  });

  it("recognizes Brave through its browser-provided detection API", async () => {
    const original = Object.getOwnPropertyDescriptor(navigator, "brave");
    Object.defineProperty(navigator, "brave", {
      configurable: true,
      value: { isBrave: vi.fn(async () => true) },
    });

    try {
      await expect(getDetailedPlatformIdentity()).resolves.toMatchObject({
        browser: "brave",
      });
    } finally {
      if (original) {
        Object.defineProperty(navigator, "brave", original);
      } else {
        Reflect.deleteProperty(navigator, "brave");
      }
    }
  });

  it("identifies Windows 11 only from the high-entropy platform version hint", () => {
    expect(
      detectPlatformIdentity({
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        userAgentData: { platform: "Windows", platformVersion: "13.0.0" },
      }),
    ).toMatchObject({ os: "windows", browser: "chrome", windowsVersion: "11" });

    expect(
      detectPlatformIdentity({
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        userAgentData: { platform: "Windows", platformVersion: "10.0.0" },
      }),
    ).toMatchObject({ os: "windows", windowsVersion: "10" });

    expect(
      detectPlatformIdentity({
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        userAgentData: { platform: "Windows" },
      }),
    ).toMatchObject({ os: "windows", windowsVersion: "unknown" });
  });

  it("recognizes Android and common Chromium browsers", () => {
    expect(
      detectPlatformIdentity({
        userAgent:
          "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36",
        platform: "Linux armv8l",
      }),
    ).toMatchObject({ os: "android", browser: "chrome", isIPadOS: false });
  });

  it("recognizes alternative Android browsers and their reported versions", () => {
    const cases = [
      {
        userAgent:
          "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36 Phoenix/14.2.0",
        browser: "phoenix",
        browserVersion: "14.2.0",
      },
      {
        userAgent:
          "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36 UCBrowser/15.5.0.0",
        browser: "uc",
        browserVersion: "15.5.0.0",
      },
      {
        userAgent:
          "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36 OPR/85.0.0.0",
        browser: "opera",
        browserVersion: "85.0.0.0",
      },
      {
        userAgent:
          "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36 Vivaldi/6.8.0.0",
        browser: "vivaldi",
        browserVersion: "6.8.0.0",
      },
      {
        userAgent:
          "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36 YaBrowser/24.1.0.0",
        browser: "yandex",
        browserVersion: "24.1.0.0",
      },
      {
        userAgent:
          "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36 SamsungBrowser/25.0",
        browser: "samsung",
        browserVersion: "25.0",
      },
      {
        userAgent:
          "Mozilla/5.0 (Android 14; Mobile; rv:121.0) Gecko/121.0 Firefox/121.0",
        browser: "firefox",
        browserVersion: "121.0",
      },
      {
        userAgent:
          "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36 EdgA/120.0.0.0",
        browser: "edge",
        browserVersion: "120.0.0.0",
      },
      {
        userAgent:
          "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36 DuckDuckGo/5",
        browser: "duckduckgo",
        browserVersion: "5",
      },
      {
        userAgent:
          "Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro Build/UP1A) AppleWebKit/537.36 Version/4.0 Chrome/120.0.0.0 Mobile Safari/537.36 wv)",
        browser: "webview",
      },
    ] as const;

    for (const item of cases) {
      expect(detectPlatformIdentity({ userAgent: item.userAgent })).toMatchObject({
        os: "android",
        browser: item.browser,
        browserVersion: item.browserVersion,
      });
    }
  });

  it("recognizes iOS browser shells while keeping their platform identity", () => {
    expect(
      detectPlatformIdentity({
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 CriOS/120.0.0.0 Mobile/15E148 Safari/604.1",
        platform: "iPhone",
      }),
    ).toMatchObject({ os: "ios", browser: "chrome", browserVersion: "120.0.0.0" });

    expect(
      detectPlatformIdentity({
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 FxiOS/120.0 Mobile/15E148 Safari/605.1.15",
        platform: "iPhone",
      }),
    ).toMatchObject({ os: "ios", browser: "firefox", browserVersion: "120.0" });

    expect(
      detectPlatformIdentity({
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 EdgiOS/120.0 Mobile/15E148 Safari/605.1.15",
        platform: "iPhone",
      }),
    ).toMatchObject({ os: "ios", browser: "edge", browserVersion: "120.0" });

    expect(
      detectPlatformIdentity({
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 OPiOS/4.0 Mobile/15E148 Safari/605.1.15",
        platform: "iPhone",
      }),
    ).toMatchObject({ os: "ios", browser: "opera", browserVersion: "4.0" });
  });

  it("recognizes iPhone Safari", () => {
    expect(
      detectPlatformIdentity({
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1",
        platform: "iPhone",
      }),
    ).toMatchObject({ os: "ios", browser: "safari", isIPadOS: false });
  });

  it("recognizes iPadOS when Safari requests desktop websites", () => {
    expect(
      detectPlatformIdentity({
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15",
        platform: "MacIntel",
        maxTouchPoints: 5,
      }),
    ).toMatchObject({ os: "ios", browser: "safari", isIPadOS: true });
  });

  it("prefers User-Agent Client Hints when identifying Android", () => {
    expect(
      detectPlatformIdentity({
        userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
        userAgentData: {
          platform: "Android",
          brands: [{ brand: "Chromium" }, { brand: "Google Chrome" }],
        },
      }),
    ).toMatchObject({ os: "android", browser: "chrome" });
  });

  it("recognizes an installed standalone PWA from the display-mode media query", () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn((query: string) => ({
      matches: query === "(display-mode: standalone)",
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => true,
    })) as typeof window.matchMedia;

    try {
      expect(getPlatformCapabilities().standalone).toBe(true);
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });

  it("recognizes the iOS Home Screen standalone flag", () => {
    const originalStandalone = Object.getOwnPropertyDescriptor(navigator, "standalone");
    Object.defineProperty(navigator, "standalone", {
      configurable: true,
      value: true,
    });

    try {
      expect(getPlatformCapabilities().standalone).toBe(true);
    } finally {
      if (originalStandalone) {
        Object.defineProperty(navigator, "standalone", originalStandalone);
      } else {
        Reflect.deleteProperty(navigator, "standalone");
      }
    }
  });

  it("returns a safe capability snapshot in a browser-like environment", () => {
    const result = getPlatformCapabilities();
    expect(result).toHaveProperty("serviceWorker");
    expect(result).toHaveProperty("standalone");
    expect(result).toHaveProperty("secureContext");
  });

  it("treats an unavailable secure-context API as unsupported", () => {
    const original = Object.getOwnPropertyDescriptor(window, "isSecureContext");
    Object.defineProperty(window, "isSecureContext", {
      configurable: true,
      value: undefined,
    });

    try {
      expect(getPlatformCapabilities().secureContext).toBe(false);
    } finally {
      if (original) {
        Object.defineProperty(window, "isSecureContext", original);
      } else {
        Reflect.deleteProperty(window, "isSecureContext");
      }
    }
  });
});
