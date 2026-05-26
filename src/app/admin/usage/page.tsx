import { UsageClient } from "@/app/admin/usage/usage-client";
import { currentMonthKey, getBackofficeDb } from "@/lib/backoffice/db";
import { computeAccountElevenLabsUsage, verifiedMinutesUsed, verifiedUsagePercent } from "@/lib/backoffice/usage";
import { syncElevenLabsUsage } from "@/lib/elevenlabs-usage";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { redirect } from "next/navigation";

export default async function AdminUsagePage() {
  const session = await requireAdminSession();
  if (!session.ok) redirect("/login");

  const elevenLabsConfigured = Boolean(process.env.ELEVENLABS_API_KEY?.trim());
  let syncNote: string | null = null;

  if (elevenLabsConfigured) {
    const sync = await syncElevenLabsUsage();
    if (!sync.ok) {
      syncNote = sync.error;
    } else if (sync.warnings?.length) {
      syncNote = sync.warnings[0];
    }
  }

  const db = getBackofficeDb();
  const month = currentMonthKey();

  const [{ data, error }, { data: clients }] = await Promise.all([
    db
      .from("usage_logs")
      .select("*, clients ( business_name, overage_rate )")
      .eq("month", month)
      .order("elevenlabs_minutes", { ascending: false }),
    db.from("clients").select("status, included_minutes"),
  ]);

  const accountUsage = computeAccountElevenLabsUsage(data ?? [], clients ?? []);

  const rows = (data ?? []).map((u) => {
    const client = u.clients as { business_name: string; overage_rate: number } | null;
    const used = verifiedMinutesUsed(u);
    const pct = verifiedUsagePercent(u);
    return {
      id: u.id,
      client_id: u.client_id,
      client_name: client?.business_name ?? "Unknown",
      agent_id: u.elevenlabs_agent_id,
      minutes_used: used,
      included_minutes: u.included_minutes,
      usage_pct: pct,
      overage_minutes: used != null ? u.overage_minutes : null,
      overage_cost: used != null ? u.overage_cost : null,
      synced_at: u.elevenlabs_synced_at as string | null,
      warn: pct != null && pct >= 70,
    };
  });

  return (
    <UsageClient
      userEmail={session.user.email ?? ""}
      month={month}
      rows={rows}
      error={error?.message}
      syncNote={syncNote}
      elevenLabsConfigured={elevenLabsConfigured}
      accountUsage={accountUsage}
    />
  );
}
