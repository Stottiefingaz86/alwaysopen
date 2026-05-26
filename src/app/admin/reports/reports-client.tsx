"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/admin/status-badge";
import Link from "next/link";

type Row = {
  id: string;
  client_id: string;
  client_name: string;
  month: string;
  status: string;
  public_url: string | null;
  sent_at: string | null;
};

export function ReportsClient({
  userEmail,
  reports,
  error,
}: {
  userEmail: string;
  reports: Row[];
  error?: string;
}) {
  return (
    <AdminShell userEmail={userEmail} title="VoC reports">
      {error ? <p className="mb-4 text-sm text-google-red">{error}</p> : null}
      <div className="overflow-hidden rounded-2xl border border-google-gray-200 bg-white shadow-google">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-google-gray-50 text-xs uppercase text-google-gray-500">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Month</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Public URL</th>
              <th className="px-4 py-3">Sent</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} className="border-b border-google-gray-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/clients/${r.client_id}`} className="text-google-blue hover:underline">
                    {r.client_name}
                  </Link>
                </td>
                <td className="px-4 py-3">{r.month}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-3">
                  {r.public_url ? (
                    <a href={r.public_url} target="_blank" rel="noopener noreferrer" className="text-google-blue hover:underline">
                      View
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 text-google-gray-600">
                  {r.sent_at ? new Date(r.sent_at).toLocaleDateString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
