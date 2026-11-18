import type { FlashCategory } from "./flash";

/** Structured, deterministic understanding of a free-form Scan request. */
export type ScanNeedIntent =
  | "help"
  | "work"
  | "buy"
  | "repair"
  | "transport"
  | "activity"
  | "place"
  | "food"
  | "learning"
  | "health"
  | "social"
  | "service"
  | "unknown";

export type ScanConfidence = "high" | "medium" | "low";

/** Internal interpretation; this does not execute a search or relax its criteria. */
export interface ScanInterpretation {
  originalText: string;
  normalizedText: string;
  primaryNeed: string | null;
  intent: ScanNeedIntent;
  category: FlashCategory | null;
  entities: string[];
  requiredCriteria: string[];
  preferences: string[];
  timeContext: string | null;
  urgency: "immediate" | "soon" | "flexible" | null;
  confidence: ScanConfidence;
}
