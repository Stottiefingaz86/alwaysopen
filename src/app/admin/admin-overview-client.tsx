"use client";

import { ElevenLabsAccountUsageCard } from "@/components/admin/elevenlabs-account-usage";
import { AdminShell } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { formatEuro } from "@/lib/backoffice/format";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Stats = Awaited<ReturnType<typeof import("@/lib/backoffice/dashboard-stats").fetchDashboardStats>>;

export function AdminOverviewClient({
  userEmail,
  stats,
}: {
  userEmail: string;
  stats: Stats | null;
}) {
  const router = useRouter();
  const [migrating, setMigrating] = useState(false);
  const [migrateError, setMigrateError] = useState<string | null>(null);

  async function runMigration() {
    setMigrating(true);
    setMigrateError(null);
    try {
      const res = await fetch("/api/admin/backoffice/apply-migration", { method: "POST" });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setMigrateError(json.error ?? "Migration failed");
        return;
      }
      router.refresh();
    } catch {
      setMigrateError("Migration failed");
    } finally {
      setMigrating(false);
    }
  }

  if (stats?.tableMissing) {
    return (
      <AdminShell userEmail={userEmail} title="Overview">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          <p className="font-medium">Backoffice tables not found</p>
          <p className="mt-2">
            Run migration <code className="rounded bg-white px-1">20260522120000_backoffice.sql</code>{" "}
            in Supabase SQL editor, or apply from here if{" "}
            <code className="rounded bg-white px-1">SUPABASE_DB_URL</code> is set.
          </p>
          <Button type="button" className="mt-4" onClick={runMigration} disabled={migrating}>
            {migrating ? "Applying…" : "Apply backoffice migration"}
          </Button>
          {migrateError ? <p className="mt-3 text-google-red">{migrateError}</p> : null}
        </div>
      </AdminShell>
    );
  }

  const t = stats?.totals;

  const cards = [
    { label: "Total clients", value: t?.clients ?? 0 },
    { label: "Active clients", value: t?.active ?? 0 },
    { label: "Monthly recurring revenue", value: formatEuro(t?.mrr ?? 0) },
    { label: "Failed workflows", value: t?.failedWorkflows ?? 0, warn: (t?.failedWorkflows ?? 0) > 0 },
    { label: "Clients over 80% minutes", value: t?.highUsage ?? 0, warn: (t?.highUsage ?? 0) > 0 },
    { label: "Unpaid invoices", value: t?.unpaidInvoices ?? 0, warn: (t?.unpaidInvoices ?? 0) > 0 },
    { label: "Reports due", value: t?.reportsDue ?? 0 },
  ];

  const el = stats?.elevenLabsAccount;

  return (
    <AdminShell userEmail={userEmail} title="Overview">
      {el && el.poolMinutes > 0 ? (
        <div className="mb-6">
          <ElevenLabsAccountUsageCard month={stats?.month ?? ""} account={el} />
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-google-gray-200 bg-white p-5 shadow-google"
          >
            <p className="text-sm text-google-gray-500">{card.label}</p>
            <p className="mt-2 text-2xl font-medium text-foreground">{card.value}</p>
            {card.warn ? (
              <p className="mt-2 flex items-center gap-1 text-xs text-amber-700">
                <AlertTriangle className="size-3" />
                Needs attention
              </p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-google-gray-200 bg-white p-5 shadow-google">
          <h2 className="font-medium text-foreground">Recent workflow activity</h2>
          <ul className="mt-4 space-y-3">
            {(stats?.recentWorkflows ?? []).length === 0 ? (
              <li className="text-sm text-google-gray-500">No workflow runs yet.</li>
            ) : (
              stats?.recentWorkflows.map((w) => (
                <li
                  key={w.id}
                  className="flex items-center justify-between gap-2 border-b border-google-gray-100 pb-3 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{w.workflow_name}</p>
                    <p className="text-xs text-google-gray-500">{w.workflow_type}</p>
                  </div>
                  <StatusBadge status={w.health_status ?? w.status} />
                </li>
              ))
            )}
          </ul>
          <Link href="/admin/workflows" className="mt-4 inline-block text-sm text-google-blue hover:underline">
            View all workflows
          </Link>
        </section>

        <section className="rounded-2xl border border-google-gray-200 bg-white p-5 shadow-google">
          <h2 className="font-medium text-foreground">Recent bookings</h2>
          <ul className="mt-4 space-y-3">
            {(stats?.recentBookings ?? []).length === 0 ? (
              <li className="text-sm text-google-gray-500">No bookings logged yet.</li>
            ) : (
              stats?.recentBookings.map((b) => (
                <li key={b.id} className="text-sm">
                  <span className="font-medium">{b.customer_name ?? "Guest"}</span>
                  <span className="text-google-gray-500"> · {b.booking_type ?? "booking"}</span>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </AdminShell>
  );
}
