import { formatCommunicationMessage } from "@/lib/communication/format";
import {
  resolveCommunicationCandidates,
  type CommunicationCandidate,
  type CommunicationGateState,
} from "@/lib/communication/gate";
import type { MessageKey } from "@/lib/i18n/messages";

export type CommunicationTranslate = (key: MessageKey) => string;
export type CommunicationVariables = Readonly<
  Record<string, string | number | null | undefined>
>;

export interface CommunicationRequest extends CommunicationCandidate {
  variables?: CommunicationVariables;
}

export interface ResolvedCommunicationMessage {
  key: MessageKey;
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
    priority: request.priority,
    text: formatCommunicationMessage(translate, request.key, request.variables),
    ...(request.eventId ? { eventId: request.eventId } : {}),
    ...(request.repeatKey ? { repeatKey: request.repeatKey } : {}),
  }));

  return { messages, suppressed: gate.suppressed };
}
