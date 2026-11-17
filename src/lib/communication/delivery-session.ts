import type { ResolvedCommunicationMessage } from "@/lib/communication/dispatch";
import type { CommunicationGateState } from "@/lib/communication/gate";

/**
 * Session-scoped delivery ledger.
 *
 * The caller prepares messages, renders them, then acknowledges only the
 * messages that were actually presented. Nothing is persisted and no domain
 * event is created here. Create a fresh ledger when the app session ends.
 */
export function createCommunicationDeliverySession() {
  const deliveredEventIds = new Set<string>();
  const deliveredRepeatKeys = new Set<string>();

  const getGateState = (): CommunicationGateState => ({
    deliveredEventIds,
    deliveredRepeatKeys,
  });

  function markDelivered(messages: readonly ResolvedCommunicationMessage[]) {
    for (const message of messages) {
      if (message.eventId) deliveredEventIds.add(message.eventId);
      if (message.repeatKey) deliveredRepeatKeys.add(message.repeatKey);
    }
  }

  function reset() {
    deliveredEventIds.clear();
    deliveredRepeatKeys.clear();
  }

  return { getGateState, markDelivered, reset };
}
