"use client";

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
  minutes_used: number;
  included_minutes: number;
  usage_pct: number;
  overage_minutes: number;
  overage_cost: number;
  warn: boolean;
};

export function UsageClient({
  userEmail,
  month,
  rows,
  error,
  elevenLabsConfigured,
}: {
  userEmail: string;
  month: string;
  rows: Row[];
  error?: string;
  elevenLabsConfigured: boolean;
}) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  async function syncUsage() {
    setSyncing(true);
    setSyncError(null);
    try {
      const res = await fetch("/api/admin/backoffice/sync-elevenlabs", { method: "POST" });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setSyncError(json.error ?? "Sync failed");
        return;
      }
      router.refresh();
    } catch {
      setSyncError("Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <AdminShell userEmail={userEmail} title="Usage">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-google-gray-500">Month: {month}</p>
        <Button type="button" onClick={syncUsage} disabled={syncing || !elevenLabsConfigured}>
          {syncing ? "Syncing…" : "Sync ElevenLabs usage"}
        </Button>
      </div>
      {!elevenLabsConfigured ? (
        <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Add <code className="rounded bg-white px-1">ELEVENLABS_API_KEY</code> to .env.local and Vercel,
          then redeploy.
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
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-google-gray-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/clients/${r.client_id}`} className="text-google-blue hover:underline">
                    {r.client_name}
                  </Link>
                  {r.warn ? (
                    <StatusBadge status="warning" className="ml-2" />
                  ) : null}
                </td>
                <td className="px-4 py-3 font-mono text-xs">{r.agent_id ?? "—"}</td>
                <td className="px-4 py-3">{r.minutes_used}</td>
                <td className="px-4 py-3">{r.included_minutes}</td>
                <td className="px-4 py-3">{r.usage_pct}%</td>
                <td className="px-4 py-3">{r.overage_minutes}</td>
                <td className="px-4 py-3">{formatEuro(Number(r.overage_cost))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
