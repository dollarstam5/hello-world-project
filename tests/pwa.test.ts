import { describe, expect, it } from "vitest";
import { registerServiceWorker, useAppUpdate, useInstallPrompt } from "@/platform/pwa";

describe("PWA platform exports", () => {
  it("exposes the canonical service worker, install, and update entrypoints", () => {
    expect(registerServiceWorker).toBeTypeOf("function");
    expect(useInstallPrompt).toBeTypeOf("function");
    expect(useAppUpdate).toBeTypeOf("function");
  });
});
