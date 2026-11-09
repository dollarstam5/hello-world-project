import { createFileRoute } from "@tanstack/react-router";
import { HomeFoundation } from "@/components/experience/HomeFoundation";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vitalis — Accueil" },
      {
        name: "description",
        content:
          "Découvrez les espaces de Vitalis : Flash, Scan, Réel et Radar, puis explorez les fonctions complémentaires du menu 2×2.",
      },
      { property: "og:title", content: "Vitalis — Accueil" },
      {
        property: "og:description",
        content: "Découvrez les espaces de Vitalis et choisissez par où commencer.",
      },
    ],
  }),
  component: HomeFoundation,
});
