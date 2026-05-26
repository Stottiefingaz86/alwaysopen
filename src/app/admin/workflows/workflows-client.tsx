"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/admin/status-badge";
import Link from "next/link";

type Row = {
  id: string;
  client_id: string;
  client_name: string;
  workflow_name: string;
  workflow_type: string | null;
  workflow_url: string | null;
  last_run: string | null;
  status: string | null;
  error_message: string | null;
  health_status: string | null;
};

export function WorkflowsClient({
  userEmail,
  workflows,
  error,
}: {
  userEmail: string;
  workflows: Row[];
  error?: string;
}) {
  return (
    <AdminShell userEmail={userEmail} title="Workflows">
      {error ? <p className="mb-4 text-sm text-google-red">{error}</p> : null}
      <div className="overflow-hidden rounded-2xl border border-google-gray-200 bg-white shadow-google">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-google-gray-50 text-xs uppercase text-google-gray-500">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Workflow</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Last run</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Health</th>
              <th className="px-4 py-3">n8n</th>
            </tr>
          </thead>
          <tbody>
            {workflows.map((w) => (
              <tr key={w.id} className="border-b border-google-gray-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/clients/${w.client_id}`} className="text-google-blue hover:underline">
                    {w.client_name}
                  </Link>
                </td>
                <td className="px-4 py-3 font-medium">{w.workflow_name}</td>
                <td className="px-4 py-3">{w.workflow_type ?? "—"}</td>
                <td className="px-4 py-3 text-google-gray-600">
                  {w.last_run ? new Date(w.last_run).toLocaleString() : "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={w.status} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={w.health_status} />
                </td>
                <td className="px-4 py-3">
                  {w.workflow_url ? (
                    <a href={w.workflow_url} target="_blank" rel="noopener noreferrer" className="text-google-blue hover:underline">
                      Open
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {workflows.length === 0 ? (
          <p className="p-6 text-sm text-google-gray-500">No workflow runs logged yet.</p>
        ) : null}
      </div>
      {workflows.some((w) => w.error_message) ? (
        <div className="mt-4 rounded-xl border border-google-red/20 bg-google-red/5 p-4 text-sm">
          {workflows
            .filter((w) => w.error_message)
            .slice(0, 3)
            .map((w) => (
              <p key={w.id} className="mt-1">
                <strong>{w.workflow_name}:</strong> {w.error_message}
              </p>
            ))}
        </div>
      ) : null}
    </AdminShell>
  );
}
