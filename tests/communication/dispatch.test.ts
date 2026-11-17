import { describe, expect, it } from "vitest";
import { prepareCommunicationMessages } from "@/lib/communication/dispatch";
import type { MessageKey } from "@/lib/i18n/messages";

describe("prepareCommunicationMessages", () => {
  const translate = (key: MessageKey) => (key === "home.welcome.named" ? "Bonjour, {name} !" : key);

  it("prioritizes, deduplicates and formats messages through the existing catalog", () => {
    const result = prepareCommunicationMessages(translate, [
      { key: "home.welcome.named", priority: "low", variables: { name: "Ada" } },
      { key: "common.error", priority: "critical", eventId: "error-1" },
      { key: "common.retry", priority: "high", eventId: "error-1" },
    ]);

    expect(result.messages.map(({ key }) => key)).toEqual(["common.error", "home.welcome.named"]);
    expect(result.messages[1].text).toBe("Bonjour, Ada !");
    expect(result.suppressed).toHaveLength(1);
  });

  it("uses neutral text when optional variables are absent", () => {
    const result = prepareCommunicationMessages(translate, [
      { key: "home.welcome.named", priority: "normal" },
    ]);

    expect(result.messages[0].text).toBe("Bonjour,  !");
  });

  it("does not call a network service or persist dispatch state", () => {
    const result = prepareCommunicationMessages(translate, [
      { key: "common.retry", priority: "normal", repeatKey: "retry-button" },
    ]);

    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].repeatKey).toBe("retry-button");
  });
});
