import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/vision")({
  head: () => ({
    meta: [
      { title: "La vision de Vitalis — Vitalis" },
      {
        name: "description",
        content: "Comprendre Vitalis, ses quatre moteurs, ses actions et ses principes.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
});
