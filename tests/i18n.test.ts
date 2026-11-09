import { describe, expect, it } from "vitest";
import { locales, messages } from "@/lib/i18n/messages";

describe("internationalization catalog", () => {
  it("keeps the French and English catalogs in sync", () => {
    const frenchKeys = Object.keys(messages.fr).sort();
    const englishKeys = Object.keys(messages.en).sort();

    expect(englishKeys).toEqual(frenchKeys);
  });

  it("does not contain empty user-facing messages", () => {
    for (const locale of locales) {
      for (const [key, value] of Object.entries(messages[locale])) {
        expect(value.trim(), `${locale}:${key}`).not.toBe("");
      }
    }
  });
});
