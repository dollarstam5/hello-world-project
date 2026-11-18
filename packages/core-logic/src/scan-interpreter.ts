import type {
  ScanConfidence,
  ScanInterpretation,
  ScanNeedIntent,
} from "@eco/core-contracts";

const normalize = (text: string): string =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, " ")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

type IntentRule = {
  intent: ScanNeedIntent;
  pattern: RegExp;
};

/**
 * Rules identify the user's goal, not the type of listing or source.
 * Order matters: specific intentions precede broad help/service patterns.
 */
const INTENT_RULES: readonly IntentRule[] = [
  { intent: "repair", pattern: /\b(repar\w*|depann\w*|panne\w*|crevaison|mecanicien|plombier|electricien|faire reparer|remettre en etat)\b/ },
  { intent: "transport", pattern: /\b(transport|taxi|chauffeur|voiture|moto|trajet|deplac\w*|aeroport|aller a|emmener|conduire)\b/ },
  { intent: "work", pattern: /\b(travail|emploi|job|recrut\w*|poste|mission|freelance|gagner de l argent|petit boulot)\b/ },
  { intent: "buy", pattern: /\b(acheter|achat|prix|combien coute|trouver.*(materiel|produit|ordinateur|telephone)|je veux un|je voudrais un)\b/ },
  { intent: "food", pattern: /\b(manger|repas|nourriture|restaurant|cuisin\w*|livraison|faim|a boire)\b/ },
  { intent: "learning", pattern: /\b(apprendre|cours|formation|professeur|tuteur|soutien scolaire|enseigner)\b/ },
  { intent: "health", pattern: /\b(sante|medecin|docteur|pharmacie|soin|hopital|me soigner)\b/ },
  { intent: "activity", pattern: /\b(sortir|activite|evenement|concert|soiree|fete|match|visiter|me divertir)\b/ },
  { intent: "place", pattern: /\b(endroit|lieu|espace|ou aller|adresse|ou se trouve|localiser)\b/ },
  { intent: "social", pattern: /\b(rencontr|ami|compagnie|discut|partager|faire connaissance)\b/ },
  { intent: "help", pattern: /\b(aide|aider|assistance|coup de main|besoin de quelqu|j ai besoin|j ai besoin d|aidez moi)\b/ },
  { intent: "service", pattern: /\b(service|prestataire|quelqu un pour|personne pour)\b/ },
];

const REQUIRED_PATTERNS: readonly RegExp[] = [
  /\b(urgent|imperativement|obligatoirement|absolument|doit|uniquement|exclusivement)\b/g,
  /\b(ouvert maintenant|disponible maintenant|ce soir|demain|cet apres midi|aujourd hui)\b/g,
];
const PREFERENCE_PATTERNS: readonly RegExp[] = [
  /\b(de preference|prefer|si possible|idealement|pas trop loin|proche)\b/g,
];
const TIME_PATTERN = /\b(maintenant|tout de suite|aujourd hui|ce soir|cet apres midi|demain matin|demain|cette semaine|ce week end)\b/;
const IMMEDIATE_PATTERN = /\b(urgent|maintenant|tout de suite|immediatement|asap)\b/;
const SOON_PATTERN = /\b(aujourd hui|ce soir|cet apres midi|demain)\b/;

function extractMatches(text: string, patterns: readonly RegExp[]): string[] {
  const matches = new Set<string>();
  for (const pattern of patterns) {
    const matcher = new RegExp(pattern.source, pattern.flags);
    for (const match of text.matchAll(matcher)) {
      const value = match[0].trim();
      if (value) matches.add(value);
    }
  }
  return [...matches];
}

/** Normalize French/English free-form input without changing its meaning. */
export function normalizeScanText(text: string): string {
  return normalize(text);
}

/**
 * Interprets a human request deterministically.
 * Intent is inferred from what the person wants to accomplish, never from a
 * listing taxonomy. The original/normalized wording remains the primary need
 * because this lightweight interpreter does not pretend to paraphrase perfectly.
 * It does not call services, use location, invent availability, or broaden
 * search criteria.
 */
export function interpretScanRequest(text: string): ScanInterpretation {
  const normalizedText = normalize(text);
  const rule = INTENT_RULES.find((candidate) => candidate.pattern.test(normalizedText));
  const primaryNeed = normalizedText || null;
  const timeContext = normalizedText.match(TIME_PATTERN)?.[0] ?? null;
  const urgency: ScanInterpretation["urgency"] = IMMEDIATE_PATTERN.test(normalizedText)
    ? "immediate"
    : SOON_PATTERN.test(normalizedText)
      ? "soon"
      : null;
  const requiredCriteria = extractMatches(normalizedText, REQUIRED_PATTERNS);
  const preferences = extractMatches(normalizedText, PREFERENCE_PATTERNS);
  const confidence: ScanConfidence = !normalizedText
    ? "low"
    : rule && normalizedText.length >= 8
      ? "high"
      : rule
        ? "medium"
        : "low";

  return {
    originalText: text,
    normalizedText,
    primaryNeed,
    intent: rule?.intent ?? "unknown",
    category: null,
    entities: [],
    requiredCriteria,
    preferences,
    timeContext,
    urgency,
    confidence,
  };
}
