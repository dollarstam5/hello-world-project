import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CommunicationSheet } from "@/components/experience/CommunicationSheet";

const assistantPreference = vi.hoisted(() => ({ enabled: false }));

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
  });

  it("hides the assistant space while the assistant is disabled", () => {
    const markup = renderToStaticMarkup(<CommunicationSheet open onOpenChange={() => undefined} />);

    expect(markup.match(/role="tab"/g)).toHaveLength(3);
    expect(markup).not.toContain("communication.assistant</button>");
    expect(markup).toContain("communication.notifications</button>");
    expect(markup).toContain("communication.messages</button>");
    expect(markup).toContain("communication.reel</button>");
  });

  it("exposes the four communication spaces in the approved order after opt-in", () => {
    assistantPreference.enabled = true;
    const markup = renderToStaticMarkup(<CommunicationSheet open onOpenChange={() => undefined} />);
    const notifications = markup.indexOf("communication.notifications</button>");
    const assistant = markup.indexOf("communication.assistant</button>");
    const messages = markup.indexOf("communication.messages</button>");
    const reel = markup.indexOf("communication.reel</button>");

    expect(markup).toContain('aria-label="communication.title"');
    expect(markup).toMatch(/role="tablist"[^>]*aria-label="communication\.title"/);
    expect(markup.match(/role="tab"/g)).toHaveLength(4);
    expect(notifications).toBeGreaterThan(-1);
    expect(notifications).toBeLessThan(assistant);
    expect(assistant).toBeLessThan(messages);
    expect(messages).toBeLessThan(reel);
  });

  it("keeps communication spaces associated with tab panels", () => {
    const markup = renderToStaticMarkup(<CommunicationSheet open onOpenChange={() => undefined} />);

    expect(markup.match(/role="tabpanel"/g)?.length).toBeGreaterThanOrEqual(1);
    expect(markup).toContain('data-state="active"');
    expect(markup).toContain("communication.notifications.empty");
    expect(markup).toContain("aria-controls=");
  });
});
