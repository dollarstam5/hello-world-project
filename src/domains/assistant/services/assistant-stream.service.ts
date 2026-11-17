import type { AssistantFailure } from "@eco/core-contracts";

export type StreamMessage = { role: "user" | "assistant"; content: string };

export interface StreamRequest {
  requestId: string;
  locale: "fr" | "en";
  route?: string;
  messages: StreamMessage[];
}

export function buildAssistantRequestMessages(messages: readonly StreamMessage[]): StreamMessage[] {
  const alternating: StreamMessage[] = [];
  for (const message of messages) {
    const previous = alternating.at(-1);
    if (previous?.role === message.role) {
      alternating[alternating.length - 1] = message;
    } else {
      alternating.push(message);
    }
  }

  const bounded = alternating.slice(-8);
  let totalChars = bounded.reduce((total, message) => total + message.content.length, 0);
  while (bounded.length > 1 && totalChars > 4_000) {
    totalChars -= bounded.shift()!.content.length;
  }
  return bounded;
}

export class AssistantStreamError extends Error {
  constructor(readonly reason: AssistantFailure) {
    super(reason);
  }
}

function reasonFor(status: number): AssistantFailure {
  if (status === 401) return "auth_required";
  if (status === 429) return "rate_limited";
  if (status === 402 || status === 403) return "daily_limit";
  if (status === 400) return "invalid_request";
  if (status === 422) return "unsafe_request";
  return "provider_error";
}

/** Streams Vita's answer, calling onDelta for each text chunk. Returns the full text. */
export async function streamAssistant(
  request: StreamRequest,
  onDelta: (text: string) => void,
  accessToken: string,
  signal?: AbortSignal,
): Promise<string> {
  const response = await fetch("/api/public/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(request),
    signal,
  });
  if (!response.ok || !response.body) throw new AssistantStreamError(reasonFor(response.status));

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      let event: { type?: string; delta?: string };
      try {
        event = JSON.parse(payload);
      } catch {
        continue;
      }
      if (event.type === "response.output_text.delta" && event.delta) {
        full += event.delta;
        onDelta(full);
      } else if (event.type === "response.failed" || event.type === "error") {
        throw new AssistantStreamError("provider_error");
      }
    }
  }
  buffer += decoder.decode();
  if (buffer.startsWith("data:")) {
    const payload = buffer.slice(5).trim();
    if (payload && payload !== "[DONE]") {
      try {
        const event = JSON.parse(payload) as { type?: string; delta?: string };
        if (event.type === "response.output_text.delta" && event.delta) {
          full += event.delta;
          onDelta(full);
        } else if (event.type === "response.failed" || event.type === "error") {
          throw new AssistantStreamError("provider_error");
        }
      } catch (error) {
        if (error instanceof AssistantStreamError) throw error;
      }
    }
  }
  if (!full.trim()) throw new AssistantStreamError("provider_error");
  return full;
}
