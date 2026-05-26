"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import type { N8nWorkflowHealthRow } from "@/lib/n8n-api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function WorkflowsClient({
  userEmail,
  workflows,
  n8nConfigured,
  n8nError,
  syncNote,
}: {
  userEmail: string;
  workflows: N8nWorkflowHealthRow[];
  n8nConfigured: boolean;
  n8nError?: string | null;
  syncNote?: string | null;
}) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);

  const linked = workflows.filter((w) => w.clientId);
  const unlinked = workflows.filter((w) => !w.clientId);

  async function refreshFromN8n() {
    setSyncing(true);
    try {
      const res = await fetch("/api/admin/backoffice/n8n/sync-health", { method: "POST" });
      if (!res.ok) {
        const json = (await res.json()) as { error?: string };
        throw new Error(json.error ?? "Sync failed");
      }
      router.refresh();
    } finally {
      setSyncing(false);
    }
  }

  function WorkflowTable({ rows, showClient }: { rows: N8nWorkflowHealthRow[]; showClient: boolean }) {
    return (
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-google-gray-50 text-xs uppercase text-google-gray-500">
          <tr>
            {showClient ? <th className="px-4 py-3">Client</th> : null}
            <th className="px-4 py-3">Workflow</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">MCP</th>
            <th className="px-4 py-3">Active</th>
            <th className="px-4 py-3">Last run</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Health</th>
            <th className="px-4 py-3">Success %</th>
            <th className="px-4 py-3">n8n</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((w) => (
            <tr key={w.workflowId} className="border-b border-google-gray-50">
              {showClient ? (
                <td className="px-4 py-3">
                  {w.clientId ? (
                    <Link
                      href={`/admin/clients/${w.clientId}`}
                      className="text-google-blue hover:underline"
                    >
                      {w.clientName}
                    </Link>
                  ) : (
                    "—"
                  )}
                </td>
              ) : null}
              <td className="px-4 py-3 font-medium">{w.workflowName}</td>
              <td className="px-4 py-3 capitalize">{w.workflowType ?? "—"}</td>
              <td className="px-4 py-3">
                <StatusBadge status={w.availableInMcp ? "active" : "paused"} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={w.active ? "active" : "paused"} />
              </td>
              <td className="px-4 py-3 text-google-gray-600">
                {w.lastRun ? new Date(w.lastRun).toLocaleString() : "—"}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={w.lastStatus} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={w.healthStatus} />
              </td>
              <td className="px-4 py-3">
                {w.successRate != null ? `${w.successRate}%` : "—"}
                {w.recentRuns > 0 ? (
                  <span className="ml-1 text-xs text-google-gray-500">({w.recentRuns})</span>
                ) : null}
              </td>
              <td className="px-4 py-3">
                <a
                  href={w.editorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-google-blue hover:underline"
                >
                  Open
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <AdminShell userEmail={userEmail} title="Workflows">
      <p className="mb-4 rounded-xl border border-google-blue/20 bg-google-blue/5 px-4 py-3 text-sm text-google-gray-800">
        Live data from your <strong>n8n MCP server</strong> (or REST API). Enable{" "}
        <strong>MCP access</strong> on each workflow in n8n for execution history. Link workflows on
        each client&apos;s <strong>Integrations</strong> tab.
      </p>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-google-gray-500">
          {workflows.length} workflow(s) · {linked.length} linked to clients
        </p>
        <Button type="button" onClick={refreshFromN8n} disabled={syncing || !n8nConfigured}>
          {syncing ? "Refreshing…" : "Refresh from n8n"}
        </Button>
      </div>

      {!n8nConfigured ? (
        <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Add <code className="rounded bg-white px-1">N8N_MCP_URL</code> and{" "}
          <code className="rounded bg-white px-1">N8N_MCP_TOKEN</code> to Vercel (n8n → Settings → MCP).
          Optional: <code className="rounded bg-white px-1">N8N_API_KEY</code> for REST execution sync.
        </p>
      ) : null}
      {syncNote ? (
        <p className="mb-4 text-sm text-google-gray-600">{syncNote}</p>
      ) : null}
      {n8nError ? <p className="mb-4 text-sm text-google-red">{n8nError}</p> : null}

      {workflows.length === 0 ? (
        <p className="rounded-2xl border border-google-gray-200 bg-white p-6 text-sm text-google-gray-500">
          {n8nConfigured
            ? "No workflows returned from n8n."
            : "Configure n8n API keys to load workflows."}
        </p>
      ) : (
        <div className="space-y-8">
          {linked.length > 0 ? (
            <section>
              <h2 className="mb-3 text-sm font-medium text-foreground">Client workflows</h2>
              <div className="overflow-hidden rounded-2xl border border-google-gray-200 bg-white shadow-google">
                <WorkflowTable rows={linked} showClient />
              </div>
            </section>
          ) : null}

          {unlinked.length > 0 ? (
            <section>
              <h2 className="mb-3 text-sm font-medium text-foreground">
                Other n8n workflows (not linked to a client)
              </h2>
              <div className="overflow-hidden rounded-2xl border border-google-gray-200 bg-white shadow-google">
                <WorkflowTable rows={unlinked} showClient={false} />
              </div>
            </section>
          ) : null}
        </div>
      )}

      {workflows.some((w) => w.errorMessage) ? (
        <div className="mt-4 rounded-xl border border-google-red/20 bg-google-red/5 p-4 text-sm">
          {workflows
            .filter((w) => w.errorMessage)
            .slice(0, 5)
            .map((w) => (
              <p key={w.workflowId} className="mt-1">
                <strong>{w.workflowName}:</strong> {w.errorMessage}
              </p>
            ))}
        </div>
      ) : null}
    </AdminShell>
  );
}
