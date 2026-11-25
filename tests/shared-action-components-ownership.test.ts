import { describe, expect, it } from "vitest";
import sharedIndexSource from "../src/shared/components/index.ts?raw";
import floatingButtonSource from "../src/shared/components/FloatingButton.tsx?raw";
import smartTabsSource from "../src/shared/components/SmartTabs.tsx?raw";
import legacyFloatingButtonSource from "../src/components/app/FloatingButton.tsx?raw";
import legacySmartTabsSource from "../src/components/app/SmartTabs.tsx?raw";
import aiBubbleSource from "../src/components/app/AIBubble.tsx?raw";
import emptyStateSource from "../src/components/app/EmptyState.tsx?raw";

describe("shared action and navigation primitives", () => {
  it("exports FloatingButton and SmartTabs from their canonical shared modules", () => {
    expect(sharedIndexSource).toContain('export { FloatingButton } from "./FloatingButton";');
    expect(sharedIndexSource).toContain('export { SmartTabs, type SmartTab } from "./SmartTabs";');
  });

  it("keeps historical app import paths as compatibility facades", () => {
    expect(legacyFloatingButtonSource).toContain('export { FloatingButton } from "@/shared/components/FloatingButton";');
    expect(legacySmartTabsSource).toContain('export { SmartTabs, type SmartTab } from "@/shared/components/SmartTabs";');
  });

  it("keeps shared primitives independent of application-specific components", () => {
    expect(floatingButtonSource).not.toContain("@/components/app/");
    expect(smartTabsSource).not.toContain("@/components/app/");
  });

  it("keeps assistant and translated empty-state components in the app layer", () => {
    expect(aiBubbleSource).toContain('from "@/lib/design/useReducedMotion"');
    expect(emptyStateSource).toContain('from "@/lib/i18n/useI18n"');
    expect(sharedIndexSource).toContain('export { AIBubble } from "@/components/app/AIBubble";');
    expect(sharedIndexSource).toContain('export { EmptyState } from "@/components/app/EmptyState";');
  });
});
