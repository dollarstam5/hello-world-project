import { describe, expect, it } from "vitest";
import {
  containsSensitiveSecret,
  hasSensitiveUserContent,
  isSharedCacheAnswerEligible,
  isSharedCacheEligible,
  safeAssistantRoute,
  validateConversation,
} from "@/lib/ai/assistant-policy";

describe("politique de sécurité Vita", () => {
  it("bloque les secrets et leur partage dans le cache commun", () => {
    expect(containsSensitiveSecret("Mon code PIN est 1234")).toBe(true);
    expect(isSharedCacheEligible("Mon mot de passe ne fonctionne plus")).toBe(false);
  });

  it("bloque les secrets dans chaque message utilisateur, quelle que soit la voie serveur", () => {
    expect(
      hasSensitiveUserContent([
        { role: "user", content: "Bonjour" },
        { role: "assistant", content: "Comment puis-je aider ?" },
        { role: "user", content: "Mon code PIN est 1234" },
      ]),
    ).toBe(true);
    expect(
      hasSensitiveUserContent([
        { role: "user", content: "Où trouver Radar ?" },
        { role: "assistant", content: "Dans le menu." },
        { role: "user", content: "Merci" },
      ]),
    ).toBe(false);
  });

  it("refuse une réponse contenant des données personnelles ou secrets", () => {
    expect(isSharedCacheAnswerEligible("Votre email est moi@example.com")).toBe(false);
    expect(isSharedCacheAnswerEligible("Votre code PIN est 1234")).toBe(false);
    expect(isSharedCacheAnswerEligible("Ouvrez Radar puis activez la veille.")).toBe(true);
  });

  it("retire paramètres et fragments des routes autorisées", () => {
    expect(safeAssistantRoute("/radar/?zone=3#results")).toBe("/radar");
    expect(safeAssistantRoute("/admin/users")).toBeUndefined();
  });

  it("refuse deux messages consécutifs du même rôle", () => {
    expect(
      validateConversation({
        requestId: "00000000-0000-4000-8000-000000000001",
        locale: "fr",
        messages: [
          { role: "user", content: "Bonjour" },
          { role: "user", content: "Où est Radar ?" },
        ],
      }),
    ).toBe("invalid_role_order");
  });

  it("applique les plafonds de conversation communs", () => {
    const base = {
      requestId: "00000000-0000-4000-8000-000000000001",
      locale: "fr" as const,
    };
    expect(
      validateConversation({
        ...base,
        messages: [{ role: "user", content: "x".repeat(600) }],
      }),
    ).toBeNull();
    expect(
      validateConversation({
        ...base,
        messages: [{ role: "user", content: "x".repeat(601) }],
      }),
    ).toBe("invalid_message");
    expect(
      validateConversation({
        ...base,
        messages: Array.from({ length: 9 }, (_, index) => ({
          role: index % 2 === 0 ? ("user" as const) : ("assistant" as const),
          content: "message",
        })),
      }),
    ).toBe("invalid_message_count");
  });
});
