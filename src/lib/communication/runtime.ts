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
export interface CommunicationInboxEvent {
  /** Stable domain event key; never a temporary guest/session identifier. */
  id: string;
  source: "flash" | "radar";
  titleKey: MessageKey;
  messageKey: MessageKey;
  href: "/flash" | "/radar";
  createdAt: number;
  readAt: number | null;
}

export interface PublishCommunicationEvent {
  id: string;
  source: CommunicationInboxEvent["source"];
  titleKey: MessageKey;
  messageKey: MessageKey;
  href: CommunicationInboxEvent["href"];
  createdAt?: number;
}

export function createCommunicationRuntime() {
  const deliverySession = createCommunicationDeliverySession();
  const listeners = new Set<() => void>();
  const inboxEvents = new Map<string, CommunicationInboxEvent>();
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

  function getEvents(): CommunicationInboxEvent[] {
    return [...inboxEvents.values()].sort((a, b) => b.createdAt - a.createdAt);
  }

  function getUnreadEventCount(): number {
    let count = 0;
    inboxEvents.forEach((event) => {
      if (event.readAt === null) count += 1;
    });
    return count;
  }

  function publishEvent(input: PublishCommunicationEvent): boolean {
    // The first inbox tranche is account-only. Guest events must stay in their
    // owning engine and must never enter the shared application inbox.
    if (context?.identity !== "member" || inboxEvents.has(input.id)) return false;
    inboxEvents.set(input.id, {
      ...input,
      createdAt: input.createdAt ?? Date.now(),
      readAt: null,
    });
    notifyContextChange();
    return true;
  }

  function markEventRead(eventId: string): boolean {
    const event = inboxEvents.get(eventId);
    if (!event || event.readAt !== null) return false;
    inboxEvents.set(eventId, { ...event, readAt: Date.now() });
    notifyContextChange();
    return true;
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
    inboxEvents.clear();
    context = null;
    notifyContextChange();
  }

  return {
    updateContext,
    getContext,
    getEvents,
    getUnreadEventCount,
    publishEvent,
    markEventRead,
    prepare,
    markPresented,
    resetSession,
    subscribe,
    getSnapshot,
  };
}

export type CommunicationRuntime = ReturnType<typeof createCommunicationRuntime>;
