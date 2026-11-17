import { formatCommunicationMessage } from "@/lib/communication/format";
import {
  resolveCommunicationCandidates,
  type CommunicationCandidate,
  type CommunicationGateState,
} from "@/lib/communication/gate";
import type { MessageKey } from "@/lib/i18n/messages";

export type CommunicationTranslate = (key: MessageKey) => string;
export type CommunicationVariables = Readonly<Record<string, string | number | null | undefined>>;
export type CommunicationSource =
  "app" | "auth" | "home" | "onboarding" | "flash" | "scan" | "reel" | "radar" | "assistant";
export type CommunicationSurface = "inline" | "notice" | "center";

export interface CommunicationRequest extends CommunicationCandidate {
  /** Domain that owns the fact being communicated. */
  source: CommunicationSource;
  /** Intended presentation surface; this does not create or persist the event. */
  surface: CommunicationSurface;
  variables?: CommunicationVariables;
  /** True only when the request must not be prepared without a ready context. */
  requiresContext?: boolean;
  /** Assistant-only requests must wait until the person has opted in. */
  requiresAssistant?: boolean;
}

export interface ResolvedCommunicationMessage {
  key: MessageKey;
  source: CommunicationSource;
  surface: CommunicationSurface;
  priority: CommunicationRequest["priority"];
  text: string;
  eventId?: string;
  repeatKey?: string;
}

export interface CommunicationDispatchResult {
  messages: ResolvedCommunicationMessage[];
  suppressed: CommunicationRequest[];
}

/**
 * Local-only pipeline: deduplicate and prioritize confirmed communication
 * requests, then resolve their existing i18n catalog entries for presentation.
 */
export function prepareCommunicationMessages(
  translate: CommunicationTranslate,
  requests: readonly CommunicationRequest[],
  state: CommunicationGateState = {},
  maxItems = Number.POSITIVE_INFINITY,
): CommunicationDispatchResult {
  const gate = resolveCommunicationCandidates(requests, state, maxItems);
  const messages = gate.selected.map((request) => ({
    key: request.key,
    source: request.source,
    surface: request.surface,
    priority: request.priority,
    text: formatCommunicationMessage(translate, request.key, request.variables),
    ...(request.eventId ? { eventId: request.eventId } : {}),
    ...(request.repeatKey ? { repeatKey: request.repeatKey } : {}),
  }));

  return { messages, suppressed: gate.suppressed };
}
