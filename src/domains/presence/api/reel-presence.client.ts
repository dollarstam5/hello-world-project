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

type ReelRpcName =
  | "start_reel_presence"
  | "end_reel_presence"
  | "list_reel_presence"
  | "send_reel_bip"
  | "command_reel_bip"
  | "list_reel_bips";

type ReelRpcArgs = Record<string, string | number | boolean | null>;

async function callReelRpc<T>(name: ReelRpcName, args: ReelRpcArgs = {}): Promise<T> {
  // The generated Supabase schema snapshot predates the Reel migration.
  // Keep the cast local until the generated types are refreshed from Supabase.
  const client = supabase as unknown as {
    rpc: (fn: ReelRpcName, params: ReelRpcArgs) => Promise<{ data: unknown; error: { message: string } | null }>;
  };
  const { data, error } = await client.rpc(name, args);
  if (error) throw new Error(error.message || "Cette action n’a pas pu aboutir.");
  return data as T;
}

function requireText(value: string, label: string, min: number, max: number): string {
  const normalized = value.trim();
  if (normalized.length < min || normalized.length > max) {
    throw new Error(label);
  }
  return normalized;
}

export interface StartReelPresenceInput {
  /** Opaque zone token returned by the trusted location/zone resolver. */
  zoneKey: string;
  areaLabel: string;
  description: string;
  radiusMeters: 10 | 25 | 50 | 100 | 1000;
  durationMinutes: 30 | 60 | 120 | 180 | 360 | 720 | 1440;
  consent: boolean;
}

export async function startReelPresence(input: StartReelPresenceInput): Promise<ReelPresence> {
  if (!input.consent) throw new Error("Votre accord est nécessaire pour partager votre présence.");
  if (!/^[a-z0-9_-]{8,64}$/.test(input.zoneKey)) throw new Error("La zone de proximité n’est pas valide.");
  const areaLabel = requireText(input.areaLabel, "Précisez un lieu entre 2 et 80 caractères.", 2, 80);
  const description = requireText(input.description, "La description doit contenir entre 1 et 180 caractères.", 1, 180);
  return callReelRpc<ReelPresence>("start_reel_presence", {
    p_zone_key: input.zoneKey,
    p_area_label: areaLabel,
    p_description: description,
    p_radius_m: input.radiusMeters,
    p_duration_minutes: input.durationMinutes,
    p_consent: true,
  });
}

export async function endReelPresence(presenceId: string): Promise<ReelPresence> {
  if (!presenceId) throw new Error("La présence demandée est introuvable.");
  return callReelRpc<ReelPresence>("end_reel_presence", { p_presence_id: presenceId });
}

export async function listReelNearbyPresence(zoneKey: string, limit = 30): Promise<ReelNearbyPresence[]> {
  if (!/^[a-z0-9_-]{8,64}$/.test(zoneKey)) throw new Error("La zone de proximité n’est pas valide.");
  const rows = await callReelRpc<ReelNearbyPresence[]>("list_reel_presence", {
    p_zone_key: zoneKey,
    p_limit: Math.min(Math.max(Math.floor(limit), 1), 50),
  });
  return rows ?? [];
}

export async function sendReelBip(recipientPresenceId: string, clientRequestId = crypto.randomUUID()): Promise<ReelBip> {
  if (!recipientPresenceId) throw new Error("Cette personne n’est plus disponible.");
  return callReelRpc<ReelBip>("send_reel_bip", {
    p_recipient_presence_id: recipientPresenceId,
    p_client_request_id: clientRequestId,
  });
}

export async function commandReelBip(
  bipId: string,
  action: "accept" | "decline" | "withdraw",
): Promise<ReelBip> {
  if (!bipId) throw new Error("Ce bip n’est plus disponible.");
  return callReelRpc<ReelBip>("command_reel_bip", {
    p_bip_id: bipId,
    p_action: action,
  });
}

export async function listReelBips(): Promise<ReelBip[]> {
  const rows = await callReelRpc<ReelBip[]>("list_reel_bips");
  return rows ?? [];
}
