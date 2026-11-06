import { createFileRoute } from "@tanstack/react-router";
import { FlashSpace } from "@/domains/flash/ui/FlashSpace";

export const Route = createFileRoute("/flash")({
  head: () => ({
    meta: [
      { title: "Flash — Vitalis" },
      { name: "description", content: "Moments éphémères de l'écosystème." },
    ],
  }),
  component: FlashSpace,
});
