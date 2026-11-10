import { supabase } from "@/integrations/supabase/client";

export interface ReelPresence {
  id: string;
  owner_id: string;
  zone_key: string;
  area_label: string;
  description: string;
  radius_m: number;
  started_at: number;
  expires_at: number;
  ended_at: number | null;
  consented_at: number;
  status: "active" | "ended" | "expired";
}

export interface ReelNearbyPresence {
  presence_id: string;
  user_id: string;
  display_name: string;
  avatar_media_id: string | null;
  area_label: string;
  description: string;
  radius_m: number;
  started_at: number;
  expires_at: number;
}

export interface ReelNearbyGuestPresence {
  presence_id: string;
  display_name: string;
  avatar_key: string;
  area_label: string;
  description: string;
  radius_m: number;
  started_at: number;
  expires_at: number;
}

export interface ReelBip {
  id: string;
  client_request_id: string;
  sender_id: string;
  recipient_id: string;
  sender_presence_id: string;
  recipient_presence_id: string;
  status: "pending" | "accepted" | "declined" | "withdrawn" | "expired";
  created_at: number;
  updated_at: number;
  expires_at: number;
  resolved_at: number | null;
}

export interface ReelConnection {
  connection_id: string;
  partner_id: string;
  partner_display_name: string;
  partner_avatar_media_id: string | null;
  status: "active" | "closed";
  created_at: string;
  closed_at: string | null;
  closed_by: string | null;
}

type ReelRpcName =
  | "get_my_active_reel_presence"
  | "end_reel_presence"
  | "list_reel_discovery_presence"
  | "list_reel_guest_presence_for_member"
  | "start_reel_presence_from_grant"
  | "send_reel_bip"
  | "command_reel_bip"
  | "list_reel_bips"
  | "list_reel_connections"
  | "close_reel_connection"
  | "send_reel_bip_to_guest"
  | "command_reel_guest_bip_member"
  | "list_reel_guest_bips_for_member"
  | "list_reel_guest_connections_for_member"
  | "close_reel_guest_connection_member";

type ReelRpcArgs = Record<string, string | number | boolean | null>;

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ALLOWED_RADII = [10, 25, 50, 100, 1000] as const;
const ALLOWED_DURATIONS = [30, 60, 120, 180, 360, 720, 1440] as const;

async function callReelRpc<T>(name: ReelRpcName, args: ReelRpcArgs = {}): Promise<T> {
  // The generated Supabase schema snapshot predates the Reel migration.
  // Keep the cast local until the generated types are refreshed from Supabase.
  const client = supabase as unknown as {
    rpc: (
      fn: ReelRpcName,
      params: ReelRpcArgs,
    ) => Promise<{ data: unknown; error: { message: string } | null }>;
  };
  const { data, error } = await client.rpc(name, args);
  if (error) throw new Error(error.message || "Cette action n’a pas pu aboutir.");
  if (data === null || data === undefined) {
    throw new Error("Le service Réel n’a pas renvoyé de réponse.");
  }
  return data as T;
}

function requireText(value: string, message: string, min: number, max: number): string {
  const normalized = value.trim();
  if (normalized.length < min || normalized.length > max) throw new Error(message);
  return normalized;
}

function requireUuid(value: string, message: string): string {
  if (!UUID_PATTERN.test(value)) throw new Error(message);
  return value;
}

function createRequestId(): string {
  const randomUUID = globalThis.crypto?.randomUUID;
  if (typeof randomUUID !== "function") {
    throw new Error(
      "Votre appareil ne permet pas encore de sécuriser cette demande. Réessayez dans un navigateur à jour.",
    );
  }
  return randomUUID.call(globalThis.crypto);
}

export interface StartReelPresenceInput {
  /** One-use server-issued grant; the browser never chooses the published zone. */
  zoneGrantId: string;
  areaLabel: string;
  description: string;
  radiusMeters: 10 | 25 | 50 | 100 | 1000;
  durationMinutes: 30 | 60 | 120 | 180 | 360 | 720 | 1440;
  consent: boolean;
}

export async function startReelPresence(input: StartReelPresenceInput): Promise<ReelPresence> {
  if (!input.consent) throw new Error("Votre accord est nécessaire pour partager votre présence.");
  requireUuid(input.zoneGrantId, "Votre autorisation de présence n’est plus valide. Réessayez.");
  if (!(ALLOWED_RADII as readonly number[]).includes(input.radiusMeters)) {
    throw new Error("Choisissez une distance proposée.");
  }
  if (!(ALLOWED_DURATIONS as readonly number[]).includes(input.durationMinutes)) {
    throw new Error("Choisissez une durée proposée.");
  }

  const areaLabel = requireText(
    input.areaLabel,
    "Précisez un lieu entre 2 et 80 caractères.",
    2,
    80,
  );
  const description = requireText(
    input.description,
    "La description doit contenir entre 1 et 180 caractères.",
    1,
    180,
  );
  return callReelRpc<ReelPresence>("start_reel_presence_from_grant", {
    p_zone_grant_id: input.zoneGrantId,
    p_area_label: areaLabel,
    p_description: description,
    p_radius_m: input.radiusMeters,
    p_duration_minutes: input.durationMinutes,
    p_consent: true,
  });
}

export async function getMyActiveReelPresence(): Promise<ReelPresence | null> {
  const rows = await callReelRpc<ReelPresence[]>("get_my_active_reel_presence");
  if (!Array.isArray(rows)) throw new Error("Votre présence actuelle n’a pas pu être vérifiée.");
  return rows[0] ?? null;
}

