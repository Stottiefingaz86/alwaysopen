"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatEuro } from "@/lib/backoffice/format";
import Link from "next/link";
import { useMemo, useState } from "react";

type ClientRow = {
  id: string;
  business_name: string;
  business_type: string | null;
  package_name: string | null;
  monthly_fee: number;
  status: string;
  payment_status: string | null;
  minutes_used: number;
  included_minutes: number;
  usage_pct: number;
  last_workflow_status: string;
};

export function ClientsListClient({
  userEmail,
  clients,
  error,
}: {
  userEmail: string;
  clients: ClientRow[];
  error?: string;
}) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      if (status !== "all" && c.status !== status) return false;
      const hay = `${c.business_name} ${c.business_type} ${c.package_name}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [clients, q, status]);

  return (
    <AdminShell userEmail={userEmail} title="Clients">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Search clients…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full max-w-sm rounded-xl border border-google-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-google-blue focus:ring-2 focus:ring-google-blue/20"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-google-gray-200 bg-white px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="prospect">Prospect</option>
        </select>
      </div>

      {error ? (
        <p className="rounded-xl border border-google-red/20 bg-google-red/5 p-4 text-sm text-google-red">
          {error}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-google-gray-200 bg-white shadow-google">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-google-gray-100 bg-google-gray-50 text-xs uppercase tracking-wide text-google-gray-500">
            <tr>
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Package</th>
              <th className="px-4 py-3">MRR</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Usage</th>
              <th className="px-4 py-3">Workflow</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-google-gray-50 hover:bg-google-gray-50/50">
                <td className="px-4 py-3 font-medium">{c.business_name}</td>
                <td className="px-4 py-3 text-google-gray-600">{c.business_type ?? "—"}</td>
                <td className="px-4 py-3 text-google-gray-600">{c.package_name ?? "—"}</td>
                <td className="px-4 py-3">{formatEuro(Number(c.monthly_fee))}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.payment_status} />
                </td>
                <td className="px-4 py-3">
                  {c.minutes_used}/{c.included_minutes} min ({c.usage_pct}%)
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.last_workflow_status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/clients/${c.id}`}
                    className="text-google-blue hover:underline"
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
