import { UsageClient } from "@/app/admin/usage/usage-client";
import { currentMonthKey, getBackofficeDb } from "@/lib/backoffice/db";
import { usagePercent } from "@/lib/backoffice/format";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { redirect } from "next/navigation";

export default async function AdminUsagePage() {
  const session = await requireAdminSession();
  if (!session.ok) redirect("/login");

  const db = getBackofficeDb();
  const month = currentMonthKey();

  const { data, error } = await db
    .from("usage_logs")
    .select("*, clients ( business_name, overage_rate )")
    .eq("month", month)
    .order("elevenlabs_minutes", { ascending: false });

  const rows = (data ?? []).map((u) => {
    const client = u.clients as { business_name: string; overage_rate: number } | null;
    const pct = usagePercent(u.elevenlabs_minutes, u.included_minutes);
    return {
      id: u.id,
      client_id: u.client_id,
      client_name: client?.business_name ?? "Unknown",
      agent_id: u.elevenlabs_agent_id,
      minutes_used: u.elevenlabs_minutes,
      included_minutes: u.included_minutes,
      usage_pct: pct,
      overage_minutes: u.overage_minutes,
      overage_cost: u.overage_cost,
      warn: pct >= 80,
    };
  });

  return (
    <UsageClient
      userEmail={session.user.email ?? ""}
      month={month}
      rows={rows}
      error={error?.message}
      elevenLabsConfigured={Boolean(process.env.ELEVENLABS_API_KEY?.trim())}
    />
  );
}
