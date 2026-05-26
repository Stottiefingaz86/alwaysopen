"use client";

import {
  ElevenLabsAccountUsageCard,
  type ElevenLabsAccountUsage,
} from "@/components/admin/elevenlabs-account-usage";
import { AdminShell } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { formatEuro } from "@/lib/backoffice/format";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Row = {
  id: string;
  client_id: string;
  client_name: string;
  agent_id: string | null;
  minutes_used: number | null;
  included_minutes: number;
  usage_pct: number | null;
  overage_minutes: number | null;
  overage_cost: number | null;
  synced_at: string | null;
  warn: boolean;
};

export function UsageClient({
  userEmail,
  month,
  rows,
  error,
  syncNote,
  elevenLabsConfigured,
  accountUsage,
}: {
  userEmail: string;
  month: string;
  rows: Row[];
  error?: string;
  syncNote?: string | null;
  elevenLabsConfigured: boolean;
  accountUsage: ElevenLabsAccountUsage;
}) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  async function syncUsage() {
    setSyncing(true);
    setSyncError(null);
    try {
      const res = await fetch("/api/admin/backoffice/sync-elevenlabs", { method: "POST" });
      const json = (await res.json()) as { error?: string; warnings?: string[] };
      if (!res.ok) {
        setSyncError(json.error ?? "Sync failed");
        return;
      }
      if (json.warnings?.[0]) setSyncError(json.warnings[0]);
      router.refresh();
    } catch {
      setSyncError("Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <AdminShell userEmail={userEmail} title="Usage">
      {accountUsage.poolMinutes > 0 ? (
        <div className="mb-6">
          <ElevenLabsAccountUsageCard month={month} account={accountUsage} compact />
        </div>
      ) : null}

      <p className="mb-4 rounded-xl border border-google-blue/20 bg-google-blue/5 px-4 py-3 text-sm text-google-gray-800">
        <strong>Account total</strong> (above) is all agents on your ElevenLabs login. Each row below
        is that client&apos;s own allowance (e.g. 500 min) vs their agent usage.
      </p>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-google-gray-500">Month: {month}</p>
        <Button type="button" onClick={syncUsage} disabled={syncing || !elevenLabsConfigured}>
          {syncing ? "Syncing…" : "Refresh from ElevenLabs"}
        </Button>
      </div>
      {!elevenLabsConfigured ? (
        <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Add <code className="rounded bg-white px-1">ELEVENLABS_API_KEY</code> to .env.local and
          Vercel. Without it, usage cannot be loaded.
        </p>
      ) : null}
      {syncNote ? (
        <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {syncNote}
        </p>
      ) : null}
      {syncError ? <p className="mb-4 text-sm text-google-red">{syncError}</p> : null}
      {error ? <p className="mb-4 text-sm text-google-red">{error}</p> : null}

      <div className="overflow-hidden rounded-2xl border border-google-gray-200 bg-white shadow-google">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-google-gray-50 text-xs uppercase text-google-gray-500">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Agent ID</th>
              <th className="px-4 py-3">Minutes</th>
              <th className="px-4 py-3">Included</th>
              <th className="px-4 py-3">Usage %</th>
              <th className="px-4 py-3">Overage</th>
              <th className="px-4 py-3">Est. cost</th>
              <th className="px-4 py-3">Last sync</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-google-gray-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/clients/${r.client_id}`}
                    className="text-google-blue hover:underline"
                  >
                    {r.client_name}
                  </Link>
                  {r.warn ? <StatusBadge status="warning" className="ml-2" /> : null}
                </td>
                <td className="px-4 py-3 font-mono text-xs">{r.agent_id ?? "—"}</td>
                <td className="px-4 py-3">
                  {r.minutes_used != null ? r.minutes_used : (
                    <span className="text-google-gray-500">Not synced</span>
                  )}
                </td>
                <td className="px-4 py-3">{r.included_minutes}</td>
                <td className="px-4 py-3">
                  {r.usage_pct != null ? `${r.usage_pct}%` : "—"}
                </td>
                <td className="px-4 py-3">
                  {r.overage_minutes != null ? r.overage_minutes : "—"}
                </td>
                <td className="px-4 py-3">
                  {r.overage_cost != null ? formatEuro(Number(r.overage_cost)) : "—"}
                </td>
                <td className="px-4 py-3 text-xs text-google-gray-600">
                  {r.synced_at ? new Date(r.synced_at).toLocaleString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
