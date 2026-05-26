import { currentMonthKey, getBackofficeDb } from "@/lib/backoffice/db";
import { verifiedUsagePercent } from "@/lib/backoffice/usage";
import type { ClientBooking, UsageLog, WorkflowHealth } from "@/lib/backoffice/types";

export async function fetchDashboardStats() {
  const db = getBackofficeDb();
  const month = currentMonthKey();

  const [
    clientsRes,
    usageRes,
    workflowsRes,
    paymentsRes,
    bookingsRes,
    reportsRes,
  ] = await Promise.all([
    db.from("clients").select("id, status, monthly_fee, payment_status"),
    db.from("usage_logs").select("*").eq("month", month),
    db
      .from("workflow_health")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(20),
    db.from("client_payments").select("*").order("created_at", { ascending: false }),
    db
      .from("client_bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8),
    db.from("client_voc_reports").select("id, client_id, month, status"),
  ]);

  const clients = clientsRes.data ?? [];
  const usage = (usageRes.data ?? []) as UsageLog[];
  const workflows = (workflowsRes.data ?? []) as WorkflowHealth[];
  const payments = paymentsRes.data ?? [];
  const bookings = (bookingsRes.data ?? []) as ClientBooking[];
  const reports = reportsRes.data ?? [];

  const activeClients = clients.filter((c) => c.status === "active");
  const mrr = activeClients.reduce((sum, c) => sum + Number(c.monthly_fee ?? 0), 0);
  const failedWorkflows = workflows.filter(
    (w) => w.health_status === "failed" || w.status === "failed"
  ).length;
  const highUsage = usage.filter((u) => {
    const pct = verifiedUsagePercent(u);
    return pct != null && pct >= 80;
  });
  const unpaid = payments.filter((p) => p.status === "unpaid" || p.status === "overdue");
  const reportsDue = reports.filter((r) => r.status !== "sent" && r.status !== "ready").length;

  return {
    month,
    totals: {
      clients: clients.length,
      active: activeClients.length,
      mrr,
      failedWorkflows,
      highUsage: highUsage.length,
      unpaidInvoices: unpaid.length,
      reportsDue,
    },
    recentWorkflows: workflows.slice(0, 8),
    recentBookings: bookings,
    usageWarnings: highUsage,
    paymentWarnings: unpaid.slice(0, 5),
    tableMissing:
      clientsRes.error?.message?.includes("does not exist") ||
      clientsRes.error?.message?.includes("schema cache"),
  };
}
