import type {
  FlashCategory,
  FlashKind,
  FlashRecord,
  FlashStatus,
  FlashTimeSlot,
} from "@eco/core-contracts";

/** A flash is visible when it is live, not deleted and not past its expiry. */
export function isFlashVisible(flash: FlashRecord, now = Date.now()): boolean {
  if (flash.deletedAt !== null) return false;
  if (flash.status !== "live") return false;
  return flash.expiresAt === null || flash.expiresAt > now;
}

/** Resolves the status a flash should have right now, without mutating it. */
export function resolveFlashStatus(flash: FlashRecord, now = Date.now()): FlashStatus {
  if (flash.status === "live" && flash.expiresAt !== null && flash.expiresAt <= now) {
    return "expired";
  }
  return flash.status;
}

/** Remaining lifetime in milliseconds, or null when the flash never expires. */
export function flashTimeLeft(flash: FlashRecord, now = Date.now()): number | null {
  if (flash.expiresAt === null) return null;
  return Math.max(0, flash.expiresAt - now);
}

/** Newest visible flashes first. */
export function sortFlashes(flashes: FlashRecord[]): FlashRecord[] {
  return [...flashes].sort((a, b) => b.createdAt - a.createdAt);
}

/** What Vita understands from a freely written intention. */
export interface FlashIntent {
  kind: FlashKind;
  category: FlashCategory;
  timeSlot: FlashTimeSlot;
  /** Default lifetime derived from the time slot. */
  expiresAt: number;
}

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

const SLOT_TTL: Record<FlashTimeSlot, number> = {
  now: 6 * HOUR,
  today: DAY,
  tomorrow: 2 * DAY,
  this_week: 7 * DAY,
};

const NEED_PATTERN =
  /\b(besoin|cherche|recherche|recherch\w*|il me faut|je veux|je voudrais|j'aimerais|j’aimerais|need|needed|looking for|wanted|searching for)\b/i;

const CATEGORY_PATTERNS: ReadonlyArray<readonly [FlashCategory, RegExp]> = [
  ["food", /\b(food|meal|restaurant|cook|repas|nourriture|manger|cuisine|livraison)\b/i],
  [
    "transport",
    /\b(transport|taxi|ride|driver|car|moto|chauffeur|voiture|covoiturage|delivery)\b/i,
  ],
  ["health", /\b(health|doctor|medic|santé|médecin|docteur|pharmacie|soin|hôpital)\b/i],
  ["education", /\b(cours|formation|tutor|teacher|école|education|apprendre|professeur|étude)\b/i],
  ["events", /\b(event|événement|concert|soirée|meetup|rencontre|réunion|fête|party)\b/i],
  [
    "home",
    /\b(maison|home|plombier|plumber|électricien|réparation|repair|ménage|cleaning|travaux|déménagement|demenagement|déménager|garde d'enfants|garde d’enfants|baby-sitter|babysitter|nounou|enfants)\b/i,
  ],
  ["commercial", /\b(vends|vendre|sell|selling|acheter|buy|product|produit|shop|boutique|prix)\b/i],
  [
    "professional",
    /\b(job|emploi|mission|freelance|développeur|developer|designer|work|travail|recrute|hire|hiring|service)\b/i,
  ],
  ["personal", /\b(ami|friend|personnel|personal|famille|family|compagnon|partner)\b/i],
];

const SLOT_PATTERNS: ReadonlyArray<readonly [FlashTimeSlot, RegExp]> = [
  ["now", /\b(maintenant|now|urgent|immédiatement|immediately|asap|tout de suite)\b/i],
  ["tomorrow", /\b(demain|tomorrow)\b/i],
  ["this_week", /\b(cette semaine|ce week-end|week-end|weekend|this week|next week)\b/i],
  ["today", /\b(aujourd'hui|today|ce soir|tonight|cet après-midi|this afternoon)\b/i],
];

/**
 * Parses a freely written intention (FR or EN) into a structured Flash
 * intent. Pure and deterministic: same text, same result. The author always
 * keeps the final word — this only pre-fills what the text clearly states.
 */
export function parseFlashIntent(text: string, now = Date.now()): FlashIntent {
  const kind: FlashKind = NEED_PATTERN.test(text) ? "need" : "offer";

  let category: FlashCategory = "other";
  for (const [candidate, pattern] of CATEGORY_PATTERNS) {
    if (pattern.test(text)) {
      category = candidate;
      break;
    }
  }

  let timeSlot: FlashTimeSlot = "today";
  for (const [candidate, pattern] of SLOT_PATTERNS) {
    if (pattern.test(text)) {
      timeSlot = candidate;
      break;
    }
  }

  return { kind, category, timeSlot, expiresAt: now + SLOT_TTL[timeSlot] };
}
