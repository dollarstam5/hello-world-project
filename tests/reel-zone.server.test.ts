// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const { createClientMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: createClientMock,
}));

import { resolveReelZoneForUser } from "@/domains/presence/api/reel-zone.server";

describe("résolution de zone Réel", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("SUPABASE_URL", "http://localhost:54321");
    vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test_value");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service_role_test_key_with_more_than_32_chars");
    vi.stubEnv("REEL_ZONE_HMAC_SECRET", "");

    createClientMock.mockReturnValue({
      from: (table: string) => {
        const query: Record<string, unknown> = {};
        query.select = vi.fn(() => query);
        query.eq = vi.fn(() => query);
        query.is = vi.fn(() => query);
        query.gt = vi.fn(() => query);
        query.limit = vi.fn(() => query);
        query.maybeSingle = vi.fn(async () =>
          table === "profiles"
            ? { data: { id: "member-1" }, error: null }
            : { data: null, error: null },
        );
        return query;
      },
      rpc: vi.fn(async () => ({ data: null, error: null })),
    });
  });

  it("permet la découverte PostGIS sans configurer le secret HMAC de présence", async () => {
    await expect(
      resolveReelZoneForUser("member-1", 48.8566, 2.3522, "discover"),
    ).resolves.toMatchObject({
      zoneKeys: [],
      areaLabel: "Votre secteur approximatif",
    });

    expect(createClientMock).toHaveBeenCalledOnce();
  });
});
