import { createFileRoute } from "@tanstack/react-router";
import { RadioTower } from "lucide-react";
import { EnginePreviewCard } from "@/components/experience/EnginePreviewCard";
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
      ]}
    />
  ),
});
