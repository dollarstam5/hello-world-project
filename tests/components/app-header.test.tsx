import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { AppHeader } from "@/components/experience/AppHeader";

const state = vi.hoisted(() => ({
  events: [] as Array<{ messageKey: string; readAt: number | null }>,
  pendingBips: 0,
  bipsReady: false,
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    children,
    ...props
  }: {
    to: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/features/communication/CommunicationRuntimeProvider", () => ({
  useCommunicationRuntime: () => ({ getEvents: () => state.events }),
}));

vi.mock("@/domains/presence/model/reel-activity-projection", () => ({
  useReelActivityProjection: (
    selector: (state: { pendingBips: number; bipsReady: boolean }) => unknown,
  ) => selector({ pendingBips: state.pendingBips, bipsReady: state.bipsReady }),
}));

vi.mock("@/lib/i18n/useI18n", () => ({
  useI18n: () => ({
    t: (key: string) =>
      ({
        "nav.home": "Accueil",
        "communication.open": "Ouvrir les communications",
        "profile.quickPreview.open": "Ouvrir mon aperçu de profil",
      })[key] ?? key,
  }),
}));

describe("AppHeader", () => {
  it("keeps only the app identity, notifications and profile", () => {
    const markup = renderToStaticMarkup(<AppHeader onOpenCommunication={() => undefined} />);

    expect(markup).toMatch(/class="sticky top-0 z-30 [^"]*"/);
    expect(markup).toContain('href="/"');
    expect(markup).toContain('src="/icon-192.svg"');
    expect(markup).toContain('aria-label="Ouvrir les communications"');
    expect(markup).toContain('aria-label="Ouvrir mon aperçu de profil"');
    expect(markup).not.toContain("Changer de langue");
    expect(markup).not.toContain("Changer de thème");
    expect(markup).not.toContain("Déconnexion");
  });

  it("counts a received bip once when both the server event and engine projection are present", () => {
    state.events = [
      {
        messageKey: "communication.event.reel.bipReceived",
        readAt: null,
      },
    ];
    state.pendingBips = 1;
    state.bipsReady = true;

    const markup = renderToStaticMarkup(<AppHeader onOpenCommunication={() => undefined} />);

    expect(markup).toContain('aria-label="Ouvrir les communications (1)"');
  });

  it("keeps primary header controls at least 48px with visible focus", () => {
    const markup = renderToStaticMarkup(<AppHeader onOpenCommunication={() => undefined} />);

    expect(markup.match(/h-12 w-12/g)?.length).toBeGreaterThanOrEqual(1);
    expect(markup).toContain("relative h-12 w-12 rounded-full");
    expect(markup).toContain("focus-visible:ring-2");
  });
});
