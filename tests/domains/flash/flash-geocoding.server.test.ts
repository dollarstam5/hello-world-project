import { beforeEach, describe, expect, it, vi } from "vitest";
import { lookupFlashArea } from "@/domains/flash/api/flash-geocoding.server";

describe("Geoapify reverse geocoding", () => {
  beforeEach(() => {
    vi.stubEnv("GEOAPIFY_API_KEY", "geoapify_test_key_123456789");
  });

  it("returns no result and makes no request when the provider key is absent", async () => {
    vi.stubEnv("GEOAPIFY_API_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(lookupFlashArea(4.0511, 9.7679)).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("normalizes only available locality fields from the provider", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          results: [
            {
              neighbourhood: "Bonanjo",
              city: "Douala",
              state: "Littoral",
              country: "Cameroon",
              lat: 4.0511,
              lon: 9.7679,
            },
          ],
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await lookupFlashArea(4.0511, 9.7679);

    expect(result).toEqual({
      label: "Bonanjo, Douala, Littoral, Cameroon",
      locality: "Bonanjo",
      city: "Douala",
      region: "Littoral",
      country: "Cameroon",
    });
    const requestedUrl = new URL(fetchMock.mock.calls[0][0] as string);
    expect(requestedUrl.origin).toBe("https://api.geoapify.com");
    expect(requestedUrl.searchParams.get("apiKey")).toBe("geoapify_test_key_123456789");
    expect(result).not.toHaveProperty("latitude");
    expect(result).not.toHaveProperty("longitude");
  });

  it("does not invent a village when the provider has no locality", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ results: [{ state: "Littoral", country: "Cameroon" }] }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(lookupFlashArea(3.9012, 10.1123)).resolves.toEqual({
      label: "Littoral, Cameroon",
      locality: null,
      city: null,
      region: "Littoral",
      country: "Cameroon",
    });
  });

  it("caches a successful lookup for nearby identical cache cells", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ results: [{ city: "Douala", country: "Cameroon" }] }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    await lookupFlashArea(4.061011, 9.771011);
    await lookupFlashArea(4.061012, 9.771012);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid coordinates before contacting the provider", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(lookupFlashArea(91, 0)).rejects.toThrow("La position reçue n’est pas valide.");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns a safe error when the provider rejects the request", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("provider error", { status: 503 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(lookupFlashArea(4.0711, 9.7811)).rejects.toThrow(
      "Impossible de reconnaître ce lieu pour le moment.",
    );
  });

  it("returns a safe error when the network request fails", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("private provider details"));
    vi.stubGlobal("fetch", fetchMock);

    await expect(lookupFlashArea(4.0811, 9.7911)).rejects.toThrow(
      "Le service de localisation est momentanément indisponible.",
    );
  });
});
