import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/reel")({
  head: () => ({
    meta: [
      { title: "Instant — Vitalis" },
      { property: "og:title", content: "Instant — Vitalis" },
      {
        name: "description",
        content:
          "Découvrez les personnes présentes autour de vous et gérez vos mises en relation en temps réel.",
      },
      {
        property: "og:description",
        content:
          "Découvrez les personnes présentes autour de vous avec le moteur Instant de Vitalis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});
