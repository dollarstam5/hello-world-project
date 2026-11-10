import { createFileRoute } from "@tanstack/react-router";
import { RadioTower } from "lucide-react";
import { EnginePreviewCard } from "@/components/experience/EnginePreviewCard";
import { EngineManagementGrid } from "@/components/experience/EngineManagementGrid";
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
        {
          key: "management",
          titleKey: "reel.section.management",
          perf: "short",
          render: () => (
            <EngineManagementGrid
              items={[
                {
                  key: "presence",
                  titleKey: "reel.section.presence",
                  descriptionKey: "reel.section.presence.desc",
                },
                {
                  key: "bips",
                  titleKey: "reel.section.bips",
                  descriptionKey: "reel.section.bips.desc",
                },
                {
                  key: "connections",
                  titleKey: "reel.section.connections",
                  descriptionKey: "reel.section.connections.desc",
                },
                {
                  key: "history",
                  titleKey: "reel.section.history",
                  descriptionKey: "reel.section.history.desc",
                },
              ]}
              descriptionKey="reel.section.unavailable"
            />
          ),
        },
      ]}
    />
  ),
});
