import { createLazyFileRoute } from "@tanstack/react-router";
import { ScanPanel } from "@/modules/scan/ui/ScanPanel";

export const Route = createLazyFileRoute("/scan")({
  component: ScanRoute,
});

function ScanRoute() {
  return (
    <main className="page-shell stack-5">
      <ScanPanel />
    </main>
  );
}
