import { describe, expect, it } from "vitest";
import {
  canSaveFlashLater,
  FLASH_PUBLISH_NOW_ENABLED,
} from "@/domains/flash/model/publication-choice";

describe("Flash publication choices (T1)", () => {
  it("keeps immediate publishing unavailable until the secure publication path is ready", () => {
    expect(FLASH_PUBLISH_NOW_ENABLED).toBe(false);
  });

  it("enables save-later only for an authenticated, ready user with non-empty text", () => {
    expect(
      canSaveFlashLater({
        hasUser: true,
        authLoading: false,
        publishing: false,
        text: "  Besoin d'aide  ",
      }),
    ).toBe(true);
    expect(
      canSaveFlashLater({
        hasUser: false,
        authLoading: false,
        publishing: false,
        text: "Besoin",
      }),
    ).toBe(false);
    expect(
      canSaveFlashLater({
        hasUser: true,
        authLoading: true,
        publishing: false,
        text: "Besoin",
      }),
    ).toBe(false);
    expect(
      canSaveFlashLater({
        hasUser: true,
        authLoading: false,
        publishing: true,
        text: "Besoin",
      }),
    ).toBe(false);
    expect(
      canSaveFlashLater({
        hasUser: true,
        authLoading: false,
        publishing: false,
        text: "   ",
      }),
    ).toBe(false);
  });
});
