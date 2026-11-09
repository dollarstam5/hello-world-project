import { createFileRoute } from "@tanstack/react-router";
import { HomeFoundation } from "@/components/experience/HomeFoundation";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vitalis — Accueil" },
      {
        name: "description",
        content:
          "Votre espace Vitalis : les moteurs locaux, les échanges et les opportunités, même hors connexion.",
      },
      { property: "og:title", content: "Vitalis — Accueil" },
      {
        property: "og:description",
        content: "Accueil Vitalis — votre point de départ.",
      },
    ],
  }),
  component: HomeFoundation,
});
