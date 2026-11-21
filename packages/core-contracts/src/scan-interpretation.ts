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
  /** Explicit task/action phrases detected in the request. */
  taskContext: string[];
  /** Concrete objects or subjects mentioned by the user. */
  objectContext: string[];
  /** Place explicitly named or described by the user, when detectable. */
  locationContext: string | null;
  /** Explicit distance or radius constraint; never inferred from GPS. */
  distanceContext: string | null;
  /** Explicit quantity or count requested by the user. */
  quantityContext: string | null;
  requiredCriteria: string[];
  preferences: string[];
  timeContext: string | null;
  urgency: "immediate" | "soon" | "flexible" | null;
  confidence: ScanConfidence;
}
