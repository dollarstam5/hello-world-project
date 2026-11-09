import { describe, expect, it } from "vitest";
import { registerServiceWorker, useAppUpdate, useInstallPrompt } from "@/platform/pwa";
import { getManualInstallInstructions } from "@/platform/pwa/install";

describe("PWA platform exports", () => {
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
