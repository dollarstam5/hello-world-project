import { createFileRoute } from "@tanstack/react-router";
import { ProfileManagementPage } from "@/components/experience/ProfileManagementPage";

export const Route = createFileRoute("/espace/profil")({
  head: () => ({ meta: [{ title: "Mon profil — Vitalis" }] }),
  component: ProfileManagementPage,
});
