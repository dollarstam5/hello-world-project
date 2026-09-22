import { describe, expect, it, vi } from "vitest";
import {
  getAiEnvironment,
  getPublicServerEnvironment,
  getSupabaseServiceRoleKey,
} from "@/config/env.server";

describe("configuration serveur", () => {
  it("accepte une configuration Supabase HTTPS explicite", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SUPABASE_URL", "https://project.supabase.co");
    vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "sb_publishable_public_test_value");

    expect(getPublicServerEnvironment()).toMatchObject({
      nodeEnv: "production",
      supabaseUrl: "https://project.supabase.co",
    });
  });

  it("refuse un secret Supabase déclaré comme clé publique", () => {
    vi.stubEnv("SUPABASE_URL", "https://project.supabase.co");
    vi.stubEnv(
      "SUPABASE_PUBLISHABLE_KEY",
      ["sb", "secret", "this_must_never_reach_the_browser"].join("_"),
    );

    expect(() => getPublicServerEnvironment()).toThrow("contains a server secret");
  });

  it("privilégie le nom canonique de la clé service role", () => {
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "canonical_service_role_key_1234567890");
    vi.stubEnv("SUPABASE_SECRET_KEY", "legacy_service_role_key_1234567890123");

    expect(getSupabaseServiceRoleKey()).toBe("canonical_service_role_key_1234567890");
  });

  it("autorise le mode Vita local sans fournisseur externe", () => {
    vi.stubEnv("CLOUDFLARE_ACCOUNT_ID", "");
    vi.stubEnv("CLOUDFLARE_AI_API_TOKEN", "");

    expect(getAiEnvironment()).toBeNull();
  });
});
