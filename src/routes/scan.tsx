import { createFileRoute } from "@tanstack/react-router";
import { ScanLine } from "lucide-react";
import { SectionFoundation } from "@/components/experience/SectionFoundation";
import { ScanPanel } from "@/domains/scan/ui/ScanPanel";
import { EnginePreviewCard } from "@/components/experience/EnginePreviewCard";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan — Vitalis" },
      { name: "description", content: "Repère les Flash actifs autour de vous." },
    ],
  }),
  component: () => (
    <SectionFoundation
      eyebrowKey="page.scan.eyebrow"
      titleKey="page.scan.title"
      descKey="page.scan.desc"
      tone="info"
      icon={ScanLine}
      sections={[
        {
          key: "example",
          titleKey: "home.engine.exampleLabel",
          perf: "short",
          render: () => (
            <EnginePreviewCard
              titleKey="home.engine.scan.title"
              descriptionKey="home.engine.scan.example"
            />
          ),
        },
        {
          key: "scan",
          titleKey: "page.scan.section.scan",
          perf: "short",
          render: () => <ScanPanel />,
        },
      ]}
    />
  ),
});
