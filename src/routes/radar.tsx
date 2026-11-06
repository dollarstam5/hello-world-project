import { createFileRoute } from "@tanstack/react-router";
import { RadarSpace } from "@/domains/radar";

export const Route = createFileRoute("/radar")({
  head: () => ({
    meta: [
      { title: "Radar — Vitalis" },
      { name: "description", content: "Ce qui se passe autour de vous." },
    ],
  }),
  component: RadarSpace,
});
