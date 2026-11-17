import { afterEach, describe, expect, it, vi } from "vitest";
import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";

const currentSecret = "current-cron-secret-value-123456789";
const previousSecret = "previous-cron-secret-value-123456789";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("authentification des tâches planifiées", () => {
  it("refuse une requête sans secret configuré", async () => {
    vi.stubEnv("LOVABLE_CRON_SECRET", "");
    vi.stubEnv("LOVABLE_CRON_SECRET_PREVIOUS", "");

    const response = await authenticateCronRequest(new Request("https://vitalis.test/api/cron/maintenance"));

    expect(response?.status).toBe(500);
  });

  it("refuse une requête sans bearer token", async () => {
    vi.stubEnv("LOVABLE_CRON_SECRET", currentSecret);

    const response = await authenticateCronRequest(new Request("https://vitalis.test/api/cron/maintenance"));

    expect(response?.status).toBe(401);
  });

  it("accepte le secret courant", async () => {
    vi.stubEnv("LOVABLE_CRON_SECRET", currentSecret);

    const response = await authenticateCronRequest(
      new Request("https://vitalis.test/api/cron/maintenance", {
        headers: { Authorization: `Bearer ${currentSecret}` },
      }),
    );

    expect(response).toBeNull();
  });

  it("accepte temporairement le secret précédent pendant la rotation", async () => {
    vi.stubEnv("LOVABLE_CRON_SECRET", currentSecret);
    vi.stubEnv("LOVABLE_CRON_SECRET_PREVIOUS", previousSecret);

    const response = await authenticateCronRequest(
      new Request("https://vitalis.test/api/cron/maintenance", {
        headers: { Authorization: `Bearer ${previousSecret}` },
      }),
    );

    expect(response).toBeNull();
  });

  it("refuse un secret incorrect", async () => {
    vi.stubEnv("LOVABLE_CRON_SECRET", currentSecret);

    const response = await authenticateCronRequest(
      new Request("https://vitalis.test/api/cron/maintenance", {
        headers: { Authorization: "Bearer wrong-secret-value-123456789012345" },
      }),
    );

    expect(response?.status).toBe(401);
  });
});
