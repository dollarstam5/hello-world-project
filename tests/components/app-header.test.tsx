import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { AppHeader } from "@/components/experience/AppHeader";

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

vi.mock("@/lib/i18n/useI18n", () => ({
  useI18n: () => ({
    t: (key: string) =>
      ({
        "nav.home": "Accueil",
        "communication.open": "Ouvrir les communications",
        "menu.espace.open": "Ouvrir mon espace",
      })[key] ?? key,
  }),
}));

describe("AppHeader", () => {
  it("keeps only the app identity, notifications and profile", () => {
    const markup = renderToStaticMarkup(<AppHeader onOpenCommunication={() => undefined} />);

    expect(markup).toContain('class="sticky top-0 z-30 bg-transparent"');
    expect(markup).toContain('href="/"');
    expect(markup).toContain('src="/icon-192.svg"');
    expect(markup).toContain('aria-label="Ouvrir les communications"');
    expect(markup).toContain('aria-label="Ouvrir mon espace"');
    expect(markup).not.toContain("Changer de langue");
    expect(markup).not.toContain("Changer de thème");
    expect(markup).not.toContain("Déconnexion");
  });

  it("keeps primary header controls at least 48px with visible focus", () => {
    const markup = renderToStaticMarkup(<AppHeader onOpenCommunication={() => undefined} />);

    expect(markup.match(/h-12 w-12/g)?.length).toBeGreaterThanOrEqual(2);
    expect(markup).toContain("focus-visible:ring-2");
  });
});
