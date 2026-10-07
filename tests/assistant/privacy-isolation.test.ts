import { describe, expect, it } from "vitest";
import { assistantConversationStorageKey } from "@/domains/assistant/model/useHybridAssistant";
import {
  closeLocalDatabase,
  configureLocalDatabase,
  listPromotedAssistantAnswers,
  savePromotedAssistantAnswer,
} from "@eco/core-db";


describe("isolation des conversations locales de Vita", () => {
  afterEach(() => {
    closeLocalDatabase();
  });
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

describe("isolation du cache promu local", () => {
  afterEach(() => {
    closeLocalDatabase();
  });

  it("ne partage pas une réponse promue entre deux bases de comptes", async () => {
    configureLocalDatabase({ ownerId: "user-a", databaseName: "vitala:user-a" });
    await savePromotedAssistantAnswer({
      id: "answer-a",
      normalizedQuestion: "question privee",
      answer: "Réponse privée du compte A.",
      locale: "fr",
      category: "feature",
      version: 1,
      updatedAt: Date.now(),
    });

    expect((await listPromotedAssistantAnswers("fr"))[0]?.id).toBe("answer-a");

    configureLocalDatabase({ ownerId: "user-b", databaseName: "vitala:user-b" });

    expect(await listPromotedAssistantAnswers("fr")).toEqual([]);
  });
});
