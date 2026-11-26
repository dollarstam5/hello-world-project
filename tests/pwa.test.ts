import { afterEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { canApplyUpdate, registerServiceWorker, useAppUpdate, useInstallPrompt } from "@/platform/pwa";
import { getManualInstallInstructions } from "@/platform/pwa/install";
import { requestServiceWorkerActivation } from "@/platform/pwa/update";

describe("PWA platform exports", () => {
  it("keeps installation unavailable on the first render, even on a secure Android device", () => {
    const originalSecureContext = Object.getOwnPropertyDescriptor(window, "isSecureContext");
    const originalUserAgent = Object.getOwnPropertyDescriptor(navigator, "userAgent");
    Object.defineProperty(window, "isSecureContext", {
      configurable: true,
      value: true,
    });
    Object.defineProperty(navigator, "userAgent", {
      configurable: true,
      value: "Mozilla/5.0 Android Chrome/130",
    });
    let available: boolean | undefined;
    function Probe() {
      available = useInstallPrompt().available;
      return null;
    }
    try {
      renderToString(createElement(Probe));
      expect(available).toBe(false);
    } finally {
      if (originalSecureContext) {
        Object.defineProperty(window, "isSecureContext", originalSecureContext);
      } else {
        Reflect.deleteProperty(window, "isSecureContext");
      }
      if (originalUserAgent) {
        Object.defineProperty(navigator, "userAgent", originalUserAgent);
      } else {
        Reflect.deleteProperty(navigator, "userAgent");
      }
    }
  });

  it("exposes the canonical service worker, install, and update entrypoints", () => {
    expect(registerServiceWorker).toBeTypeOf("function");
    expect(useInstallPrompt).toBeTypeOf("function");
    expect(useAppUpdate).toBeTypeOf("function");
    expect(canApplyUpdate).toBeTypeOf("function");
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

describe("PWA update synchronization guard", () => {
  it("allows updates only after sync is idle with no pending actions", () => {
    expect(canApplyUpdate("idle", 0)).toBe(true);
    expect(canApplyUpdate("idle", 1)).toBe(false);
    expect(canApplyUpdate("pushing", 0)).toBe(false);
    expect(canApplyUpdate("offline", 0)).toBe(false);
    expect(canApplyUpdate("error", 0)).toBe(false);
  });
});

describe("safe service worker activation", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("resolves only after the new worker takes control", async () => {
    vi.useFakeTimers();
    const serviceWorker = new EventTarget();
    const worker = { postMessage: vi.fn() } as unknown as ServiceWorker;

    const activation = requestServiceWorkerActivation(
      worker,
      serviceWorker as unknown as ServiceWorkerContainer,
      3_000,
    );

    expect(worker.postMessage).toHaveBeenCalledWith({ type: "SKIP_WAITING" });
    serviceWorker.dispatchEvent(new Event("controllerchange"));

    await expect(activation).resolves.toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("reports a timeout without treating it as successful activation", async () => {
    vi.useFakeTimers();
    const serviceWorker = new EventTarget();
    const worker = { postMessage: vi.fn() } as unknown as ServiceWorker;

    const activation = requestServiceWorkerActivation(
      worker,
      serviceWorker as unknown as ServiceWorkerContainer,
      3_000,
    );

    await vi.advanceTimersByTimeAsync(3_000);
    await expect(activation).resolves.toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("reports a postMessage failure without reloading the page", async () => {
    vi.useFakeTimers();
    const serviceWorker = new EventTarget();
    const worker = {
      postMessage: vi.fn(() => {
        throw new Error("worker unavailable");
      }),
    } as unknown as ServiceWorker;

    await expect(
      requestServiceWorkerActivation(
        worker,
        serviceWorker as unknown as ServiceWorkerContainer,
        3_000,
      ),
    ).resolves.toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });
});
