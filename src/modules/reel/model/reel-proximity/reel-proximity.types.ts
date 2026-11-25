import type { MessageKey } from "@/lib/i18n/messages";

export interface Person {
  id: string;
  name: string;
  avatarUrl: string | null;
  initials: string;
  angle: number;
  description?: string | null;
  category?: string | null;
  locationLabel?: string | null;
  distanceLabel?: string | null;
  actorKind?: "member" | "guest";
  avatarKey?: string | null;
}

export type Panel = "settings" | "activity" | "people" | "global" | null;
export type ActivityTab = "notifications" | "bips" | "connections";

export type ReelAmbiance = {
  status: "idle" | "scanning" | "live" | "dense";
  count: number;
  labelKey: MessageKey;
};

export type RawNearbyPerson = {
  presence_id: string;
  display_name?: string | null;
  avatar_key?: string | null;
  description?: string | null;
  area_label?: string | null;
  actor_kind?: "member" | "guest" | null;
};

export type PresenceCacheEntry = {
  people: Person[];
  timestamp: number;
  mode: "member" | "guest";
};
