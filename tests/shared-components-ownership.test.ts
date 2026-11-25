import { describe, expect, it } from "vitest";
import sharedIndexSource from "../src/shared/components/index.ts?raw";
import smartCardSource from "../src/shared/components/SmartCard.tsx?raw";
import modalSource from "../src/shared/components/Modal.tsx?raw";
import sheetSource from "../src/shared/components/Sheet.tsx?raw";
import legacySmartCardSource from "../src/components/app/SmartCard.tsx?raw";
import legacyModalSource from "../src/components/app/Modal.tsx?raw";
import legacySheetSource from "../src/components/app/Sheet.tsx?raw";

describe("shared component ownership", () => {
  it("exports the canonical SmartCard, Modal and Sheet implementations", () => {
    expect(sharedIndexSource).toContain('export { SmartCard } from "./SmartCard";');
    expect(sharedIndexSource).toContain('export { Modal } from "./Modal";');
    expect(sharedIndexSource).toContain('export { Sheet } from "./Sheet";');
  });

  it("keeps legacy app component paths as compatibility facades", () => {
    expect(legacySmartCardSource).toContain('export { SmartCard } from "@/shared/components/SmartCard";');
    expect(legacyModalSource).toContain('export { Modal } from "@/shared/components/Modal";');
    expect(legacySheetSource).toContain('export { Sheet } from "@/shared/components/Sheet";');
  });

  it("keeps shared primitives independent of app-specific navigation and copy", () => {
    expect(smartCardSource).toContain('from "./Surface"');
    expect(smartCardSource).not.toContain("@/components/experience/");
    expect(modalSource).not.toContain("@/components/experience/");
    expect(sheetSource).not.toContain("@/components/experience/");
  });
});
