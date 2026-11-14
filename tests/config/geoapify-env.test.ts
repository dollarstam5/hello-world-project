// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { getGeoapifyApiKey } from "@/config/env.server";

describe("configuration Geoapify", () => {
  it("returns null when the optional key is not configured", () => {
    vi.stubEnv("GEOAPIFY_API_KEY", "");
    expect(getGeoapifyApiKey()).toBeNull();
  });

  it("returns the key only from server environment configuration", () => {
    vi.stubEnv("GEOAPIFY_API_KEY", "geoapify_test_key_123456789");
    expect(getGeoapifyApiKey()).toBe("geoapify_test_key_123456789");
  });

  it("rejects an implausibly short key", () => {
    vi.stubEnv("GEOAPIFY_API_KEY", "short");
    expect(() => getGeoapifyApiKey()).toThrow(
      "GEOAPIFY_API_KEY must contain between 16 and 256 characters.",
    );
  });

  it("rejects an unexpectedly oversized key", () => {
    vi.stubEnv("GEOAPIFY_API_KEY", "x".repeat(257));
    expect(() => getGeoapifyApiKey()).toThrow(
      "GEOAPIFY_API_KEY must contain between 16 and 256 characters.",
    );
  });
});
