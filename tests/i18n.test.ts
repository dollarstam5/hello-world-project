import { afterEach, describe, expect, it } from "vitest";
import { locales, messages } from "@/lib/i18n/messages";
import { useI18nStore } from "@/lib/i18n/useI18n";

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

  it("does not contain empty user-facing messages", () => {
    for (const locale of locales) {
      for (const [key, value] of Object.entries(messages[locale])) {
        expect(value.trim(), `${locale}:${key}`).not.toBe("");
      }
    }
  });
});
