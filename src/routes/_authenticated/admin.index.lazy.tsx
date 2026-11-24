import { createLazyFileRoute } from "@tanstack/react-router";
import { moduleByKey } from "@eco/core-logic";
import { AdminOverviewView } from "@/modules/admin/ui/AdminOverviewView";
import { useAdminOverview } from "@/modules/admin/hooks/useAdminData";

export const Route = createLazyFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const overview = useAdminOverview();

  return (
    <AdminOverviewView
      module={moduleByKey("home")}
      overview={overview.data}
      loading={overview.isPending}
      error={overview.isError}
      onRetry={() => void overview.refetch()}
    />
  );
}
