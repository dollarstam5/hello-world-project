import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";
import { useNetworkStatus } from "@/lib/platform/useNetworkStatus";

function NetworkProbe() {
  const { online } = useNetworkStatus();
  return createElement("output", { "data-online": String(online) }, online ? "online" : "offline");
}

describe("network status", () => {
  it("updates when the browser goes offline and comes back online", async () => {
    Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", {
      configurable: true,
      value: true,
    });
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      value: true,
    });

    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    try {
      await act(async () => {
        root.render(createElement(NetworkProbe));
      });
      expect(container.querySelector("output")?.dataset.online).toBe("true");

      await act(async () => {
        Object.defineProperty(navigator, "onLine", {
          configurable: true,
          value: false,
        });
        window.dispatchEvent(new Event("offline"));
      });
      expect(container.querySelector("output")?.dataset.online).toBe("false");

      await act(async () => {
        Object.defineProperty(navigator, "onLine", {
          configurable: true,
          value: true,
        });
        window.dispatchEvent(new Event("online"));
      });
      expect(container.querySelector("output")?.dataset.online).toBe("true");
    } finally {
      await act(async () => {
        root.unmount();
      });
      container.remove();
      Reflect.deleteProperty(navigator, "onLine");
    }
  });
});
