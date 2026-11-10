import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { EnginePreviewCard } from "@/components/experience/EnginePreviewCard";
import { EngineSectionUnavailable } from "@/components/experience/EngineSectionUnavailable";
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
        { key: "followed", titleKey: "radar.section.followed", perf: "short", render: () => <EngineSectionUnavailable descriptionKey="radar.section.unavailable" /> },
        { key: "alerts", titleKey: "radar.section.alerts", perf: "short", render: () => <EngineSectionUnavailable descriptionKey="radar.section.unavailable" /> },
        { key: "results", titleKey: "radar.section.results", perf: "short", render: () => <EngineSectionUnavailable descriptionKey="radar.section.unavailable" /> },
      ]}
    />
  ),
});
