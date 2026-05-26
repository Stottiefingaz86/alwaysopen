import { ClientsListClient } from "@/app/admin/clients/clients-list-client";
import { currentMonthKey, getBackofficeDb } from "@/lib/backoffice/db";
import { usagePercent } from "@/lib/backoffice/format";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { redirect } from "next/navigation";

export default async function AdminClientsPage() {
  const session = await requireAdminSession();
  if (!session.ok) redirect("/login");

  const db = getBackofficeDb();
  const month = currentMonthKey();

  const { data: clients, error } = await db
    .from("clients")
    .select(
      `
      *,
      client_integrations ( elevenlabs_agent_id ),
      usage_logs ( month, elevenlabs_minutes, included_minutes ),
      workflow_health ( health_status, status, updated_at )
    `
    )
    .order("business_name");

  const rows = (clients ?? []).map((c) => {
    const usage = (c.usage_logs as { month: string; elevenlabs_minutes: number; included_minutes: number }[])?.find(
      (u) => u.month === month
    );
    const workflows = (c.workflow_health as { health_status: string | null; status: string | null }[]) ?? [];
    const lastWf = workflows[0];
    const used = usage?.elevenlabs_minutes ?? 0;
    const included = usage?.included_minutes ?? c.included_minutes ?? 0;

    return {
      id: c.id,
      business_name: c.business_name,
      business_type: c.business_type,
      package_name: c.package_name,
      monthly_fee: c.monthly_fee,
      status: c.status,
      payment_status: c.payment_status,
      minutes_used: used,
      included_minutes: included,
      usage_pct: usagePercent(used, included),
      last_workflow_status: lastWf?.health_status ?? lastWf?.status ?? "—",
    };
  });

  return (
    <ClientsListClient
      userEmail={session.user.email ?? ""}
      clients={rows}
      error={error?.message}
    />
  );
}
