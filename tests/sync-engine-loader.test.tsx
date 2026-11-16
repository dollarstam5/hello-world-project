import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { startSync } = vi.hoisted(() => ({
  startSync: vi.fn(),
}));

vi.mock("../src/components/app/SyncEngineBootstrap", () => ({
  SyncEngineBootstrap: () => {
    startSync();
    return null;
  },
}));

import { SyncEngineLoader } from "@/components/app/SyncEngineLoader";

describe("deferred sync engine loader", () => {
  beforeEach(() => {
    startSync.mockClear();
  });

  it("waits while offline and starts after connectivity returns", async () => {
    const originalOnline = Object.getOwnPropertyDescriptor(navigator, "onLine");
    Object.defineProperty(navigator, "onLine", { configurable: true, value: false });

    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    try {
      await act(async () => {
        root.render(createElement(SyncEngineLoader));
      });

      expect(startSync).not.toHaveBeenCalled();

      Object.defineProperty(navigator, "onLine", { configurable: true, value: true });
      await act(async () => {
        window.dispatchEvent(new Event("online"));
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(startSync).toHaveBeenCalledTimes(1);
    } finally {
      await act(async () => {
        root.unmount();
      });
      container.remove();
      if (originalOnline) {
        Object.defineProperty(navigator, "onLine", originalOnline);
      }
    }
  });

  it("starts after the first paint when already online", async () => {
    const originalOnline = Object.getOwnPropertyDescriptor(navigator, "onLine");
    Object.defineProperty(navigator, "onLine", { configurable: true, value: true });

    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    try {
      await act(async () => {
        root.render(createElement(SyncEngineLoader));
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(startSync).toHaveBeenCalledTimes(1);
    } finally {
      await act(async () => {
        root.unmount();
      });
      container.remove();
      if (originalOnline) {
        Object.defineProperty(navigator, "onLine", originalOnline);
      }
    }
  });
});
