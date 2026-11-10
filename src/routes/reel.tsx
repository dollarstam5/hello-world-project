import { createFileRoute } from "@tanstack/react-router";
import { RadioTower } from "lucide-react";
import { EnginePreviewCard } from "@/components/experience/EnginePreviewCard";
import { EngineSectionUnavailable } from "@/components/experience/EngineSectionUnavailable";
import { SectionFoundation } from "@/components/experience/SectionFoundation";

export const Route = createFileRoute("/reel")({
  head: () => ({
    meta: [
      { title: "Réel — Vitalis" },
      { name: "description", content: "Le point d’entrée du moteur Réel de Vitalis." },
    ],
  }),
  component: () => (
    <SectionFoundation
      eyebrowKey="page.reel.eyebrow"
      titleKey="page.reel.title"
      descKey="page.reel.desc"
      tone="primary"
      icon={RadioTower}
      sections={[
        {
          key: "example",
          titleKey: "home.demo.title",
          perf: "short",
          render: () => (
            <EnginePreviewCard
              titleKey="home.engine.reel.title"
              descriptionKey="home.engine.reel.example"
            />
          ),
        },
        { key: "presence", titleKey: "reel.section.presence", perf: "short", render: () => <EngineSectionUnavailable descriptionKey="reel.section.unavailable" /> },
        { key: "bips", titleKey: "reel.section.bips", perf: "short", render: () => <EngineSectionUnavailable descriptionKey="reel.section.unavailable" /> },
        { key: "connections", titleKey: "reel.section.connections", perf: "short", render: () => <EngineSectionUnavailable descriptionKey="reel.section.unavailable" /> },
        { key: "history", titleKey: "reel.section.history", perf: "short", render: () => <EngineSectionUnavailable descriptionKey="reel.section.unavailable" /> },
      ]}
    />
  ),
});
