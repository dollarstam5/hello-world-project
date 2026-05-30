import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/app/PlaceholderPage";

export const Route = createFileRoute("/radar")({
  head: () => ({
    meta: [
      { title: "Radar — Écosystème" },
      { name: "description", content: "Ce qui se passe autour de vous." },
    ],
  }),
  component: () => (
    <PlaceholderPage titleKey="page.radar.title" descKey="page.radar.desc" />
  ),
});
