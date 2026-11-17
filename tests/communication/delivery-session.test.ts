import { describe, expect, it } from "vitest";
import { createCommunicationDeliverySession } from "@/lib/communication/delivery-session";
import { prepareCommunicationMessages } from "@/lib/communication/dispatch";
import type { MessageKey } from "@/lib/i18n/messages";

describe("communication delivery session", () => {
  const translate = (key: MessageKey) => key;

  it("does not mark a message delivered until the presenter acknowledges it", () => {
    const session = createCommunicationDeliverySession();
    const request = [{ key: "common.error", source: "app" as const, surface: "inline" as const, priority: "high" as const, eventId: "domain-event-1" }];

    const first = prepareCommunicationMessages(translate, request, session.getGateState());
    expect(first.messages).toHaveLength(1);

    const secondBeforePresentation = prepareCommunicationMessages(
      translate,
      request,
      session.getGateState(),
    );
    expect(secondBeforePresentation.messages).toHaveLength(1);

    session.markDelivered(first.messages);
    const afterPresentation = prepareCommunicationMessages(
      translate,
      request,
      session.getGateState(),
    );
    expect(afterPresentation.messages).toHaveLength(0);
    expect(afterPresentation.suppressed).toHaveLength(1);
  });

  it("clears delivered identifiers when the session ends", () => {
    const session = createCommunicationDeliverySession();
    const message = prepareCommunicationMessages(
      translate,
      [{ key: "common.retry", source: "app" as const, surface: "inline" as const, priority: "normal", repeatKey: "retry-action" }],
    );
    session.markDelivered(message.messages);

    session.reset();

    expect(
      prepareCommunicationMessages(
        translate,
        [{ key: "common.retry", priority: "normal", repeatKey: "retry-action" }],
        session.getGateState(),
      ).messages,
    ).toHaveLength(1);
  });

  it("deduplicates repeat keys only within this in-memory session", () => {
    const session = createCommunicationDeliverySession();
    const message = prepareCommunicationMessages(
      translate,
      [{ key: "common.retry", priority: "normal", repeatKey: "retry-action" }],
      session.getGateState(),
    );
    session.markDelivered(message.messages);

    expect(
      prepareCommunicationMessages(
        translate,
        [{ key: "common.retry", priority: "normal", repeatKey: "retry-action" }],
        session.getGateState(),
      ).messages,
    ).toHaveLength(0);

    expect(
      prepareCommunicationMessages(
        translate,
        [{ key: "common.retry", priority: "normal", repeatKey: "retry-action" }],
        createCommunicationDeliverySession().getGateState(),
      ).messages,
    ).toHaveLength(1);
  });
});
