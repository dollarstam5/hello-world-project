import { createFileRoute } from "@tanstack/react-router";
import { ProfileManagementPage } from "@/components/experience/ProfileManagementPage";

export const Route = createFileRoute("/espace")({
  head: () => ({
    meta: [
      { title: "Mon profil — Vitalis" },
      {
        name: "description",
        content: "Consultez et gérez les informations de votre profil Vitalis.",
      },
    ],
  }),
  component: ProfileManagementPage,
});
