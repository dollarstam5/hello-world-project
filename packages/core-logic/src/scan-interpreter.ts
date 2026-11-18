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
  category: ScanInterpretation["category"];
  need: string;
  pattern: RegExp;
};

const INTENT_RULES: readonly IntentRule[] = [

  { intent: "repair", category: "home", need: "reparation", pattern: /\b(repar|depann|panne|crevaison|mecanicien|plombier|electricien)\b/ },
  { intent: "work", category: "professional", need: "opportunite professionnelle", pattern: /\b(travail|emploi|job|recrut|poste|mission|freelance)\b/ },
  { intent: "transport", category: "transport", need: "transport", pattern: /\b(transport|taxi|chauffeur|voiture|moto|trajet|deplac|aeroport)\b/ },
  { intent: "buy", category: "commercial", need: "achat de produit", pattern: /\b(acheter|achat|cherche.*acheter|vendre|prix|trouver.*(materiel|produit))\b/ },
  { intent: "food", category: "food", need: "nourriture ou restauration", pattern: /\b(manger|repas|nourriture|restaurant|cuisin|livraison|faim)\b/ },
  { intent: "learning", category: "education", need: "apprentissage ou formation", pattern: /\b(apprendre|cours|formation|professeur|tuteur|soutien scolaire)\b/ },
  { intent: "health", category: "health", need: "sante ou soins", pattern: /\b(sante|medecin|docteur|pharmacie|soin|hopital)\b/ },
  { intent: "activity", category: "events", need: "activite ou evenement", pattern: /\b(sortir|activite|evenement|concert|soiree|fete|match|visiter)\b/ },
  { intent: "place", category: null, need: "lieu", pattern: /\b(endroit|lieu|espace|ou aller|adresse)\b/ },
  { intent: "social", category: "personal", need: "rencontre ou compagnie", pattern: /\b(rencontr|ami|compagnie|discut|partager)\b/ },
  { intent: "help", category: "personal", need: "aide", pattern: /\b(aide|aider|assistance|coup de main|besoin de quelqu un)\b/ },
  { intent: "service", category: null, need: "service", pattern: /\b(service|prestataire)\b/ },
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
 * Interprets a request with lightweight keyword rules. It never calls services,
 * uses location, invents availability, or expands search criteria.
 */
export function interpretScanRequest(text: string): ScanInterpretation {
  const normalizedText = normalize(text);
  const rule = INTENT_RULES.find((candidate) => candidate.pattern.test(normalizedText));
  const primaryNeed = rule?.need ?? null;
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
    category: rule?.category ?? null,
    entities: [],
    requiredCriteria,
    preferences,
    timeContext,
    urgency,
    confidence,
  };
}
