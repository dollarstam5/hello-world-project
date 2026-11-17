import { describe, expect, it } from "vitest";
import { createCommunicationRuntime } from "@/lib/communication/runtime";
import type { MessageKey } from "@/lib/i18n/messages";

describe("communication runtime", () => {
  const translate = (key: MessageKey) => key;

  it("does not mark a request delivered until the presenter acknowledges it", () => {
    const runtime = createCommunicationRuntime();
    const request = [
      { key: "common.error", priority: "high" as const, repeatKey: "flash-save-error" },
    ];

    const firstPresentation = runtime.prepare(translate, request);
    expect(firstPresentation.messages).toHaveLength(1);
    runtime.markPresented(firstPresentation.messages);
    expect(runtime.prepare(translate, request).messages).toHaveLength(0);
  });

  it("keeps delivery state isolated to the runtime session", () => {
    const first = createCommunicationRuntime();
    const second = createCommunicationRuntime();
    const request = [
      { key: "common.retry", priority: "normal" as const, repeatKey: "retry-action" },
    ];

    const presented = first.prepare(translate, request).messages;
    first.markPresented(presented);

    expect(first.prepare(translate, request).messages).toHaveLength(0);
    expect(second.prepare(translate, request).messages).toHaveLength(1);
  });
});
