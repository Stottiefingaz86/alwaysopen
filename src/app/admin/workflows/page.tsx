import { WorkflowsClient } from "@/app/admin/workflows/workflows-client";
import { getBackofficeDb } from "@/lib/backoffice/db";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { redirect } from "next/navigation";

export default async function AdminWorkflowsPage() {
  const session = await requireAdminSession();
  if (!session.ok) redirect("/login");

  const db = getBackofficeDb();
  const { data, error } = await db
    .from("workflow_health")
    .select("*, clients ( business_name )")
    .order("updated_at", { ascending: false });

  const rows = (data ?? []).map((w) => ({
    ...w,
    client_name:
      (w.clients as { business_name: string } | null)?.business_name ?? "Unknown",
  }));

  return (
    <WorkflowsClient userEmail={session.user.email ?? ""} workflows={rows} error={error?.message} />
  );
}
