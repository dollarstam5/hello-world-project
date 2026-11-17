import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AssistantStreamError,
  buildAssistantRequestMessages,
  streamAssistant,
} from "@/domains/assistant/services/assistant-stream.service";

afterEach(() => vi.unstubAllGlobals());

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
      content: "x".repeat(600),
    }));
    const result = buildAssistantRequestMessages(messages);
    expect(result).toHaveLength(6);
    expect(
      result.reduce((total, message) => total + message.content.length, 0),
    ).toBeLessThanOrEqual(4_000);
  });
});

describe("streaming de Vita", () => {
  function mockStream(events: string[]) {
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(events.join("\n") + "\n"));
        controller.close();
      },
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(body, {
          status: 200,
          headers: { "Content-Type": "text/event-stream" },
        }),
      ),
    );
  }

  const request = (id: string) => ({
    requestId: id,
    locale: "fr" as const,
    messages: [{ role: "user" as const, content: "Salut" }],
  });

  it("accepte une réponse seulement après l'événement de fin", async () => {
    mockStream([
      'data: {"type":"response.output_text.delta","delta":"Bonjour"}',
      'data: {"type":"response.completed"}',
    ]);
    const onDelta = vi.fn();

    await expect(
      streamAssistant(request("00000000-0000-4000-8000-000000000001"), onDelta, "token"),
    ).resolves.toBe("Bonjour");
    expect(onDelta).toHaveBeenCalledWith("Bonjour");
  });

  it("refuse un flux interrompu après des fragments partiels", async () => {
    mockStream(['data: {"type":"response.output_text.delta","delta":"Réponse partielle"}']);

    await expect(
      streamAssistant(request("00000000-0000-4000-8000-000000000002"), vi.fn(), "token"),
    ).rejects.toBeInstanceOf(AssistantStreamError);
  });

  it("accepte le marqueur terminal SSE [DONE]", async () => {
    mockStream(['data: {"type":"response.output_text.delta","delta":"Bonjour"}', "data: [DONE]"]);

    await expect(
      streamAssistant(request("00000000-0000-4000-8000-000000000003"), vi.fn(), "token"),
    ).resolves.toBe("Bonjour");
  });
});
