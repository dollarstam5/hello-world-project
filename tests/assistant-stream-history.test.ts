import { describe, expect, it } from "vitest";
import { buildAssistantRequestMessages } from "@/domains/assistant/services/assistant-stream.service";

describe("historique transmis à Vita", () => {
  it("collapse les tours sans réponse pour conserver l'alternance attendue", () => {
    expect(
      buildAssistantRequestMessages([
        { role: "user", content: "Question hors ligne" },
        { role: "user", content: "Nouvelle question" },
        { role: "assistant", content: "Réponse" },
        { role: "user", content: "Dernière question" },
      ]),
    ).toEqual([
      { role: "user", content: "Nouvelle question" },
      { role: "assistant", content: "Réponse" },
      { role: "user", content: "Dernière question" },
    ]);
  });

  it("borne l'historique à huit messages et quatre mille caractères", () => {
    const messages = Array.from({ length: 12 }, (_, index) => ({
      role: index % 2 === 0 ? ("user" as const) : ("assistant" as const),
      content: String(index).repeat(600),
    }));
    const result = buildAssistantRequestMessages(messages);
    expect(result).toHaveLength(6);
    expect(result.reduce((total, message) => total + message.content.length, 0)).toBeLessThanOrEqual(
      4_000,
    );
  });
});
