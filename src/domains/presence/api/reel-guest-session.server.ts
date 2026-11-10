import { createClient } from "@supabase/supabase-js";
import { getCookie, getRequest, setCookie, deleteCookie, setResponseHeader } from "@tanstack/react-start/server";
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
    const remaining = Math.max(1, Math.floor((Date.parse(existing.expires_at) - Date.now()) / 1000));
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
      const { error } = await admin
        .from("reel_guest_sessions")
        .update({ revoked_at: new Date().toISOString() })
        .eq("token_hash", tokenHash)
        .is("revoked_at", null);
      if (error) throw new Error("Impossible de terminer la session invitée.");
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
    const { error } = await admin
      .from("reel_guest_sessions")
      .update({ revoked_at: new Date().toISOString() })
      .eq("token_hash", tokenHash)
      .is("revoked_at", null);
    if (error) throw new Error("Impossible de terminer la session invitée.");
  }
  deleteCookie(COOKIE_NAME, cookieOptions(0));
  return { active: false as const };
}

