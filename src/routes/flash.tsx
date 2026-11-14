import { createFileRoute } from "@tanstack/react-router";
import { FlashExperienceScreen } from "@/domains/flash/ui/FlashExperienceScreen";

export const Route = createFileRoute("/flash")({
  head: () => ({
    meta: [
      { title: "Flash — Vitalis" },
      {
        name: "description",
        content: "Exprimez un besoin ou une proposition et découvrez les Flash utiles.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FlashExperienceScreen,
});
