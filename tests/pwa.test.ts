import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { registerServiceWorker, useAppUpdate, useInstallPrompt } from "@/platform/pwa";
import { getManualInstallInstructions } from "@/platform/pwa/install";

describe("PWA platform exports", () => {
  it("keeps installation unavailable on the first render, even on a secure Android device", () => {
    const originalSecureContext = Object.getOwnPropertyDescriptor(window, "isSecureContext");
    const originalUserAgent = Object.getOwnPropertyDescriptor(navigator, "userAgent");
    Object.defineProperty(window, "isSecureContext", { configurable: true, value: true });
    Object.defineProperty(navigator, "userAgent", { configurable: true, value: "Mozilla/5.0 Android Chrome/130" });
    let available: boolean | undefined;
    function Probe() {
      available = useInstallPrompt().available;
      return null;
    }
    try {
      renderToString(createElement(Probe));
      expect(available).toBe(false);
    } finally {
      if (originalSecureContext) Object.defineProperty(window, "isSecureContext", originalSecureContext);
      else Reflect.deleteProperty(window, "isSecureContext");
      if (originalUserAgent) Object.defineProperty(navigator, "userAgent", originalUserAgent);
      else Reflect.deleteProperty(navigator, "userAgent");
    }
  });

  it("exposes the canonical service worker, install, and update entrypoints", () => {
    expect(registerServiceWorker).toBeTypeOf("function");
    expect(useInstallPrompt).toBeTypeOf("function");
    expect(useAppUpdate).toBeTypeOf("function");
  });
});

describe("platform-specific installation guidance", () => {
  it("offers iOS manual installation only in a supported secure PWA context", () => {
    expect(getManualInstallInstructions("ios", true, false)).toBe("ios");
    expect(getManualInstallInstructions("ios", false, false)).toBeNull();
    expect(getManualInstallInstructions("ios", true, true)).toBeNull();
  });

  it("offers Android manual installation when native prompt is unavailable", () => {
    expect(getManualInstallInstructions("android", true, false)).toBe("android");
    expect(getManualInstallInstructions("windows", true, false)).toBeNull();
  });
});
