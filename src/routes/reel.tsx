import { createFileRoute } from "@tanstack/react-router";
import { ReelSpace } from "@/domains/reel/ui/ReelSpace";

export const Route = createFileRoute("/reel")({
  head: () => ({
    meta: [
      { title: "Réel — Vitalis" },
      { name: "description", content: "Présence et découverte à proximité immédiate." },
    ],
  }),
  component: ReelSpace,
});
