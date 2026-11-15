import { describe, expect, it, vi } from "vitest";
import { detectPlatformIdentity, getPlatformCapabilities } from "@/lib/platform/capabilities";

describe("platform identity detection", () => {
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
        userAgent: "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36 Phoenix/14.2.0",
        browser: "phoenix",
        browserVersion: "14.2.0",
      },
      {
        userAgent: "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36 UCBrowser/15.5.0.0",
        browser: "uc",
        browserVersion: "15.5.0.0",
      },
      {
        userAgent: "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36 OPR/85.0.0.0",
        browser: "opera",
        browserVersion: "85.0.0.0",
      },
      {
        userAgent: "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36 Vivaldi/6.8.0.0",
        browser: "vivaldi",
        browserVersion: "6.8.0.0",
      },
      {
        userAgent: "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36 YaBrowser/24.1.0.0",
        browser: "yandex",
        browserVersion: "24.1.0.0",
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
});
