import { describe, expect, it } from "vitest";
import { buildAssistantSystemPrompt } from "@/lib/ai/assistant-personality";

describe("personnalité contextuelle de Vita", () => {
  it("définit une voix chaleureuse, directe et honnête en français", () => {
    const prompt = buildAssistantSystemPrompt("fr");
    expect(prompt).toContain("compagnon chaleureux et attentionné");
    expect(prompt).toContain("Réponds d'abord à la question immédiate");
    expect(prompt).toContain("N'invente jamais une fonctionnalité Vitalis");
    expect(prompt).toContain("Pose au maximum une question de clarification");
    expect(prompt).not.toContain("Écran actuel");
  });

  it("adapte la langue et conserve la même posture en anglais", () => {
    const prompt = buildAssistantSystemPrompt("en", "/flash");
    expect(prompt).toContain("warm and attentive companion");
    expect(prompt).toContain("Answer the person's immediate question first");
    expect(prompt).toContain("Never invent a Vitalis feature");
    expect(prompt).toContain("Current screen (path only");
    expect(prompt).toContain("/flash");
  });

  it("n'ajoute que le chemin d'écran explicitement transmis", () => {
    const prompt = buildAssistantSystemPrompt("fr", "/radar");
    expect(prompt).toContain("Écran actuel (chemin uniquement");
    expect(prompt).toContain("/radar");
    expect(prompt).not.toContain("état de l'écran est connu : /radar");
  });

  it("ne prétend pas disposer d'une action ou d'une donnée non vérifiée", () => {
    const prompt = buildAssistantSystemPrompt("fr");
    expect(prompt).toContain("Ne prétends pas avoir modifié des données ou effectué une action");
    expect(prompt).toContain("ce que tu ne peux pas vérifier");
    expect(prompt).toContain("Ne déduis pas l'humeur");
  });
});
