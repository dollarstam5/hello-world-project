import { createFileRoute } from "@tanstack/react-router";
import { ScanLine } from "lucide-react";
import { SectionFoundation } from "@/components/experience/SectionFoundation";
import { ScanPanel } from "@/domains/scan/ui/ScanPanel";
import { EnginePreviewCard } from "@/components/experience/EnginePreviewCard";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan — Vitalis" },
      {
        name: "description",
        content: "Repérez les Flash actifs dans la zone que vous choisissez.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
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
  ),
});
