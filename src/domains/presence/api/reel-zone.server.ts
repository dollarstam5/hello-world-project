import { createClient } from "@supabase/supabase-js";
import { getPublicServerEnvironment, getReelZoneHmacSecret, getSupabaseServiceRoleKey } from "@/config/env.server";

export type ReelZonePurpose = "discover" | "presence";
export interface ReelZoneResolution {
  zoneKeys: string[];
  zoneKey?: string;
  grantId?: string;
  areaLabel: string;
  expiresAt: string;
}

function createAdminClient() {
  const { supabaseUrl } = getPublicServerEnvironment();
  return createClient(supabaseUrl, getSupabaseServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

function cellFor(latitude: number, longitude: number) {
  // A 200 m grid intentionally reduces precision before any zone token is made.
  const latitudeStep = 200 / 111_320;
  const longitudeStep = 200 / (111_320 * Math.max(Math.cos(latitude * Math.PI / 180), 0.01));
  return {
    latitude: Math.floor(latitude / latitudeStep),
    longitude: Math.floor(longitude / longitudeStep),
  };
}

async function tokenForCell(latitudeCell: number, longitudeCell: number, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`v1:${latitudeCell}:${longitudeCell}`),
  );
  const hex = Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `z1_${hex.slice(0, 56)}`;
}

/**
 * Accepts a one-shot, user-authorized device fix and stores it only in a
 * service-role-only PostGIS table with a short expiry. Coordinates are never
 * returned to the browser or exposed in discovery results.
 */
export async function resolveReelZoneForUser(
  userId: string,
  latitude: number,
  longitude: number,
  purpose: ReelZonePurpose,
): Promise<ReelZoneResolution> {
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
      !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error("La position reçue n’est pas valide.");
  }

  const admin = createAdminClient();
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .eq("status", "active")
    .is("deleted_at", null)
    .maybeSingle();
  if (profileError || !profile) throw new Error("Un profil Vitalis actif est nécessaire pour cette action.");

  const secret = getReelZoneHmacSecret();
  const { error: cleanupError } = await admin.rpc("purge_reel_location_sessions");
  if (cleanupError) throw new Error("Impossible de préparer la découverte à proximité.");
  const expiresAt = new Date(Date.now() + (purpose === "discover" ? 15 : 5) * 60_000).toISOString();
  const throttleSince = new Date(Date.now() - 5_000).toISOString();

  if (purpose === "discover") {
    const { data: recentDiscovery, error: throttleError } = await admin
      .from("reel_discovery_locations")
      .select("user_id")
      .eq("user_id", userId)
      .gt("created_at", throttleSince)
      .limit(1)
      .maybeSingle();
    if (throttleError) throw new Error("Impossible de vérifier votre demande de découverte.");
    if (recentDiscovery) throw new Error("Patientez quelques secondes avant de relancer la découverte.");

    const { error } = await admin.rpc("create_reel_discovery_location", {
      p_user_id: userId,
      p_latitude: latitude,
      p_longitude: longitude,
      p_expires_at: expiresAt,
    });
    if (error) throw new Error("Impossible d’ouvrir la découverte à proximité pour le moment.");
    return { zoneKeys: [], areaLabel: "Votre secteur approximatif", expiresAt };
  }

  const cell = cellFor(latitude, longitude);
  const centerKey = await tokenForCell(cell.latitude, cell.longitude, secret);
  const { data: recentGrant, error: grantThrottleError } = await admin
    .from("reel_zone_grants")
    .select("id")
    .eq("owner_id", userId)
    .gt("created_at", throttleSince)
    .limit(1)
    .maybeSingle();
  if (grantThrottleError) throw new Error("Impossible de vérifier votre demande de présence.");
  if (recentGrant) throw new Error("Patientez quelques secondes avant de réessayer.");

  const { data: grantId, error } = await admin.rpc("create_reel_zone_grant_with_location", {
    p_owner_id: userId,
    p_zone_key: centerKey,
    p_latitude: latitude,
    p_longitude: longitude,
    p_expires_at: expiresAt,
  });
  if (error || !grantId) throw new Error("Impossible de préparer votre présence pour le moment.");
  return { zoneKeys: [centerKey], zoneKey: centerKey, grantId: grantId as string, areaLabel: "Votre secteur approximatif", expiresAt };
}
