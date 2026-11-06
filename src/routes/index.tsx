import { createFileRoute } from "@tanstack/react-router";
import { HomeFoundation } from "@/components/experience/HomeFoundation";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vitalis — Vivant, calme, intelligent" },
      {
        name: "description",
        content:
          "Un écosystème vivant qui relie les personnes, les talents et les opportunités, avec calme et intelligence.",
      },
      { property: "og:title", content: "Vitalis — Vivant, calme, intelligent" },
      {
        property: "og:description",
        content: "Votre point d’entrée vers les quatre moteurs Vitalis et les espaces complémentaires.",
      },
    ],
  }),
  component: HomeFoundation,
});
