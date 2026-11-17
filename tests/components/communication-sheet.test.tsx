import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  CommunicationSheet,
  getReelActivityStatusKey,
} from "@/components/experience/CommunicationSheet";

const assistantPreference = vi.hoisted(() => ({ enabled: false }));
const communicationState = vi.hoisted(() => ({
  events: [] as Array<{
    id: string;
    source: "flash" | "radar" | "reel";
    titleKey: string;
    messageKey: string;
    href: "/flash" | "/radar" | "/reel";
    createdAt: number;
    readAt: number | null;
  }>,
  markEventRead: vi.fn(),
}));

const networkState = vi.hoisted(() => ({ online: true }));
const reelProjection = vi.hoisted(() => ({
  pendingBips: 0,
  activeConnections: 0,
  bipsReady: false,
  connectionsReady: false,
}));

vi.mock("@/domains/presence/model/reel-activity-projection", () => ({
  useReelActivityProjection: (selector: (state: typeof reelProjection) => unknown) =>
    selector(reelProjection),
}));

vi.mock("@/lib/platform/useNetworkStatus", () => ({
  useNetworkStatus: () => ({ online: networkState.online }),
}));

vi.mock("@/lib/communication/CommunicationRuntimeProvider", () => ({
  useCommunicationRuntime: () => ({
    getEvents: () => communicationState.events,
    markEventRead: communicationState.markEventRead,
  }),
}));

vi.mock("@/lib/app/assistant-preferences", () => ({
  useAssistantPreferences: (selector: (state: { enabled: boolean }) => unknown) =>
    selector({ enabled: assistantPreference.enabled }),
}));

vi.mock("@/components/app/Sheet", () => ({
  Sheet: ({ children, title }: { children: ReactNode; title: ReactNode }) => (
    <section aria-label={title}>{children}</section>
  ),
}));

vi.mock("@/lib/i18n/useI18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

describe("CommunicationSheet", () => {
  beforeEach(() => {
    assistantPreference.enabled = false;
    networkState.online = true;
    communicationState.events = [];
    communicationState.markEventRead.mockClear();
  });

  it("distinguishes an unloaded live projection from an offline projection", () => {
    expect(getReelActivityStatusKey(true)).toBe("communication.reel.notLoaded");
    expect(getReelActivityStatusKey(false)).toBe("communication.reel.offline");
  });

  it("keeps existing communications visible and explains offline limitations", () => {
    networkState.online = false;
    communicationState.events = [
      {
        id: "flash:record-1:updated:100",
        source: "flash",
        titleKey: "communication.event.flash.title",
        messageKey: "communication.event.flash.updated",
        href: "/flash",
        createdAt: 100,
        readAt: null,
      },
    ];
    const markup = renderToStaticMarkup(<CommunicationSheet open onOpenChange={() => undefined} />);

    expect(markup).toContain("communication.offline");
    expect(markup).toContain("communication.event.flash.updated");
  });

  it("hides the assistant space while the assistant is disabled", () => {
    const markup = renderToStaticMarkup(<CommunicationSheet open onOpenChange={() => undefined} />);

    expect(markup.match(/role="tab"/g)).toHaveLength(3);
    expect(markup).not.toContain("communication.assistant</button>");
    expect(markup).toContain("communication.notifications");
    expect(markup).toContain("communication.messages");
    expect(markup).toContain("communication.reel");
  });

  it("exposes the four communication spaces in the approved order after opt-in", () => {
    assistantPreference.enabled = true;
    const markup = renderToStaticMarkup(<CommunicationSheet open onOpenChange={() => undefined} />);
    const notifications = markup.indexOf("communication.notifications");
    const assistant = markup.indexOf("communication.assistant");
    const messages = markup.indexOf("communication.messages");
    const reel = markup.indexOf("communication.reel");

    expect(markup).toContain('aria-label="communication.title"');
    expect(markup).toMatch(/role="tablist"[^>]*aria-label="communication\.title"/);
    expect(markup.match(/role="tab"/g)).toHaveLength(4);
    expect(notifications).toBeGreaterThan(-1);
    expect(notifications).toBeLessThan(assistant);
    expect(assistant).toBeLessThan(messages);
    expect(messages).toBeLessThan(reel);
  });

  it("renders only published business events in Notifications", () => {
    communicationState.events = [
      {
        id: "radar:record-1:saved",
        source: "radar",
        titleKey: "communication.event.radar.title",
        messageKey: "communication.event.radar.saved",
        href: "/radar",
        createdAt: 100,
        readAt: null,
      },
    ];
    const markup = renderToStaticMarkup(<CommunicationSheet open onOpenChange={() => undefined} />);

    expect(markup).toContain("communication.event.radar.title");
    expect(markup).toContain("communication.event.radar.saved");
    expect(markup).toContain('href="/radar"');
    expect(markup).toContain("communication.events.markRead");
  });

  it("shows separate attention indicators without counting received bips twice", () => {
    communicationState.events = [
      {
        id: "flash:record-1:updated:100",
        source: "flash",
        titleKey: "communication.event.flash.title",
        messageKey: "communication.event.flash.updated",
        href: "/flash",
        createdAt: 100,
        readAt: null,
      },
      {
        id: "reel:bip-1",
        source: "reel",
        titleKey: "communication.event.reel.title",
        messageKey: "communication.event.reel.bipReceived",
        href: "/reel",
        createdAt: 200,
        readAt: null,
      },
    ];
    const markup = renderToStaticMarkup(<CommunicationSheet open onOpenChange={() => undefined} />);

    expect(markup).toContain('aria-label="communication.notifications (1)"');
    // The received bip is owned by En direct, not repeated in the Notifications badge.
    expect(markup).toContain('aria-label="communication.reel"');
    expect(markup).not.toContain('aria-label="communication.notifications (2)"');
  });

  it("routes server-originated Réel events back to the owning engine", () => {
    communicationState.events = [
      {
        id: "reel:server-event",
        source: "reel",
        titleKey: "communication.event.reel.title",
        messageKey: "communication.event.reel.bipReceived",
        href: "/reel",
        createdAt: 200,
        readAt: null,
      },
    ];
    const markup = renderToStaticMarkup(<CommunicationSheet open onOpenChange={() => undefined} />);

    expect(markup).toContain("communication.event.reel.title");
    expect(markup).toContain("communication.event.reel.bipReceived");
    expect(markup).toContain('href="/reel"');
    expect(markup).toContain("communication.events.openReel");
  });

  it("keeps communication spaces associated with tab panels", () => {
    const markup = renderToStaticMarkup(<CommunicationSheet open onOpenChange={() => undefined} />);

    expect(markup.match(/role="tabpanel"/g)?.length).toBeGreaterThanOrEqual(1);
    expect(markup).toContain('data-state="active"');
    expect(markup).toContain("communication.events.empty");
    expect(markup).toContain("aria-controls=");
  });
});
