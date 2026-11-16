// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const { createClientMock, fromMock, rpcMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(),
  fromMock: vi.fn(),
  rpcMock: vi.fn(),
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

    createClientMock.mockClear();
    fromMock.mockClear();
    rpcMock.mockClear();

    fromMock.mockImplementation((table: string) => {
      const query: Record<string, ReturnType<typeof vi.fn>> = {};
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
    });
    rpcMock.mockImplementation(async (name: string) => {
      if (name === "create_reel_zone_grant_with_location") {
        return { data: "grant-1", error: null };
      }
      return { data: null, error: null };
    });
    createClientMock.mockReturnValue({ from: fromMock, rpc: rpcMock });
  });

  it("permet la découverte PostGIS sans secret HMAC et appelle uniquement le RPC de découverte", async () => {
    await expect(
      resolveReelZoneForUser("member-1", 48.8566, 2.3522, "discover"),
    ).resolves.toMatchObject({
      zoneKeys: [],
      areaLabel: "Votre secteur approximatif",
    });

    expect(rpcMock).toHaveBeenCalledTimes(2);
    expect(rpcMock).toHaveBeenNthCalledWith(1, "purge_reel_location_sessions");
    expect(rpcMock).toHaveBeenNthCalledWith(
      2,
      "create_reel_discovery_location",
      expect.objectContaining({
        p_user_id: "member-1",
        p_latitude: 48.8566,
        p_longitude: 2.3522,
        p_expires_at: expect.any(String),
      }),
    );
    expect(fromMock).toHaveBeenCalledWith("profiles");
    expect(fromMock).toHaveBeenCalledWith("reel_discovery_locations");
    expect(fromMock).not.toHaveBeenCalledWith("reel_zone_grants");
    expect(rpcMock).not.toHaveBeenCalledWith(
      "create_reel_zone_grant_with_location",
      expect.anything(),
    );
  });

  it("refuse la publication de présence sans secret HMAC", async () => {
    await expect(
      resolveReelZoneForUser("member-1", 48.8566, 2.3522, "presence"),
    ).rejects.toThrow("Missing required server configuration: REEL_ZONE_HMAC_SECRET.");

    expect(rpcMock).toHaveBeenCalledTimes(1);
    expect(rpcMock).toHaveBeenCalledWith("purge_reel_location_sessions");
    expect(rpcMock).not.toHaveBeenCalledWith(
      "create_reel_zone_grant_with_location",
      expect.anything(),
    );
  });

  it("publie une présence avec un secret HMAC valide", async () => {
    vi.stubEnv("REEL_ZONE_HMAC_SECRET", "test-reel-zone-hmac-secret-with-32-chars");

    await expect(
      resolveReelZoneForUser("member-1", 48.8566, 2.3522, "presence"),
    ).resolves.toMatchObject({
      zoneKeys: [expect.stringMatching(/^z1_[a-f0-9]{56}$/)],
      grantId: "grant-1",
    });

    expect(fromMock).toHaveBeenCalledWith("reel_zone_grants");
    expect(rpcMock).toHaveBeenCalledWith(
      "create_reel_zone_grant_with_location",
      expect.objectContaining({
        p_owner_id: "member-1",
        p_zone_key: expect.stringMatching(/^z1_[a-f0-9]{56}$/),
        p_latitude: 48.8566,
        p_longitude: 2.3522,
        p_expires_at: expect.any(String),
      }),
    );
  });
});
