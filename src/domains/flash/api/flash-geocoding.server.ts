import { getGeoapifyApiKey } from "@/config/env.server";

export interface FlashGeocodingResult {
  label: string;
  locality: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
}

type GeoapifyReverseResponse = {
  results?: Array<{
    neighbourhood?: string;
    suburb?: string;
    village?: string;
    town?: string;
    city?: string;
    municipality?: string;
    district?: string;
    county?: string;
    state?: string;
    country?: string;
  }>;
};

type CacheEntry = {
  expiresAt: number;
  value: FlashGeocodingResult | null;
};

const CACHE_TTL_MS = 24 * 60 * 60 * 1_000;
const CACHE_MAX_ENTRIES = 500;
const resultCache = new Map<string, CacheEntry>();

function clean(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function first(...values: unknown[]): string | null {
  for (const value of values) {
    const normalized = clean(value);
    if (normalized) return normalized;
  }
  return null;
}

function normalizeResult(payload: GeoapifyReverseResponse): FlashGeocodingResult | null {
  const result = payload.results?.[0];
  if (!result) return null;

  const locality = first(
    result.neighbourhood,
    result.suburb,
    result.village,
    result.town,
    result.district,
  );
  const city = first(result.city, result.municipality, result.county);
  const region = clean(result.state);
  const country = clean(result.country);
  const label = [locality, city, region, country]
    .filter((part): part is string => Boolean(part))
    .filter((part, index, parts) => parts.indexOf(part) === index)
    .join(", ");

  if (!label) return null;
  return { label, locality, city, region, country };
}

function cacheKey(latitude: number, longitude: number): string {
  // Four decimal places are used only for cache grouping, never as a public location.
  return `${latitude.toFixed(4)}:${longitude.toFixed(4)}`;
}

function readCache(key: string): FlashGeocodingResult | null | undefined {
  const entry = resultCache.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt <= Date.now()) {
    resultCache.delete(key);
    return undefined;
  }
  return entry.value;
}

function writeCache(key: string, value: FlashGeocodingResult | null): void {
  if (resultCache.size >= CACHE_MAX_ENTRIES) {
    const oldestKey = resultCache.keys().next().value;
    if (oldestKey) resultCache.delete(oldestKey);
  }
  resultCache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
}

/**
 * Reverse-geocodes a user-consented, one-shot position.
 * The API key and precise coordinates remain server-side; only address labels
 * are returned. No location is persisted by this service.
 */
export async function lookupFlashArea(
  latitude: number,
  longitude: number,
): Promise<FlashGeocodingResult | null> {
  if (
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90 ||
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error("La position reçue n’est pas valide.");
  }

  const apiKey = getGeoapifyApiKey();
  if (!apiKey) return null;

  const key = cacheKey(latitude, longitude);
  const cached = readCache(key);
  if (cached !== undefined) return cached;

  const url = new URL("https://api.geoapify.com/v1/geocode/reverse");
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("format", "json");
  url.searchParams.set("apiKey", apiKey);

  let response: Response;
  try {
    response = await fetch(url, { method: "GET", signal: AbortSignal.timeout(5_000) });
  } catch {
    throw new Error("Le service de localisation est momentanément indisponible.");
  }

  if (!response.ok) {
    throw new Error("Impossible de reconnaître ce lieu pour le moment.");
  }

  let payload: GeoapifyReverseResponse;
  try {
    payload = (await response.json()) as GeoapifyReverseResponse;
  } catch {
    throw new Error("La réponse du service de localisation est invalide.");
  }

  const normalized = normalizeResult(payload);
  writeCache(key, normalized);
  return normalized;
}
