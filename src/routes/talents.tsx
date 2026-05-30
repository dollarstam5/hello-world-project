import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/app/PlaceholderPage";

export const Route = createFileRoute("/talents")({
  head: () => ({
    meta: [
      { title: "Talents — Savoirs Vivants" },
      { name: "description", content: "Connaissances vivantes, échanges humains." },
    ],
  }),
  component: () => (
    <PlaceholderPage titleKey="page.talents.title" descKey="page.talents.desc" />
  ),
});
