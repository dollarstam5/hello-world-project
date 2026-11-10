import { createFileRoute } from "@tanstack/react-router";
import { PersonalDashboard } from "@/components/experience/PersonalDashboard";

export const Route = createFileRoute("/espace")({
  head: () => ({
    meta: [
      { title: "Mon espace — Vitalis" },
      { name: "description", content: "Retrouvez vos informations et les réglages de Vitalis." },
    ],
  }),
  component: PersonalDashboard,
});
