import { afterEach, describe, expect, it, vi } from "vitest";
import { locales, messages } from "@/lib/i18n/messages";
import { initI18n, resolveBrowserLocale, useI18nStore } from "@/lib/i18n/useI18n";

describe("internationalization catalog", () => {
  afterEach(() => {
    useI18nStore.getState().setLocale("fr");
  });
  it("keeps the French and English catalogs in sync", () => {
    const frenchKeys = Object.keys(messages.fr).sort();
    const englishKeys = Object.keys(messages.en).sort();

    expect(englishKeys).toEqual(frenchKeys);
  });

  it("updates the document language when the locale changes", () => {
    useI18nStore.getState().setLocale("en");
    expect(document.documentElement.lang).toBe("en");

    useI18nStore.getState().setLocale("fr");
    expect(document.documentElement.lang).toBe("fr");
  });

  it("keeps the selected locale active when browser storage is unavailable", () => {
    const storage = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });

    try {
      expect(() => useI18nStore.getState().setLocale("en")).not.toThrow();
      expect(useI18nStore.getState().locale).toBe("en");
      expect(document.documentElement.lang).toBe("en");
    } finally {
      storage.mockRestore();
    }
  });

  it("does not contain empty user-facing messages", () => {
    for (const locale of locales) {
      for (const [key, value] of Object.entries(messages[locale])) {
        expect(value.trim(), `${locale}:${key}`).not.toBe("");
      }
    }
  });
});
