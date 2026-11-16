import { createFileRoute, notFound } from "@tanstack/react-router";
import { MANAGEMENT_MODULES } from "@eco/core-contracts";

export const Route = createFileRoute("/_authenticated/admin/$module")({
  beforeLoad: ({ params }) => {
    if (!(MANAGEMENT_MODULES as readonly string[]).includes(params.module)) throw notFound();
  },
});
