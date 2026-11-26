import { describe, expect, it } from "vitest";
import { visionMessages } from "@/platform/internationalization/vision-messages";
import visionPage from "../src/composition/experiences/vision/VitalisVisionPage.tsx?raw";
import visionCard from "../src/composition/experiences/vision/VitalisVisionCard.tsx?raw";
import visionRoute from "../src/routes/vision.lazy.tsx?raw";
import legacyVisionPage from "../src/components/experience/VitalisVisionPage.tsx?raw";

describe("Vision capability copy", () => {
  it("describes Flash as a local draft until publication is available", () => {
    expect(visionMessages.fr["vision.engine.flash.action"]).toContain("brouillon");
    expect(visionMessages.en["vision.engine.flash.action"]).toContain("draft");
    expect(visionMessages.fr["vision.deep.flash.use"]).toContain("publication n’est pas encore activée");
    expect(visionMessages.en["vision.deep.flash.use"]).toContain("Publication is not yet active");
  });

  it("describes Radar as saved draft criteria, not active tracking", () => {
    expect(visionMessages.fr["vision.engine.radar.role"]).toContain("brouillon privé");
    expect(visionMessages.fr["vision.engine.radar.boundary"]).toContain("ne sont pas actifs");
    expect(visionMessages.en["vision.engine.radar.role"]).toContain("private draft");
    expect(visionMessages.en["vision.engine.radar.boundary"]).toContain("not active");
  });

  it("keeps French and English Vision message keys aligned", () => {
    expect(Object.keys(visionMessages.en).sort()).toEqual(Object.keys(visionMessages.fr).sort());
  });
});

describe("Vision composition boundaries", () => {
  it("uses canonical internationalization and keeps the route on the composition entrypoint", () => {
    expect(visionPage).toContain('@/platform/internationalization/useVisionI18n');
    expect(visionCard).toContain('@/platform/internationalization/useI18n');
    expect(visionPage).not.toContain('@/lib/i18n/');
    expect(visionCard).not.toContain('@/lib/i18n/');
    expect(visionRoute).toContain('@/composition/experiences/vision/VitalisVisionPage');
    expect(legacyVisionPage).toContain('@/composition/experiences/vision/VitalisVisionPage');
  });
});
