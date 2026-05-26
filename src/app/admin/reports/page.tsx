import { ReportsClient } from "@/app/admin/reports/reports-client";
import { getBackofficeDb } from "@/lib/backoffice/db";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { redirect } from "next/navigation";

export default async function AdminReportsPage() {
  const session = await requireAdminSession();
  if (!session.ok) redirect("/login");

  const db = getBackofficeDb();
  const { data, error } = await db
    .from("client_voc_reports")
    .select("*, clients ( business_name )")
    .order("created_at", { ascending: false });

  const rows = (data ?? []).map((r) => ({
    ...r,
    client_name: (r.clients as { business_name: string } | null)?.business_name ?? "Unknown",
  }));

  return <ReportsClient userEmail={session.user.email ?? ""} reports={rows} error={error?.message} />;
}
