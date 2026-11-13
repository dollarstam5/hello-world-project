import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { EnginePreviewCard } from "@/components/experience/EnginePreviewCard";
import { SectionFoundation } from "@/components/experience/SectionFoundation";
import { RadarManagement } from "@/domains/radar/ui/RadarManagement";

export const Route = createFileRoute("/radar")({
  head: () => ({
    meta: [
      { title: "Radar — Vitalis" },
      { name: "description", content: "Enregistrez les recherches que vous souhaitez suivre." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <SectionFoundation
      eyebrowKey="page.radar.eyebrow"
      titleKey="page.radar.title"
      descKey="page.radar.desc"
      tone="info"
      icon={MapPin}
      sections={[
        {
          key: "management",
          titleKey: "radar.section.management",
          perf: "short",
          render: () => <RadarManagement />,
        },
        {
          key: "example",
          titleKey: "home.demo.title",
          perf: "short",
          render: () => (
            <EnginePreviewCard
              titleKey="home.engine.radar.title"
              descriptionKey="home.engine.radar.example"
            />
          ),
        },
      ]}
    />
  ),
});
