import type { ScanConfidence, ScanInterpretation, ScanNeedIntent } from "@eco/core-contracts";

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
  {
    intent: "repair",
    pattern:
      /\b(repar\w*|depann\w*|panne\w*|crevaison|mecanicien|plombier|electricien|faire reparer|remettre en etat)\b/,
  },
  {
    intent: "transport",
    pattern:
      /\b(transport|taxi|chauffeur|voiture|moto|trajet|deplacement|se deplacer|aeroport|aller a|emmener|conduire)\b/,
  },
  {
    intent: "work",
    pattern:
      /\b(travail|emploi|job|recrut\w*|poste|mission|freelance|gagner de l argent|petit boulot)\b/,
  },
  {
    intent: "buy",
    pattern:
      /\b(acheter|achat|prix|combien coute|trouver.*(materiel|produit|ordinateur|telephone)|je veux un|je voudrais un)\b/,
  },
  {
    intent: "food",
    pattern: /\b(manger|repas|nourriture|restaurant|cuisin\w*|livraison|faim|a boire)\b/,
  },
  {
    intent: "learning",
    pattern: /\b(apprendre|cours|formation|professeur|tuteur|soutien scolaire|enseigner)\b/,
  },
  {
    intent: "health",
    pattern: /\b(sante|medecin|docteur|pharmacie|soin|hopital|me soigner)\b/,
  },
  {
    intent: "activity",
    pattern: /\b(sortir|activite|evenement|concert|soiree|fete|match|visiter|me divertir)\b/,
  },
  {
    intent: "place",
    pattern:
      /\b(endroit|lieu|espace|ou aller|ou puis je trouver|ou trouver|adresse|ou se trouve|localiser)\b/,
  },
  {
    intent: "social",
    pattern: /\b(rencontr|ami|compagnie|discut|partager|faire connaissance)\b/,
  },
  {
    intent: "help",
    pattern:
      /\b(aide|aider|assistance|coup de main|besoin de quelqu|j ai besoin|j ai besoin d|aidez moi|demenag\w*|deplacer mes meubles|deplacer des meubles|porter des meubles|aide pour demenager)\b/,
  },
  {
    intent: "service",
    pattern: /\b(service|prestataire|quelqu un pour|personne pour)\b/,
  },
];

const IMPERATIVE_PATTERN =
  /\b(urgent|imperativement|obligatoirement|absolument|doit|uniquement|exclusivement)\b/;
const PREFERENCE_PATTERNS: readonly RegExp[] = [
  /\b(de preference|prefer|si possible|idealement|pas trop loin|proche)\b/g,
];
const PREFERENCE_CONTEXT_PATTERN =
  /\b(?:de preference|si possible|idealement)\b.{0,45}\b(?:pres de|a cote de|autour de) [a-z0-9]+(?: [a-z0-9]+){0,3}\b/;
const AVAILABLE_NOW_PATTERN = /\b(?:ouvert|disponible) maintenant\b/g;
const TIME_PATTERN =
  /\b(dans (?:[0-9]+|un|une|deux|trois|quatre|cinq|six|sept|huit|neuf|dix) (?:minutes?|heures?|jours?)|dans [0-9]+ ?h|maintenant|tout de suite|aujourd hui|ce soir|cet apres midi|demain matin|demain|cette semaine|ce week end|avant [0-9]+ ?h|avant [0-9]+ heures?)\b/;
const IMMEDIATE_PATTERN = /\b(urgent|maintenant|tout de suite|immediatement|asap)\b/;
const SOON_PATTERN =
  /\b(dans (?:[0-9]+|un|une|deux|trois|quatre|cinq|six|sept|huit|neuf|dix) (?:minutes?|heures?|jours?)|dans [0-9]+ ?h|aujourd hui|ce soir|cet apres midi|demain)\b/;

const TASK_PATTERN =
  /\b(demenager|deplacement|deplacer|reparer|depanner|transporter|emmener|conduire|acheter|trouver|livrer|installer|nettoyer|cuisiner|apprendre|chercher|porter)\b/g;
const OBJECT_PATTERN =
  /\b(moto|voiture|scooter|velo|telephone|ordinateur|meubles?|cartons?|maison|appartement|chambre|repas|medicaments?|document|colis|bagages?|eau|nourriture)\b/g;
const DISTANCE_PATTERN =
  /\b(?:dans un rayon de|a moins de|moins de|dans|a) [0-9]+(?:[.,][0-9]+)? ?(?:km|kilometres?|m|metres?)\b/;
const QUANTITY_PATTERN =
  /\b[0-9]+ (?:personnes?|meubles?|cartons?|chambres?|pieces?|kilos?|kg|litres?|articles?|colis|bagages?)\b/;
const LOCATION_PATTERN =
  /\b(?:pres de|a cote de|autour de|dans le quartier de|dans la zone de|a l adresse de|a) ([a-z0-9]+(?: (?!dans|de|du|la|le|les|un|une|au|aux|avec|pour)[a-z0-9]+){0,3})\b/;

function extractMatches(text: string, patterns: readonly RegExp[]): string[] {
  const matches = new Set<string>();
  for (const pattern of patterns) {
    const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
    const matcher = new RegExp(pattern.source, flags);
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
  const requiredCriteria = extractMatches(normalizedText, [AVAILABLE_NOW_PATTERN]);
  const preferences = [
    ...extractMatches(normalizedText, PREFERENCE_PATTERNS),
    ...extractMatches(normalizedText, [PREFERENCE_CONTEXT_PATTERN]),
  ];
  const hasImperative = IMPERATIVE_PATTERN.test(normalizedText);
  if (hasImperative) {
    const imperativeIndex = normalizedText.search(IMPERATIVE_PATTERN);
    const imperativeContext = normalizedText.slice(imperativeIndex);
    const explicitDistance = imperativeContext.match(DISTANCE_PATTERN)?.[0];
    const explicitQuantity = imperativeContext.match(QUANTITY_PATTERN)?.[0];
    const explicitTime = imperativeContext.match(TIME_PATTERN)?.[0];
    if (explicitDistance) requiredCriteria.push(explicitDistance);
    if (explicitQuantity) requiredCriteria.push(explicitQuantity);
    if (explicitTime) requiredCriteria.push(explicitTime);
  }
  const taskContext = extractMatches(normalizedText, [TASK_PATTERN]);
  const objectContext = extractMatches(normalizedText, [OBJECT_PATTERN]);
  const locationContext = normalizedText.match(LOCATION_PATTERN)?.[1] ?? null;
  const distanceContext = normalizedText.match(DISTANCE_PATTERN)?.[0] ?? null;
  const quantityContext = normalizedText.match(QUANTITY_PATTERN)?.[0] ?? null;
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
    entities: [...new Set([...taskContext, ...objectContext])],
    taskContext,
    objectContext,
    locationContext,
    distanceContext,
    quantityContext,
    requiredCriteria,
    preferences,
    timeContext,
    urgency,
    confidence,
  };
}
