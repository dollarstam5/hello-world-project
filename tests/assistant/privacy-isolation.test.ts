import { describe, expect, it } from "vitest";
import { assistantConversationStorageKey } from "@/domains/assistant/model/useHybridAssistant";

describe("isolation des conversations locales de Vita", () => {
  it("ne persiste jamais une conversation sous une clé anonyme partagée", () => {
    expect(assistantConversationStorageKey(null)).toBeNull();
  });

  it("utilise une clé distincte pour chaque compte", () => {
    const userA = assistantConversationStorageKey("user-a");
    const userB = assistantConversationStorageKey("user-b");

    expect(userA).not.toBeNull();
    expect(userB).not.toBeNull();
    expect(userA).not.toBe(userB);
    expect(userA).toBe("eco.assistant.conversation.v2:user-a");
    expect(userB).toBe("eco.assistant.conversation.v2:user-b");
  });
});
