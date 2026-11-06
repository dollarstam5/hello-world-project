import { createFileRoute } from "@tanstack/react-router";
import { ScanLine } from "lucide-react";
import { SectionFoundation } from "@/components/experience/SectionFoundation";
import { ScanPanel } from "@/domains/scan/ui/ScanPanel";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan — Écosystème" },
      { name: "description", content: "Repère les Flash actifs autour de toi." },
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
      ]}
      footer="Foundation · Scan"
    />
  ),
});
