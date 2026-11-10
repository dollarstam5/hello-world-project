import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { EnginePreviewCard } from "@/components/experience/EnginePreviewCard";
import { SectionFoundation } from "@/components/experience/SectionFoundation";

export const Route = createFileRoute("/talents")({
  head: () => ({
    meta: [
      { title: "Talents — Vitalis" },
      { name: "description", content: "Connaissances vivantes, échanges humains." },
    ],
  }),
  component: () => (
    <SectionFoundation
      eyebrowKey="page.talents.eyebrow"
      titleKey="page.talents.title"
      descKey="page.talents.desc"
      tone="intelligence"
      icon={Sparkles}
      sections={[
        { key: "offer", titleKey: "page.talents.section.offer", perf: "short" },
        { key: "seek", titleKey: "page.talents.section.seek", perf: "tall" },
        {
          key: "example",
          titleKey: "home.demo.title",
          perf: "short",
          render: () => (
            <EnginePreviewCard
              titleKey="page.talents.example.title"
              descriptionKey="page.talents.example.desc"
            />
          ),
        },
      ]}
    />
  ),
});
