import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { BottomNav } from "@/components/app/BottomNav";

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
  useRouterState: (options: { select: (state: { location: { pathname: string } }) => string }) =>
    options.select({ location: { pathname: "/scan" } }),
}));

vi.mock("@/lib/i18n/useI18n", () => ({
  useI18n: () => ({
    t: (key: string) =>
      ({
        "nav.primary": "Navigation principale",
        "nav.reel": "Instant",
        "nav.flash": "Flash",
        "nav.scan": "Scan",
        "nav.radar": "Radar",
        "nav.menu": "2x2",
        "nav.open_menu": "Ouvrir le menu",
      })[key] ?? key,
  }),
}));

vi.mock("@/lib/design/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

vi.mock("framer-motion", () => ({
  motion: {
    span: ({
      children,
      layoutId: _layoutId,
      transition: _transition,
      ...props
    }: React.HTMLAttributes<HTMLSpanElement> & {
      layoutId?: string;
      transition?: unknown;
    }) => <span {...props}>{children}</span>,
  },
}));

describe("BottomNav", () => {
  it("exposes the five validated controls in the approved order", () => {
    const markup = renderToStaticMarkup(
      <BottomNav onOpenMenu={() => undefined} menuOpen={false} />,
    );
    const flash = markup.indexOf('href="/flash"');
    const scan = markup.indexOf('href="/scan"');
    const reel = markup.indexOf('href="/reel"');
    const radar = markup.indexOf('href="/radar"');
    const menu = markup.indexOf('aria-label="Ouvrir le menu"');

    expect(markup).toContain('<nav aria-label="Navigation principale"');
    expect(flash).toBeGreaterThan(-1);
    expect(flash).toBeLessThan(scan);
    expect(scan).toBeLessThan(reel);
    expect(reel).toBeLessThan(radar);
    expect(radar).toBeLessThan(menu);
    expect(markup).not.toContain('href="/"');
    expect(markup).not.toContain('role="tablist"');
  });

  it("exposes the active route and an accessible secondary-menu button", () => {
    const markup = renderToStaticMarkup(<BottomNav onOpenMenu={() => undefined} menuOpen={true} />);

    expect(markup).toContain('href="/scan" aria-label="Scan" aria-current="page"');
    expect(markup).toContain('aria-label="Ouvrir le menu"');
    expect(markup).toContain('aria-haspopup="dialog"');
    expect(markup).toContain('aria-expanded="true"');
  });

  it("keeps every navigation target at least 48 CSS pixels wide and high", () => {
    const markup = renderToStaticMarkup(
      <BottomNav onOpenMenu={() => undefined} menuOpen={false} />,
    );

    expect(markup.match(/min-h-12 min-w-12/g)?.length).toBeGreaterThanOrEqual(5);
  });
});
