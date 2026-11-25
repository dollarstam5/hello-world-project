import { createFileRoute } from "@tanstack/react-router";
import { ProfileManagementPage } from "@/modules/profile/ui/pages/ProfileManagementPage";

export const Route = createFileRoute("/espace/profil")({
  head: () => ({ meta: [{ title: "Mon profil — Vitalis" }] }),
  component: ProfileManagementPage,
});
