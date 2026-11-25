import { describe, expect, it } from "vitest";
import { createCommunicationRuntime } from "@/features/communication/model/runtime";
import type { MessageKey } from "@/platform/internationalization/messages";

describe("communication runtime", () => {
  const translate = (key: MessageKey) => key;

  it("notifies subscribers when context changes or the session resets", () => {
    const runtime = createCommunicationRuntime();
    let notifications = 0;
    const unsubscribe = runtime.subscribe(() => {
      notifications += 1;
    });

    runtime.updateContext({
      identity: "guest",
      pathname: "/",
      locale: "fr",
      assistantEnabled: false,
    });
    expect(runtime.getSnapshot()).toBe(1);
    expect(notifications).toBe(1);

    runtime.resetSession();
    expect(runtime.getSnapshot()).toBe(2);
    expect(notifications).toBe(2);

    unsubscribe();
    runtime.resetSession();
    expect(notifications).toBe(2);
  });

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
      assistantPreferenceReady: true,
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

  it("suppresses context-dependent requests until all required context is ready", () => {
    const runtime = createCommunicationRuntime();
    const request = [
      {
        key: "common.error",
        source: "app" as const,
        surface: "center" as const,
        priority: "normal" as const,
        requiresContext: true,
      },
    ];

    const unavailable = runtime.prepare(translate, request);
    expect(unavailable.messages).toHaveLength(0);
    expect(unavailable.suppressed).toEqual(request);

    runtime.updateContext({
      identity: "guest",
      pathname: "/",
      locale: "fr",
      assistantEnabled: false,
    });

    const available = runtime.prepare(translate, request);
    expect(available.messages).toHaveLength(1);
    expect(available.suppressed).toHaveLength(0);
  });

  it("suppresses assistant-only requests until explicit opt-in is confirmed", () => {
    const runtime = createCommunicationRuntime();
    const request = [
      {
        key: "common.error",
        source: "assistant" as const,
        surface: "notice" as const,
        priority: "normal" as const,
        requiresAssistant: true,
      },
    ];

    runtime.updateContext({
      identity: "member",
      pathname: "/",
      locale: "fr",
      assistantEnabled: false,
    });

    const optedOut = runtime.prepare(translate, request);
    expect(optedOut.messages).toHaveLength(0);
    expect(optedOut.suppressed).toEqual(request);

    runtime.updateContext({
      identity: "member",
      pathname: "/",
      locale: "fr",
      assistantEnabled: true,
    });

    const optedIn = runtime.prepare(translate, request);
    expect(optedIn.messages).toHaveLength(1);
    expect(optedIn.suppressed).toHaveLength(0);
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

  it("accepts confirmed account events, deduplicates them and tracks explicit reads", () => {
    const runtime = createCommunicationRuntime();
    runtime.updateContext({
      identity: "member",
      pathname: "/",
      locale: "fr",
      assistantEnabled: false,
    });
    const event = {
      id: "radar:record-1:saved",
      source: "radar" as const,
      titleKey: "communication.event.radar.title" as const,
      messageKey: "communication.event.radar.saved" as const,
      href: "/radar" as const,
      createdAt: 100,
      attentionRequired: true,
    };

    expect(runtime.publishEvent(event)).toBe(true);
    expect(runtime.publishEvent(event)).toBe(false);
    expect(runtime.getEvents()).toHaveLength(1);
    expect(runtime.getUnreadEventCount()).toBe(1);
    expect(runtime.markEventRead(event.id)).toBe(true);
    expect(runtime.markEventRead(event.id)).toBe(false);
    expect(runtime.getUnreadEventCount()).toBe(0);
    expect(runtime.getEvents()[0]?.readAt).not.toBeNull();
  });

  it("accepts server-backed Réel events only for members and tracks their attention", () => {
    const runtime = createCommunicationRuntime();
    runtime.updateContext({
      identity: "guest",
      pathname: "/reel",
      locale: "fr",
      assistantEnabled: false,
    });
    const event = {
      id: "reel:server-event-uuid",
      source: "reel" as const,
      titleKey: "communication.event.reel.title" as const,
      messageKey: "communication.event.reel.bipReceived" as const,
      href: "/reel" as const,
      createdAt: 300,
      attentionRequired: true,
    };

    expect(runtime.publishEvent(event)).toBe(false);
    expect(runtime.getUnreadEventCount()).toBe(0);

    runtime.updateContext({
      identity: "member",
      pathname: "/reel",
      locale: "fr",
      assistantEnabled: false,
    });
    expect(runtime.publishEvent(event)).toBe(true);
    expect(runtime.publishEvent(event)).toBe(false);
    expect(runtime.getUnreadEventCount()).toBe(1);
    expect(runtime.getEvents()[0]).toMatchObject({
      source: "reel",
      messageKey: "communication.event.reel.bipReceived",
      href: "/reel",
      readAt: null,
    });
  });

  it("keeps inline confirmations visible in the center without raising the unread bell", () => {
    const runtime = createCommunicationRuntime();
    runtime.updateContext({
      identity: "member",
      pathname: "/",
      locale: "fr",
      assistantEnabled: false,
    });

    runtime.publishEvent({
      id: "flash:record-2:draft-saved",
      source: "flash",
      titleKey: "communication.event.flash.title",
      messageKey: "communication.event.flash.draftSaved",
      href: "/flash",
      createdAt: 200,
      attentionRequired: false,
    });

    expect(runtime.getEvents()).toHaveLength(1);
    expect(runtime.getEvents()[0]?.readAt).toBe(200);
    expect(runtime.getUnreadEventCount()).toBe(0);
  });

  it("never adds guest events to the shared inbox and clears inbox events on session reset", () => {
    const runtime = createCommunicationRuntime();
    const event = {
      id: "flash:record-1:draft-saved",
      source: "flash" as const,
      titleKey: "communication.event.flash.title" as const,
      messageKey: "communication.event.flash.draftSaved" as const,
      href: "/flash" as const,
    };

    runtime.updateContext({
      identity: "guest",
      pathname: "/",
      locale: "fr",
      assistantEnabled: false,
    });
    expect(runtime.publishEvent(event)).toBe(false);
    expect(runtime.getEvents()).toHaveLength(0);

    runtime.updateContext({
      identity: "member",
      pathname: "/",
      locale: "fr",
      assistantEnabled: false,
    });
    expect(runtime.publishEvent(event)).toBe(true);
    runtime.resetSession();
    expect(runtime.getEvents()).toHaveLength(0);
    expect(runtime.getUnreadEventCount()).toBe(0);
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
