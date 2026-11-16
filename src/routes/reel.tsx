import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/reel")({
  head: () => ({
    meta: [
      { title: "En direct — Vitalis" },
      { property: "og:title", content: "En direct — Vitalis" },
      {
        name: "description",
        content:
          "Découvrez les personnes présentes autour de vous et gérez vos mises en relation en temps réel.",
      },
      {
        property: "og:description",
        content:
          "Découvrez les personnes présentes autour de vous avec la page En direct de Vitalis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});
