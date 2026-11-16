import { createLazyFileRoute } from "@tanstack/react-router";
import { ScanLine } from "lucide-react";
import { SectionFoundation } from "@/components/experience/SectionFoundation";
import { ScanPanel } from "@/domains/scan/ui/ScanPanel";
import { EnginePreviewCard } from "@/components/experience/EnginePreviewCard";

export const Route = createLazyFileRoute("/scan")({
  component: ScanRoute,
});

function ScanRoute() {
  return (
    <SectionFoundation
      eyebrowKey="page.scan.eyebrow"
      titleKey="page.scan.title"
      descKey="page.scan.desc"
      tone="info"
      icon={ScanLine}
      sections={[
        {
          key: "scan",
          titleKey: "page.scan.section.scan",
          perf: "short",
          render: () => <ScanPanel />,
        },
        {
          key: "example",
          titleKey: "home.demo.title",
          perf: "short",
          render: () => (
            <EnginePreviewCard
              titleKey="home.engine.scan.title"
              descriptionKey="home.engine.scan.example"
            />
          ),
        },
      ]}
    />
  );
}
