import {
  resolveCommunicationContext,
  type CommunicationContext,
  type CommunicationContextInput,
} from "@/lib/communication/context";
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
 * The runtime resolves an explicit, privacy-safe context snapshot, applies
 * shared priority/deduplication rules and resolves localized copy. It has no
 * network, persistence, timer, or business-state responsibilities.
 */
export function createCommunicationRuntime() {
  const deliverySession = createCommunicationDeliverySession();
  let context: CommunicationContext | null = null;

  function updateContext(input: CommunicationContextInput): CommunicationContext {
    context = resolveCommunicationContext(input);
    return context;
  }

  function getContext(): CommunicationContext | null {
    return context;
  }

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

  function resetSession() {
    deliverySession.reset();
    context = null;
  }

  return { updateContext, getContext, prepare, markPresented, resetSession };
}

export type CommunicationRuntime = ReturnType<typeof createCommunicationRuntime>;
