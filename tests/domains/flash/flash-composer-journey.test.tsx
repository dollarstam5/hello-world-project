import React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { createFlashMock, authMock, dialogMock } = vi.hoisted(() => ({
  createFlashMock: vi.fn(),
  authMock: vi.fn(),
  dialogMock: { open: false },
}));

vi.mock("@/domains/auth", () => ({ useAuth: () => authMock() }));
vi.mock("@/lib/i18n/useI18n", () => ({ useI18n: () => ({ t: (key: string) => key, locale: "fr" }) }));
vi.mock("@/domains/flash/data", () => ({ createFlash: createFlashMock }));
vi.mock("@/domains/flash/ui/FlashFeed", () => ({ FlashFeed: () => <div data-testid="feed" /> }));
vi.mock("@/domains/flash/ui/MyFlashManagement", () => ({ MyFlashManagement: () => <div data-testid="management" /> }));
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, type = "button", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) =>
    <button type={type} onClick={onClick} disabled={disabled} {...props}>{children}</button>,
}));
vi.mock("@/components/ui/textarea", () => ({
  Textarea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} />,
}));
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ open, children }: { open: boolean; children: React.ReactNode }) => {
    dialogMock.open = open;
    return <>{children}</>;
  },
  DialogContent: ({ children }: { children: React.ReactNode }) => dialogMock.open ? <div role="dialog">{children}</div> : null,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <header>{children}</header>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

import { FlashExperienceScreen } from "@/domains/flash/ui/FlashExperienceScreen";


describe("Flash composer journey (T2)", () => {
  let host: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;

  beforeEach(() => {
    authMock.mockReturnValue({ user: { id: "member-42" }, loading: false });
    createFlashMock.mockResolvedValue(undefined);
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    host.remove();
    vi.clearAllMocks();
    dialogMock.open = false;
  });


  it("keeps the message and criteria while navigating back and saves the chosen draft", async () => {
    const message = "Besoin de deux personnes pour mon déménagement demain à Bonanjo";
    await act(async () => root.render(<FlashExperienceScreen />));

    const click = async (label: string) => {
      const button = Array.from(host.querySelectorAll("button")).find((node) => node.textContent?.includes(label));
      expect(button, `button containing ${label}`).toBeTruthy();
      await act(async () => (button as HTMLButtonElement).click());
    };
    const textArea = () => host.querySelector("textarea") as HTMLTextAreaElement;

    await click("flash.hero.action");
    await act(async () => {
      const textarea = textArea();
      const nativeSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
      nativeSetter?.call(textarea, message);
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await click("common.continue");
    expect(host.textContent).toContain(message);

    await click("flash.composer.editMessage");
    expect(textArea().value).toBe(message);
    await click("common.continue");
    await click("flash.composer.confirmAction");
    expect(host.textContent).toContain(message);

    const select = host.querySelector("select") as HTMLSelectElement;
    await act(async () => {
      const nativeSetter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value")?.set;
      nativeSetter?.call(select, "tomorrow");
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await click("flash.scope.whole_city");
    await click("flash.urgency.urgent");
    await click("common.continue");
    expect(host.textContent).toContain(message);
    expect(host.textContent).toContain("flash.slot.tomorrow");
    expect(host.textContent).toContain("flash.scope.whole_city");
    expect(host.textContent).toContain("flash.urgency.urgent");

    await click("flash.composer.editCriteria");
    expect((host.querySelector("select") as HTMLSelectElement).value).toBe("tomorrow");
    expect(host.querySelector('button[aria-pressed="true"]')?.textContent).toContain("flash.scope.whole_city");
    expect(host.querySelectorAll('button[aria-pressed="true"]')[1]?.textContent).toContain("flash.urgency.urgent");
    await click("common.continue");
    await click("flash.composer.previewContinue");

    await click("flash.composer.publishLater");
    expect(createFlashMock).toHaveBeenCalledOnce();
    expect(createFlashMock).toHaveBeenCalledWith(expect.objectContaining({
      authorId: "member-42",
      body: message,
      timeSlot: "tomorrow",
      scope: "whole_city",
      urgency: "urgent",
    }));
    expect(host.textContent).toContain("flash.composer.draftSaved");
  });
});
