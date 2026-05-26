import { AdminOverviewClient } from "@/app/admin/admin-overview-client";
import { fetchDashboardStats } from "@/lib/backoffice/dashboard-stats";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { redirect } from "next/navigation";

export default async function AdminOverviewPage() {
  const session = await requireAdminSession();
  if (!session.ok) redirect("/login");

  let stats;
  try {
    stats = await fetchDashboardStats();
  } catch {
    stats = null;
  }

  return (
    <AdminOverviewClient
      userEmail={session.user.email ?? ""}
      stats={stats}
    />
  );
}
