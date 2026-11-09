import { createElement } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";
import { useNetworkStatus } from "@/lib/platform/useNetworkStatus";

function NetworkProbe() {
  const { online } = useNetworkStatus();
  return createElement("output", { "data-online": String(online) }, online ? "online" : "offline");
}

describe("network status", () => {
  it("updates when the browser goes offline and comes back online", () => {
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      value: true,
    });

    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    try {
      flushSync(() => {
        root.render(createElement(NetworkProbe));
      });
      expect(container.querySelector("output")?.dataset.online).toBe("true");

      flushSync(() => {
        Object.defineProperty(navigator, "onLine", {
          configurable: true,
          value: false,
        });
        window.dispatchEvent(new Event("offline"));
      });
      expect(container.querySelector("output")?.dataset.online).toBe("false");

      flushSync(() => {
        Object.defineProperty(navigator, "onLine", {
          configurable: true,
          value: true,
        });
        window.dispatchEvent(new Event("online"));
      });
      expect(container.querySelector("output")?.dataset.online).toBe("true");
    } finally {
      flushSync(() => {
        root.unmount();
      });
      container.remove();
      Reflect.deleteProperty(navigator, "onLine");
    }
  });
});
