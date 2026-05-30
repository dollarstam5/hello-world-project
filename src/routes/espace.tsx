import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/app/PlaceholderPage";

export const Route = createFileRoute("/espace")({
  head: () => ({
    meta: [
      { title: "Espace — Écosystème" },
      { name: "description", content: "Votre espace personnel." },
    ],
  }),
  component: () => (
    <PlaceholderPage titleKey="page.espace.title" descKey="page.espace.desc" />
  ),
});
