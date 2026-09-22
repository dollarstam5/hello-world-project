import { describe, expect, it } from "vitest";
import {
  containsSensitiveSecret,
  isSharedCacheEligible,
  safeAssistantRoute,
  validateConversation,
} from "@/lib/ai/assistant-policy";

describe("politique de sécurité Vita", () => {
  it("bloque les secrets et leur partage dans le cache commun", () => {
    expect(containsSensitiveSecret("Mon code PIN est 1234")).toBe(true);
    expect(isSharedCacheEligible("Mon mot de passe ne fonctionne plus")).toBe(false);
  });

  it("retire paramètres et fragments des routes autorisées", () => {
    expect(safeAssistantRoute("/radar/?zone=3#results")).toBe("/radar");
    expect(safeAssistantRoute("/admin/users")).toBeUndefined();
  });

  it("refuse deux messages consécutifs du même rôle", () => {
    expect(validateConversation({
      requestId: "00000000-0000-4000-8000-000000000001",
      locale: "fr",
      messages: [
        { role: "user", content: "Bonjour" },
        { role: "user", content: "Où est Radar ?" },
      ],
    })).toBe("invalid_role_order");
  });
});
