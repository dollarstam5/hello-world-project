import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { EnginePreviewCard } from "@/components/experience/EnginePreviewCard";

vi.mock("@/lib/i18n/useI18n", () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

describe("EnginePreviewCard", () => {
  it("marks the teaching scenario as an example and keeps the copy separate", () => {
    const markup = renderToStaticMarkup(
      <EnginePreviewCard
        titleKey="home.engine.reel.title"
        descriptionKey="home.engine.reel.example"
      />,
    );

    expect(markup).toContain("home.engine.exampleLabel");
    expect(markup).toContain("home.engine.reel.title");
    expect(markup).toContain("home.engine.reel.example");
    expect(markup).toContain("<article");
  });
});
