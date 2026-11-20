import React, { type ReactNode, useEffect, useState } from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FlashRecord } from "@eco/core-contracts";

const { recordsMock, authMock, updateMock, deleteMock, archiveMock } = vi.hoisted(() => ({
  recordsMock: [] as unknown[],
  authMock: { listener: null as ((event: string, session: unknown) => void) | null },
  updateMock: vi.fn(),
  deleteMock: vi.fn(),
  archiveMock: vi.fn(),
}));

vi.mock("@/lib/i18n/useI18n", () => ({
  useI18n: () => ({ t: (key: string) => key, locale: "fr" }),
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      onAuthStateChange: (listener: (event: string, session: unknown) => void) => {
        authMock.listener = listener;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      },
      getSession: async () => ({ data: { session: { user: { id: "member-42" } } }, error: null }),
    },
    rpc: vi.fn(),
  },
}));
vi.mock("@/platform/offline", () => ({
  flashesRepository: { list: vi.fn(async () => recordsMock) },
  useLocalQuery: (query: () => Promise<unknown>, deps: unknown[]) => {
    const [result, setResult] = useState<unknown>();
    useEffect(() => {
      let alive = true;
      void query().then((value) => { if (alive) setResult(value); });
      return () => { alive = false; };
    }, deps);
    return result;
  },
}));
vi.mock("@/domains/flash/data", () => ({
  updateFlash: updateMock,
  deleteFlash: deleteMock,
  archiveFlash: archiveMock,
}));
vi.mock("@/components/app/Surface", () => ({
  Surface: ({ children }: { children: ReactNode }) => <article>{children}</article>,
}));
vi.mock("@/components/app/EmptyState", () => ({
  EmptyState: ({ title, description }: { title: string; description: string }) => <div>{title} {description}</div>,
}));
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, type = "button", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) =>
    <button type={type} onClick={onClick} disabled={disabled} {...props}>{children}</button>,
}));
vi.mock("@/components/ui/textarea", () => ({
  Textarea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} />,
}));
vi.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({ open, children }: { open: boolean; children: ReactNode }) => open ? <div role="dialog" data-testid="delete-dialog">{children}</div> : null,
  AlertDialogContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  AlertDialogHeader: ({ children }: { children: ReactNode }) => <header>{children}</header>,
  AlertDialogTitle: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
  AlertDialogDescription: ({ children }: { children: ReactNode }) => <p>{children}</p>,
  AlertDialogFooter: ({ children }: { children: ReactNode }) => <footer>{children}</footer>,
  AlertDialogCancel: ({ children, onClick, disabled }: { children: ReactNode; onClick?: () => void; disabled?: boolean }) =>
    <button type="button" disabled={disabled} onClick={onClick}>{children}</button>,
  AlertDialogAction: ({ children, onClick, disabled }: { children: ReactNode; onClick?: () => void; disabled?: boolean }) =>
    <button type="button" disabled={disabled} onClick={onClick}>{children}</button>,
}));

import { MyFlashManagement } from "@/domains/flash/ui/MyFlashManagement";

const now = Date.now();
const day = 24 * 60 * 60 * 1000;
const makeRecord = (overrides: Partial<FlashRecord> = {}): FlashRecord => ({
  id: "flash-default",
  authorId: "member-42",
  title: "Titre du Flash",
  body: "Contenu détaillé du Flash",
  status: "draft",
  kind: "need",
  category: "home",
  timeSlot: "today",
  scope: "current_area",
  urgency: "today",
  areaLabel: "Bonanjo",
  createdAt: now,
  expiresAt: now + day,
  deletedAt: null,
  mediaIds: [],
  ...overrides,
} as FlashRecord);

