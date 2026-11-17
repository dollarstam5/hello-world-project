import { createCommunicationDeliverySession } from "@/lib/communication/delivery-session";
import {
  prepareCommunicationMessages,
  type CommunicationDispatchResult,
  type CommunicationRequest,
  type CommunicationTranslate,
  type ResolvedCommunicationMessage,
} from "@/lib/communication/dispatch";

/**
 * One runtime instance belongs to one application session.
 *
 * Domain adapters submit only already-confirmed communication requests.
 * The runtime applies the shared priority/deduplication rules and resolves
 * localized copy; the presenter acknowledges only messages actually shown.
 * It has no network, persistence, timer, or business-state responsibilities.
 */
export function createCommunicationRuntime() {
  const deliverySession = createCommunicationDeliverySession();

  function prepare(
    translate: CommunicationTranslate,
    requests: readonly CommunicationRequest[],
    maxItems = Number.POSITIVE_INFINITY,
  ): CommunicationDispatchResult {
    return prepareCommunicationMessages(
      translate,
      requests,
      deliverySession.getGateState(),
      maxItems,
    );
  }

  function markPresented(messages: readonly ResolvedCommunicationMessage[]) {
    deliverySession.markDelivered(messages);
  }

  return { prepare, markPresented };
}

export type CommunicationRuntime = ReturnType<typeof createCommunicationRuntime>;
