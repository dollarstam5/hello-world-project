import { afterEach, describe, expect, it, vi } from "vitest";
import { matchesMediaQuery, subscribeToMediaQuery } from "@/lib/platform/useDevice";

describe("legacy media query compatibility", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses a safe false result when matchMedia is unavailable", () => {
    const original = window.matchMedia;
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: undefined,
    });

    try {
      expect(matchesMediaQuery("(pointer: coarse)")).toBe(false);
      expect(subscribeToMediaQuery("(pointer: coarse)", vi.fn())).toBeTypeOf("function");
    } finally {
      Object.defineProperty(window, "matchMedia", {
        configurable: true,
        value: original,
      });
    }
  });

  it("falls back to legacy addListener and removeListener", () => {
    const listener = vi.fn();
    const addListener = vi.fn();
    const removeListener = vi.fn();
    const original = window.matchMedia;
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn(() => ({
        matches: false,
        media: "(pointer: coarse)",
        onchange: null,
        addListener,
        removeListener,
        addEventListener: undefined,
        removeEventListener: undefined,
        dispatchEvent: () => true,
      })),
    });

    try {
      const unsubscribe = subscribeToMediaQuery("(pointer: coarse)", listener);
      expect(addListener).toHaveBeenCalledWith(listener);
      unsubscribe();
      expect(removeListener).toHaveBeenCalledWith(listener);
    } finally {
      Object.defineProperty(window, "matchMedia", {
        configurable: true,
        value: original,
      });
    }
  });
});
