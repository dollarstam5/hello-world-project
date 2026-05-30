import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/app/PlaceholderPage";

export const Route = createFileRoute("/flash")({
  head: () => ({
    meta: [
      { title: "Flash — Écosystème" },
      { name: "description", content: "Moments éphémères de l'écosystème." },
    ],
  }),
  component: () => (
    <PlaceholderPage titleKey="page.flash.title" descKey="page.flash.desc" />
  ),
});
