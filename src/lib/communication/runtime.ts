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
  const listeners = new Set<() => void>();
  let context: CommunicationContext | null = null;
  let revision = 0;

  function notifyContextChange() {
    revision += 1;
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function getSnapshot() {
    return revision;
  }

  function updateContext(input: CommunicationContextInput): CommunicationContext {
    context = resolveCommunicationContext(input);
    notifyContextChange();
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
    const eligible = requests.filter(
      (request) =>
        (!request.requiresContext || context?.ready === true) &&
        (!request.requiresAssistant || context?.assistantEnabled === true),
    );
    const contextSuppressed = requests.filter(
      (request) =>
        (request.requiresContext && context?.ready !== true) ||
        (request.requiresAssistant && context?.assistantEnabled !== true),
    );
    const prepared = prepareCommunicationMessages(
      translate,
      eligible,
      deliverySession.getGateState(),
      maxItems,
    );

    return {
      ...prepared,
      suppressed: [...contextSuppressed, ...prepared.suppressed],
    };
  }

  function markPresented(messages: readonly ResolvedCommunicationMessage[]) {
    deliverySession.markDelivered(messages);
  }

  function resetSession() {
    deliverySession.reset();
    context = null;
    notifyContextChange();
  }

  return {
    updateContext,
    getContext,
    prepare,
    markPresented,
    resetSession,
    subscribe,
    getSnapshot,
  };
}

export type CommunicationRuntime = ReturnType<typeof createCommunicationRuntime>;
