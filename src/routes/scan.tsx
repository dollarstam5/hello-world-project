import { createFileRoute } from "@tanstack/react-router";
import { ScanLine } from "lucide-react";
import { SectionFoundation } from "@/components/experience/SectionFoundation";
import { ScanPanel } from "@/domains/scan/ui/ScanPanel";
import { EnginePreviewCard } from "@/components/experience/EnginePreviewCard";
import { EngineSectionUnavailable } from "@/components/experience/EngineSectionUnavailable";
import { Surface } from "@/components/app/Surface";
import { useI18n } from "@/lib/i18n/useI18n";

function ScanHistoryNotice() {
  const { t } = useI18n();
  return <Surface variant="sunken" padding="md" bordered><p className="text-sm leading-relaxed text-muted-foreground">{t("scan.history.desc")}</p></Surface>;
}

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan — Vitalis" },
      {
        name: "description",
        content: "Repérez les Flash actifs dans la zone que vous choisissez.",
      },
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
        {
          key: "history",
          titleKey: "scan.history.title",
          perf: "short",
          render: () => <ScanHistoryNotice />,
        },
      ]}
    />
  ),
});
