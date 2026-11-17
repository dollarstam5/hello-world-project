import { describe, expect, it } from "vitest";
import { createCommunicationRuntime } from "@/lib/communication/runtime";
import type { MessageKey } from "@/lib/i18n/messages";

describe("communication runtime", () => {
  const translate = (key: MessageKey) => key;

  it("stores only an explicitly supplied resolved context snapshot", () => {
    const runtime = createCommunicationRuntime();
    expect(runtime.getContext()).toBeNull();

    const context = runtime.updateContext({
      identity: "guest",
      pathname: "/reel?session=temporary",
      locale: "fr",
      assistantEnabled: false,
      permissions: { discover: "granted", presence: "unknown" },
    });

    expect(context).toEqual({
      identity: "guest",
      route: "/reel",
      locale: "fr",
      assistantEnabled: false,
      permissions: { discover: "granted", presence: "unknown" },
      ready: true,
    });
    expect(runtime.getContext()).toBe(context);
    expect(context).not.toHaveProperty("session");
  });

  it("clears the context snapshot when the application session resets", () => {
    const runtime = createCommunicationRuntime();
    runtime.updateContext({
      identity: "member",
      pathname: "/",
      locale: "en",
      assistantEnabled: true,
    });

    runtime.resetSession();

    expect(runtime.getContext()).toBeNull();
  });

  it("does not mark a request delivered until the presenter acknowledges it", () => {
    const runtime = createCommunicationRuntime();
    const request = [
      {
        key: "common.error",
        source: "assistant" as const,
        surface: "notice" as const,
        priority: "high" as const,
        repeatKey: "flash-save-error",
      },
    ];

    const firstPresentation = runtime.prepare(translate, request);
    expect(firstPresentation.messages).toHaveLength(1);
    runtime.markPresented(firstPresentation.messages);
    expect(runtime.prepare(translate, request).messages).toHaveLength(0);
  });

  it("can reset delivery state when the application identity session changes", () => {
    const runtime = createCommunicationRuntime();
    const request = [
      {
        key: "common.retry",
        source: "assistant" as const,
        surface: "notice" as const,
        priority: "normal" as const,
        repeatKey: "identity-session",
      },
    ];

    const presented = runtime.prepare(translate, request).messages;
    runtime.markPresented(presented);
    expect(runtime.prepare(translate, request).messages).toHaveLength(0);

    runtime.resetSession();

    expect(runtime.prepare(translate, request).messages).toHaveLength(1);
  });

  it("keeps delivery state isolated to the runtime session", () => {
    const first = createCommunicationRuntime();
    const second = createCommunicationRuntime();
    const request = [
      {
        key: "common.retry",
        source: "assistant" as const,
        surface: "notice" as const,
        priority: "normal" as const,
        repeatKey: "retry-action",
      },
    ];

    const presented = first.prepare(translate, request).messages;
    first.markPresented(presented);

    expect(first.prepare(translate, request).messages).toHaveLength(0);
    expect(second.prepare(translate, request).messages).toHaveLength(1);
  });
});
