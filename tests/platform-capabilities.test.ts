import { describe, expect, it } from "vitest";
import {
  detectPlatformIdentity,
  getPlatformCapabilities,
} from "@/lib/platform/capabilities";

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

  it("returns a safe capability snapshot in a browser-like environment", () => {
    const result = getPlatformCapabilities();
    expect(result).toHaveProperty("serviceWorker");
    expect(result).toHaveProperty("standalone");
    expect(result).toHaveProperty("secureContext");
  });
});
