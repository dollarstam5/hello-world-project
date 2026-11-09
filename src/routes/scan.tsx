import { createFileRoute } from "@tanstack/react-router";
import { ScanSpace } from "@/domains/scan";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan — Vitalis" },
      { name: "description", content: "Repère les Flash actifs autour de toi." },
    ],
  }),
  component: ScanSpace,
});