export async function endReelPresence(presenceId: string): Promise<ReelPresence> {
  requireUuid(presenceId, "La présence demandée est introuvable.");
  return callReelRpc<ReelPresence>("end_reel_presence", { p_presence_id: presenceId });
}

export async function listReelNearbyPresence(limit = 30): Promise<ReelNearbyPresence[]> {
  if (!Number.isFinite(limit)) throw new Error("Le nombre de résultats demandé n’est pas valide.");
  const safeLimit = Math.min(Math.max(Math.floor(limit), 1), 50);
  const rows = await callReelRpc<ReelNearbyPresence[]>("list_reel_discovery_presence", {
    p_limit: safeLimit,
  });
  if (!Array.isArray(rows)) throw new Error("La liste des présences reçue n’est pas valide.");
  return rows;
}

export async function listReelNearbyGuestPresence(limit = 30): Promise<ReelNearbyGuestPresence[]> {
  if (!Number.isFinite(limit)) throw new Error("Le nombre de résultats demandé n’est pas valide.");
  const safeLimit = Math.min(Math.max(Math.floor(limit), 1), 50);
  const rows = await callReelRpc<ReelNearbyGuestPresence[]>("list_reel_guest_presence_for_member", {
    p_limit: safeLimit,
  });
  if (!Array.isArray(rows)) throw new Error("La liste des invités à proximité n’est pas valide.");
  return rows;
}

export async function sendReelBip(
  recipientPresenceId: string,
  clientRequestId = createRequestId(),
): Promise<ReelBip> {
  requireUuid(recipientPresenceId, "Cette personne n’est plus disponible.");
  requireUuid(clientRequestId, "La demande de bip n’est pas valide.");
  return callReelRpc<ReelBip>("send_reel_bip", {
    p_recipient_presence_id: recipientPresenceId,
    p_client_request_id: clientRequestId,
  });
}

export async function commandReelBip(
  bipId: string,
  action: "accept" | "decline" | "withdraw",
): Promise<ReelBip> {
  requireUuid(bipId, "Ce bip n’est plus disponible.");
  if (action !== "accept" && action !== "decline" && action !== "withdraw") {
    throw new Error("Cette action sur le bip n’est pas reconnue.");
  }
  return callReelRpc<ReelBip>("command_reel_bip", {
    p_bip_id: bipId,
    p_action: action,
  });
}

export async function listReelBips(): Promise<ReelBip[]> {
  const rows = await callReelRpc<ReelBip[]>("list_reel_bips");
  if (!Array.isArray(rows)) throw new Error("La liste des bips reçue n’est pas valide.");
  return rows;
}

export async function listReelConnections(): Promise<ReelConnection[]> {
  const rows = await callReelRpc<ReelConnection[]>("list_reel_connections");
  if (!Array.isArray(rows))
    throw new Error("Votre historique de rencontres n’a pas pu être chargé.");
  return rows;
}

export async function closeReelConnection(connectionId: string): Promise<void> {
  requireUuid(connectionId, "Cette mise en relation n’est plus disponible.");
  await callReelRpc<unknown>("close_reel_connection", { p_connection_id: connectionId });
}


export interface ReelGuestBip {
  id: string;
  status: "pending" | "accepted" | "declined" | "withdrawn" | "expired";
  created_at: string;
  expires_at: string;
  is_recipient: boolean;
}

export interface ReelGuestConnection {
  connection_id: string;
  status: "active" | "closed";
  created_at: string;
  expires_at: string;
  closed_at: string | null;
  partner_display_name: string;
}

export async function sendReelBipToGuest(
  recipientGuestPresenceId: string,
  clientRequestId = createRequestId(),
): Promise<ReelGuestBip> {
  requireUuid(recipientGuestPresenceId, "Cette personne n’est plus disponible.");
  requireUuid(clientRequestId, "La demande de bip n’est pas valide.");
  return callReelRpc<ReelGuestBip>("send_reel_bip_to_guest", {
    p_recipient_guest_presence_id: recipientGuestPresenceId,
    p_client_request_id: clientRequestId,
  });
}

export async function commandReelGuestBipMember(
  bipId: string,
  action: "accept" | "decline" | "withdraw",
): Promise<ReelGuestBip> {
  requireUuid(bipId, "Ce bip n’est plus disponible.");
  return callReelRpc<ReelGuestBip>("command_reel_guest_bip_member", {
    p_bip_id: bipId,
    p_action: action,
  });
}

export async function listReelGuestBipsForMember(): Promise<ReelGuestBip[]> {
  const rows = await callReelRpc<ReelGuestBip[]>("list_reel_guest_bips_for_member");
  if (!Array.isArray(rows)) throw new Error("La liste des bips reçue n’est pas valide.");
  return rows;
}

export async function listReelGuestConnectionsForMember(): Promise<ReelGuestConnection[]> {
  const rows = await callReelRpc<ReelGuestConnection[]>("list_reel_guest_connections_for_member");
  if (!Array.isArray(rows)) throw new Error("Vos mises en relation n’ont pas pu être chargées.");
  return rows;
}

export async function closeReelGuestConnectionForMember(connectionId: string): Promise<void> {
  requireUuid(connectionId, "Cette mise en relation n’est plus disponible.");
  await callReelRpc<unknown>("close_reel_guest_connection_member", {
    p_connection_id: connectionId,
  });
}