describe("Mes Flashs dashboard integration (T3)", () => {
  let host: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;

  beforeEach(() => {
    recordsMock.splice(0, recordsMock.length,
      makeRecord({ id: "draft-new", title: "Flash récent", body: "Texte récent", createdAt: now }),
      makeRecord({ id: "draft-old", title: "Flash ancien", body: "Texte ancien", createdAt: now - 3 * day }),
      makeRecord({ id: "live-item", title: "Flash actif", status: "live", createdAt: now - day }),
      makeRecord({ id: "archived-item", title: "Flash archivé", status: "archived", createdAt: now - 2 * day }),
      makeRecord({ id: "foreign-item", title: "Flash autre membre", authorId: "member-99" }),
      makeRecord({ id: "deleted-item", title: "Flash supprimé", deletedAt: now }),
    );
    authMock.listener = null;
    updateMock.mockResolvedValue(undefined);
    deleteMock.mockResolvedValue(undefined);
    archiveMock.mockResolvedValue(undefined);
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    host.remove();
    vi.clearAllMocks();
    authMock.listener = null;
  });

  const renderDashboard = async () => {
    await act(async () => root.render(<MyFlashManagement />));
    await act(async () => { await Promise.resolve(); await Promise.resolve(); });
  };
  const click = async (label: string) => {
    const button = Array.from(host.querySelectorAll("button")).find((node) => node.textContent?.includes(label));
    expect(button, `button containing ${label}`).toBeTruthy();
    await act(async () => (button as HTMLButtonElement).click());
  };

  it("loads only the member's undeleted records and sorts newest first", async () => {
    await renderDashboard();
    expect(host.textContent).toContain("Flash récent");
    expect(host.textContent).toContain("Flash ancien");
    expect(host.textContent).toContain("Flash actif");
    expect(host.textContent).toContain("Flash archivé");
    expect(host.textContent).not.toContain("Flash autre membre");
    expect(host.textContent).not.toContain("Flash supprimé");
    expect(host.textContent!.indexOf("Flash récent")).toBeLessThan(host.textContent!.indexOf("Flash ancien"));
    expect(host.textContent).toContain("flash.mine.status.draft");
    expect(host.textContent).toContain("flash.mine.status.live");
    expect(host.textContent).toContain("flash.mine.status.archived");
  });

  it("opens and closes a saved Flash's details", async () => {
    await renderDashboard();
    await click("flash.mine.details");
    expect(host.textContent).toContain("Texte récent");
    expect(host.textContent).toContain("Bonanjo");
    await click("flash.mine.closeDetails");
    expect(host.textContent).not.toContain("Texte récent");
  });

  it("calls the edit handler with the changed draft content", async () => {
    await renderDashboard();
    await click("flash.mine.edit");
    const textarea = host.querySelector("textarea") as HTMLTextAreaElement;
    expect(textarea.value).toBe("Texte récent");
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
      setter?.call(textarea, "  Message corrigé  ");
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await click("common.save");
    expect(updateMock).toHaveBeenCalledWith("draft-new", "  Message corrigé  ");
  });

  it("waits for delete confirmation before invoking the delete action", async () => {
    await renderDashboard();
    await click("flash.mine.delete");
    expect(host.querySelector('[data-testid="delete-dialog"]')).toBeTruthy();
    expect(deleteMock).not.toHaveBeenCalled();
    const confirmButton = host.querySelector("[data-testid=\"delete-dialog\"] button") as HTMLButtonElement;
    expect(confirmButton.textContent).toContain("flash.mine.delete");
    await act(async () => confirmButton.click());
    await act(async () => { await Promise.resolve(); });
    expect(deleteMock).toHaveBeenCalledWith("draft-new");
  });

  it("archives a live item and displays an error if the action fails", async () => {
    await renderDashboard();
    expect(host.textContent).toContain("flash.mine.archive");
    archiveMock.mockRejectedValueOnce(new Error("RPC failed"));
    await click("flash.mine.archive");
    await act(async () => { await Promise.resolve(); });
    expect(archiveMock).toHaveBeenCalledWith("live-item");
    expect(host.querySelector('[role="alert"]')?.textContent).toContain("flash.mine.actionError");
  });
});
