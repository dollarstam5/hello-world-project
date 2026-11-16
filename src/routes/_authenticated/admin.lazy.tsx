import { createLazyFileRoute, Outlet } from "@tanstack/react-router";
import { AdminShell } from "@/domains/admin/ui/AdminShell";
import { AdminAccessGate } from "@/domains/admin/ui/AdminAccessGate";
import { useAdminViewer } from "@/domains/admin/hooks/useAdminData";

export const Route = createLazyFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const viewer = useAdminViewer();

  return (
    <AdminAccessGate
      loading={viewer.isPending}
      error={viewer.isError}
      allowed={viewer.data?.canOpenDashboard ?? false}
      onRetry={() => void viewer.refetch()}
    >
      <AdminShell role={viewer.data?.role ?? "member"}>
        <Outlet />
      </AdminShell>
    </AdminAccessGate>
  );
}
