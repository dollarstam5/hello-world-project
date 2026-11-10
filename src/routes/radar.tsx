import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { EnginePreviewCard } from "@/components/experience/EnginePreviewCard";
import { SectionFoundation } from "@/components/experience/SectionFoundation";

export const Route = createFileRoute("/radar")({
  head: () => ({
    meta: [
      { title: "Radar — Vitalis" },
      { name: "description", content: "Ce qui se passe autour de vous." },
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
