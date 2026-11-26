import { createFileRoute } from "@tanstack/react-router";
import { AccountInformationPage } from "@/modules/auth";

export const Route = createFileRoute("/espace/informations")({
  head: () => ({ meta: [{ title: "Mes informations — Vitalis" }] }),
  component: AccountInformationPage,
});
