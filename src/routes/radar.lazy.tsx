import { createLazyFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { EnginePreviewCard } from "@/components/experience/EnginePreviewCard";
import { SectionFoundation } from "@/composition/layouts/SectionFoundation";
import { RadarManagement } from "@/modules/radar";

export const Route = createLazyFileRoute("/radar")({
  component: RadarRoute,
});

function RadarRoute() {
  return (
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
  );
}
