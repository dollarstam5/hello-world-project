import { createClient } from "@supabase/supabase-js";
import {
  getCookie,
  getRequest,
  setCookie,
  deleteCookie,
  setResponseHeader,
} from "@tanstack/react-start/server";
import { getPublicServerEnvironment, getSupabaseServiceRoleKey } from "@/config/env.server";

const COOKIE_NAME = "__Host-vitalis_reel_guest";
const SESSION_TTL_SECONDS = 60 * 60;
const SESSION_PURPOSE = "reel_guest" as const;

type GuestSessionRow = {
  id: string;
  token_hash: string;
  purpose: string;
  created_at: string;
  last_seen_at: string;
  expires_at: string;
  revoked_at: string | null;
};

function createAdminClient() {
  const { supabaseUrl } = getPublicServerEnvironment();
  return createClient(supabaseUrl, getSupabaseServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/" as const,
    maxAge,
  };
}

function assertSameOrigin(mutating: boolean) {
  const request = getRequest();
  if (!request) throw new Error("Requête indisponible.");
  const origin = request.headers.get("origin");
  if (!origin && !mutating) return;
  if (!origin || new URL(origin).origin !== new URL(request.url).origin) {
    throw new Error("Origine de requête refusée.");
  }
}

async function digestToken(token: string): Promise<string> {
  const bytes = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function newToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function noStore() {
  setResponseHeader("Cache-Control", "no-store");
  setResponseHeader("Vary", "Cookie, Authorization");
}

async function currentSession(): Promise<GuestSessionRow | null> {
  const token = getCookie(COOKIE_NAME);
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const admin = createAdminClient();
  const hash = await digestToken(token);
  const { data, error } = await admin
    .from("reel_guest_sessions")
    .select("id, token_hash, purpose, created_at, last_seen_at, expires_at, revoked_at")
    .eq("token_hash", hash)
    .eq("purpose", SESSION_PURPOSE)
    .is("revoked_at", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (error) throw new Error("Impossible de vérifier la session invitée.");
  return (data as GuestSessionRow | null) ?? null;
}

export async function createReelGuestSession() {
  assertSameOrigin(true);
  noStore();

  // A browser carrying an Authorization header must use the member path,
  // never silently downgrade an authenticated request to guest mode.
  const request = getRequest();
  if (request.headers.has("authorization")) {
    throw new Error("Une session membre ne peut pas démarrer une session invitée.");
  }

  const existing = await currentSession();
  if (existing) {
    const remaining = Math.max(
      1,
      Math.floor((Date.parse(existing.expires_at) - Date.now()) / 1000),
    );
    setCookie(COOKIE_NAME, getCookie(COOKIE_NAME)!, cookieOptions(remaining));
    return { active: true, expiresAt: existing.expires_at };
  }

  const token = newToken();
  const tokenHash = await digestToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString();
  const admin = createAdminClient();

  const { error } = await admin.from("reel_guest_sessions").insert({
    token_hash: tokenHash,
    purpose: SESSION_PURPOSE,
    expires_at: expiresAt,
  });
  if (error) throw new Error("Impossible de démarrer la session invitée.");

  setCookie(COOKIE_NAME, token, cookieOptions(SESSION_TTL_SECONDS));
  return { active: true, expiresAt };
}

export async function readReelGuestSession() {
  assertSameOrigin(false);
  noStore();
  const request = getRequest();
  if (request.headers.has("authorization")) {
    const token = getCookie(COOKIE_NAME);
    if (token && /^[a-f0-9]{64}$/.test(token)) {
      const admin = createAdminClient();
      const tokenHash = await digestToken(token);
      const { data: session, error: lookupError } = await admin
        .from("reel_guest_sessions")
        .select("id")
        .eq("token_hash", tokenHash)
        .eq("purpose", SESSION_PURPOSE)
        .is("revoked_at", null)
        .maybeSingle();
      if (lookupError) throw new Error("Impossible de vérifier la session invitée.");
      if (session) {
        const now = new Date().toISOString();
        const { error: discoveryError } = await admin
          .from("reel_guest_discovery_locations")
          .delete()
          .eq("guest_session_id", session.id);
        if (discoveryError) throw new Error("Impossible de fermer la découverte invitée.");
        const { error: presenceError } = await admin
          .from("reel_guest_presences")
          .delete()
          .eq("guest_session_id", session.id);
        if (presenceError) throw new Error("Impossible de terminer la présence invitée.");
        const { error } = await admin
          .from("reel_guest_sessions")
          .update({ revoked_at: now })
          .eq("id", session.id)
          .is("revoked_at", null);
        if (error) throw new Error("Impossible de terminer la session invitée.");
      }
    }
    deleteCookie(COOKIE_NAME, cookieOptions(0));
    return { active: false as const };
  }

  const session = await currentSession();
  if (!session) {
    deleteCookie(COOKIE_NAME, cookieOptions(0));
    return { active: false as const };
  }

  // last_seen_at is intentionally not updated on every request to avoid
  // creating a high-write activity trail for temporary visitors.
  return { active: true as const, expiresAt: session.expires_at };
}

export async function revokeReelGuestSession() {
  assertSameOrigin(true);
  noStore();
  const token = getCookie(COOKIE_NAME);
  if (token && /^[a-f0-9]{64}$/.test(token)) {
    const admin = createAdminClient();
    const tokenHash = await digestToken(token);
    const { data: session, error: lookupError } = await admin
      .from("reel_guest_sessions")
      .select("id")
      .eq("token_hash", tokenHash)
      .eq("purpose", SESSION_PURPOSE)
      .is("revoked_at", null)
      .maybeSingle();
    if (lookupError) throw new Error("Impossible de vérifier la session invitée.");
    if (session) {
      const now = new Date().toISOString();
      const { error: discoveryError } = await admin
        .from("reel_guest_discovery_locations")
        .delete()
        .eq("guest_session_id", session.id);
      if (discoveryError) throw new Error("Impossible de fermer la découverte invitée.");
      const { error: presenceError } = await admin
        .from("reel_guest_presences")
        .delete()
        .eq("guest_session_id", session.id)
        .eq("status", "active");
      if (presenceError) throw new Error("Impossible de terminer la présence invitée.");
      const { error } = await admin
        .from("reel_guest_sessions")
        .update({ revoked_at: now })
        .eq("id", session.id)
        .is("revoked_at", null);
      if (error) throw new Error("Impossible de terminer la session invitée.");
      const { error: interactionCleanupError } = await admin.rpc("purge_reel_guest_interactions");
      if (interactionCleanupError) throw new Error("Impossible de supprimer les interactions temporaires.");
      const { error: interactionCleanupError } = await admin.rpc("purge_reel_guest_interactions");
      if (interactionCleanupError) throw new Error("Impossible de supprimer les interactions temporaires.");
    }
  }
  deleteCookie(COOKIE_NAME, cookieOptions(0));
  return { active: false as const };
}
export interface ReelGuestPresenceInput {
  displayName: string;
  avatarKey: string;
  areaLabel: string;
  description: string;
  radiusM: 10 | 25 | 50 | 100 | 1000;
  latitude: number;
  longitude: number;
  durationMinutes: 30 | 60 | 120 | 180 | 360 | 720 | 1440;
  consent: true;
}

export async function startReelGuestPresence(input: ReelGuestPresenceInput) {
  assertSameOrigin(true);
  noStore();
  const request = getRequest();
  if (!request) throw new Error("Requête indisponible.");
  if (request.headers.has("authorization")) {
    throw new Error("Une session membre doit utiliser son propre accès Réel.");
  }
  const session = await currentSession();
  if (!session) throw new Error("Votre accès invité a expiré. Ouvrez une nouvelle session.");
  if (
    !Number.isFinite(input.latitude) ||
    input.latitude < -90 ||
    input.latitude > 90 ||
    !Number.isFinite(input.longitude) ||
    input.longitude < -180 ||
    input.longitude > 180
  ) {
    throw new Error("La position reçue n’est pas valide.");
  }
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("create_reel_guest_presence", {
    p_guest_session_id: session.id,
    p_display_name: input.displayName,
    p_avatar_key: input.avatarKey,
    p_area_label: input.areaLabel,
    p_description: input.description,
    p_radius_m: input.radiusM,
    p_latitude: input.latitude,
    p_longitude: input.longitude,
    p_duration_minutes: input.durationMinutes,
    p_consent: input.consent,
  });
  if (error || !data) {
    throw new Error("Impossible de publier votre présence invitée pour le moment.");
  }
  const { data: presence, error: readError } = await admin
    .from("reel_guest_presences")
    .select("expires_at")
    .eq("id", data as string)
    .eq("guest_session_id", session.id)
    .maybeSingle();
  if (readError || !presence) {
    throw new Error("Impossible de confirmer votre présence invitée.");
  }
  return { presenceId: data as string, expiresAt: presence.expires_at as string };
}

export async function endReelGuestPresence(presenceId: string) {
  assertSameOrigin(true);
  noStore();
  if (getRequest().headers.has("authorization")) {
    throw new Error("Une session membre doit utiliser son propre accès Réel.");
  }
  const session = await currentSession();
  if (!session) return { ended: false as const };
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("end_reel_guest_presence", {
    p_guest_session_id: session.id,
    p_presence_id: presenceId,
  });
  if (error) throw new Error("Impossible de terminer votre présence invitée.");
  return { ended: data === true };
}
export interface ReelGuestDiscoveryCard {
  presence_id: string;
  actor_kind: "member" | "guest";
  display_name: string;
  avatar_media_id: string | null;
  avatar_key: string | null;
  area_label: string;
  description: string;
  radius_m: number;
  started_at: number;
  expires_at: number;
}

export async function discoverReelGuestNearby(latitude: number, longitude: number) {
  assertSameOrigin(true);
  noStore();
  const request = getRequest();
  if (request.headers.has("authorization")) {
    throw new Error("Une session membre doit utiliser son propre accès Réel.");
  }
  const session = await currentSession();
  if (!session) throw new Error("Votre accès invité a expiré. Ouvrez une nouvelle session.");
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

  const admin = createAdminClient();
  const throttleSince = new Date(Date.now() - 5_000).toISOString();
  const { data: recent, error: throttleError } = await admin
    .from("reel_guest_discovery_locations")
    .select("guest_session_id")
    .eq("guest_session_id", session.id)
    .gt("created_at", throttleSince)
    .limit(1)
    .maybeSingle();
  if (throttleError) throw new Error("Impossible de vérifier votre demande de découverte.");
  if (recent) {
    throw new Error("Patientez quelques secondes avant de relancer la découverte.");
  }

  const expiresAt = new Date(Date.now() + 15 * 60_000).toISOString();
  const { error: locationError } = await admin.rpc("create_reel_guest_discovery_location", {
    p_guest_session_id: session.id,
    p_latitude: latitude,
    p_longitude: longitude,
    p_expires_at: expiresAt,
  });
  if (locationError) {
    throw new Error("Impossible d’ouvrir la découverte à proximité pour le moment.");
  }

  const { data, error } = await admin.rpc("list_reel_guest_discovery_presence", {
    p_guest_session_id: session.id,
    p_limit: 30,
  });
  if (error || !Array.isArray(data)) {
    throw new Error("Les personnes à proximité n’ont pas pu être chargées.");
  }
  return data as ReelGuestDiscoveryCard[];
}

export async function getMyReelGuestPresence() {
  assertSameOrigin(false);
  noStore();
  const request = getRequest();
  if (!request) throw new Error("Requête indisponible.");
  if (request.headers.has("authorization")) {
    throw new Error("Une session membre doit utiliser son propre accès Réel.");
  }
  const session = await currentSession();
  if (!session) return null;
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("reel_guest_presences")
    .select(
      "id, display_name, avatar_key, area_label, description, radius_m, started_at, expires_at",
    )
    .eq("guest_session_id", session.id)
    .eq("status", "active")
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (error) throw new Error("Votre présence invitée n’a pas pu être retrouvée.");
  return data;
}


export async function sendReelGuestBip(
  recipientActorKind: "member" | "guest",
  recipientPresenceId: string,
  clientRequestId: string,
) {
  assertSameOrigin(true);
  noStore();
  const request = getRequest();
  if (!request || request.headers.has("authorization")) {
    throw new Error("Une session membre doit utiliser son propre accès Réel.");
  }
  const session = await currentSession();
  if (!session) throw new Error("Votre accès invité a expiré. Ouvrez une nouvelle session.");
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("send_reel_guest_bip", {
    p_guest_session_id: session.id,
    p_recipient_actor_kind: recipientActorKind,
    p_recipient_presence_id: recipientPresenceId,
    p_client_request_id: clientRequestId,
  });
  if (error || !data) throw new Error("Votre signe n’a pas pu être envoyé pour le moment.");
  return data;
}

export async function listMyReelGuestBips() {
  assertSameOrigin(false);
  noStore();
  const request = getRequest();
  if (!request || request.headers.has("authorization")) {
    throw new Error("Une session membre doit utiliser son propre accès Réel.");
  }
  const session = await currentSession();
  if (!session) return [];
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("list_reel_guest_bips_for_session", {
    p_guest_session_id: session.id,
  });
  if (error || !Array.isArray(data)) throw new Error("Vos bips n’ont pas pu être chargés.");
  return data;
}

export async function commandMyReelGuestBip(bipId: string, action: "accept" | "decline" | "withdraw") {
  assertSameOrigin(true);
  noStore();
  const request = getRequest();
  if (!request || request.headers.has("authorization")) {
    throw new Error("Une session membre doit utiliser son propre accès Réel.");
  }
  const session = await currentSession();
  if (!session) throw new Error("Votre accès invité a expiré. Ouvrez une nouvelle session.");
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("command_reel_guest_bip_guest", {
    p_guest_session_id: session.id,
    p_bip_id: bipId,
    p_action: action,
  });
  if (error || !data) throw new Error("Cette action sur le bip n’a pas pu aboutir.");
  return data;
}

export async function listMyReelGuestConnections() {
  assertSameOrigin(false);
  noStore();
  const request = getRequest();
  if (!request || request.headers.has("authorization")) {
    throw new Error("Une session membre doit utiliser son propre accès Réel.");
  }
  const session = await currentSession();
  if (!session) return [];
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("list_reel_guest_connections_for_session", {
    p_guest_session_id: session.id,
  });
  if (error || !Array.isArray(data)) throw new Error("Vos mises en relation n’ont pas pu être chargées.");
  return data;
}

export async function closeMyReelGuestConnection(connectionId: string) {
  assertSameOrigin(true);
  noStore();
  const request = getRequest();
  if (!request || request.headers.has("authorization")) {
    throw new Error("Une session membre doit utiliser son propre accès Réel.");
  }
  const session = await currentSession();
  if (!session) throw new Error("Votre accès invité a expiré. Ouvrez une nouvelle session.");
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("close_reel_guest_connection_guest", {
    p_guest_session_id: session.id,
    p_connection_id: connectionId,
  });
  if (error || !data) throw new Error("Cette mise en relation n’a pas pu être fermée.");
  return data;
}
