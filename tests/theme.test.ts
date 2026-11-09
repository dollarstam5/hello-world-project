import { afterEach, describe, expect, it, vi } from "vitest";
import { useThemeStore } from "@/lib/app/theme";

afterEach(() => {
  useThemeStore.setState({ mode: "dark" });
  document.documentElement.classList.remove("light");
  document.documentElement.classList.add("dark");
});

describe("theme preference resilience", () => {
  it("applies the selected theme for the current session when storage is blocked", () => {
    const storage = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });

    try {
      expect(() => useThemeStore.getState().setMode("light")).not.toThrow();
      expect(useThemeStore.getState().mode).toBe("light");
      expect(document.documentElement.classList.contains("light")).toBe(true);
    } finally {
      storage.mockRestore();
    }
  });
});
