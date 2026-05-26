/** n8n Cloud / self-hosted REST API (v1). */

import { getBackofficeDb } from "@/lib/backoffice/db";
import { linksFromIntegration, type N8nClientWorkflowLink } from "@/lib/n8n-client-links";
import { mcpSearchExecutions, mcpSearchWorkflows } from "@/lib/n8n-mcp";
import { n8nEditorUrl } from "@/lib/n8n-url";

export type N8nWorkflowSummary = {
  id: string;
  name: string;
  active: boolean;
  editorUrl: string;
  availableInMcp?: boolean;
};

export type N8nExecutionSummary = {
  id: string;
  workflowId: string;
  status: string;
  startedAt: string;
  stoppedAt: string | null;
  finished: boolean;
};

export type N8nWorkflowHealthRow = {
  workflowId: string;
  workflowName: string;
  active: boolean;
  editorUrl: string;
  clientId: string | null;
  clientName: string | null;
  workflowType: string | null;
  lastRun: string | null;
  lastStatus: string | null;
  healthStatus: string;
  successRate: number | null;
  recentRuns: number;
  errorMessage: string | null;
  availableInMcp: boolean;
  source: "n8n";
};

function inferN8nInstanceBase() {
  const explicit = process.env.N8N_API_BASE_URL?.trim().replace(/\/$/, "");
  if (explicit) return explicit;
  const mcp = process.env.N8N_MCP_URL?.trim();
  if (mcp) return mcp.replace(/\/mcp-server\/http\/?$/i, "");
  return "";
}

export function getN8nConfig() {
  const base = inferN8nInstanceBase();
  const apiKey = process.env.N8N_API_KEY?.trim();
  const mcpUrl =
    process.env.N8N_MCP_URL?.trim() ||
    (base ? `${base}/mcp-server/http` : "");
  const mcpToken = process.env.N8N_MCP_TOKEN?.trim();
  const restConfigured = Boolean(base && apiKey);
  const mcpConfigured = Boolean(mcpUrl && mcpToken);
  return {
    base,
    apiKey,
    mcpUrl,
    mcpToken,
    restConfigured,
    mcpConfigured,
    configured: restConfigured || mcpConfigured,
  };
}

async function n8nFetch(path: string, init?: RequestInit) {
  const { base, apiKey, configured } = getN8nConfig();
  if (!configured || !base || !apiKey) {
    throw new Error("Set N8N_API_BASE_URL and N8N_API_KEY (n8n → Settings → API).");
  }

  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      "X-N8N-API-KEY": apiKey,
      Accept: "application/json",
      ...init?.headers,
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`n8n API ${res.status}${text ? `: ${text.slice(0, 160)}` : ""}`);
  }

  return res.json();
}

export async function listN8nWorkflows(): Promise<{
  workflows: N8nWorkflowSummary[];
  error?: string;
}> {
  const { base, restConfigured, mcpConfigured } = getN8nConfig();
  if (!restConfigured && !mcpConfigured) {
    return {
      workflows: [],
      error: "Set N8N_MCP_TOKEN or N8N_API_BASE_URL + N8N_API_KEY.",
    };
  }

  try {
    if (mcpConfigured && base) {
      const { data } = await mcpSearchWorkflows(200);
      const workflows = data.map((row) => ({
        id: row.id,
        name: row.name ?? "Untitled",
        active: Boolean(row.active),
        editorUrl: n8nEditorUrl(base, row.id),
        availableInMcp: row.availableInMCP,
      }));
      workflows.sort((a, b) => a.name.localeCompare(b.name));
      return { workflows };
    }

    if (!restConfigured || !base) {
      return { workflows: [], error: "MCP workflow list failed; REST API not configured." };
    }

    const json = (await n8nFetch("/api/v1/workflows")) as { data?: unknown[] } | unknown[];
    const list = Array.isArray(json) ? json : (json.data ?? []);

    const workflows: N8nWorkflowSummary[] = [];
    for (const item of list) {
      if (!item || typeof item !== "object") continue;
      const row = item as Record<string, unknown>;
      const id = String(row.id ?? "").trim();
      const name = String(row.name ?? "Untitled").trim();
      if (!id) continue;
      workflows.push({
        id,
        name,
        active: Boolean(row.active),
        editorUrl: n8nEditorUrl(base, id),
      });
    }

    workflows.sort((a, b) => a.name.localeCompare(b.name));
    return { workflows };
  } catch (err) {
    return {
      workflows: [],
      error: err instanceof Error ? err.message : "n8n request failed",
    };
  }
}

async function listN8nExecutionsViaMcp(workflows: N8nWorkflowSummary[]) {
  const all: N8nExecutionSummary[] = [];
  for (const wf of workflows) {
    if (!wf.availableInMcp) continue;
    try {
      const { data } = await mcpSearchExecutions({ workflowId: wf.id, limit: 20 });
      for (const ex of data) {
        all.push({
          id: ex.id,
          workflowId: ex.workflowId,
          status: ex.status,
          startedAt: ex.startedAt ?? "",
          stoppedAt: ex.stoppedAt,
          finished: ex.stoppedAt != null,
        });
      }
    } catch {
      /* skip workflow */
    }
  }
  return all.sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );
}

export async function listN8nExecutions(limit = 100): Promise<N8nExecutionSummary[]> {
  const { restConfigured } = getN8nConfig();
  if (!restConfigured) return [];

  const json = (await n8nFetch(`/api/v1/executions?limit=${limit}`)) as {
    data?: unknown[];
  } | unknown[];
  const list = Array.isArray(json) ? json : ((json as { data?: unknown[] }).data ?? []);

  const executions: N8nExecutionSummary[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const workflowId = String(row.workflowId ?? "").trim();
    if (!workflowId) continue;
    executions.push({
      id: String(row.id ?? ""),
      workflowId,
      status: String(row.status ?? "unknown"),
      startedAt: String(row.startedAt ?? ""),
      stoppedAt: row.stoppedAt != null ? String(row.stoppedAt) : null,
      finished: Boolean(row.finished),
    });
  }

  return executions.sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );
}

export function executionToHealthStatus(status: string): string {
  const s = status.toLowerCase();
  if (s === "success") return "healthy";
  if (s === "error" || s === "crashed" || s === "canceled") return "failed";
  if (s === "running" || s === "waiting" || s === "new") return "warning";
  return "unknown";
}

function computeWorkflowHealth(executions: N8nExecutionSummary[]) {
  if (executions.length === 0) {
    return {
      lastRun: null as string | null,
      lastStatus: null as string | null,
      healthStatus: "unknown",
      successRate: null as number | null,
      errorMessage: null as string | null,
    };
  }

  const latest = executions[0];
  const finished = executions.filter((e) =>
    ["success", "error", "crashed", "canceled"].includes(e.status.toLowerCase())
  );
  const successes = finished.filter((e) => e.status.toLowerCase() === "success").length;
  const successRate =
    finished.length > 0 ? Math.round((successes / finished.length) * 100) : null;

  const lastFailure = executions.find((e) =>
    ["error", "crashed", "canceled"].includes(e.status.toLowerCase())
  );

  return {
    lastRun: latest.startedAt || null,
    lastStatus: latest.status,
    healthStatus: executionToHealthStatus(latest.status),
    successRate,
    errorMessage: lastFailure
      ? `Last failure: ${lastFailure.status} at ${new Date(lastFailure.startedAt).toLocaleString()}`
      : null,
  };
}

export async function loadClientWorkflowLinks(): Promise<Map<string, N8nClientWorkflowLink>> {
  const db = getBackofficeDb();
  const { data: clients } = await db
    .from("clients")
    .select("id, business_name, client_integrations ( n8n_booking_workflow_url, n8n_cancel_workflow_url, n8n_voc_workflow_url )");

  const byWorkflowId = new Map<string, N8nClientWorkflowLink>();
  for (const client of clients ?? []) {
    const integration = Array.isArray(client.client_integrations)
      ? client.client_integrations[0]
      : client.client_integrations;
    for (const link of linksFromIntegration(
      client.id,
      client.business_name,
      integration as Parameters<typeof linksFromIntegration>[2]
    )) {
      byWorkflowId.set(link.workflowId, link);
    }
  }
  return byWorkflowId;
}

export async function getN8nWorkflowHealthOverview(): Promise<{
  rows: N8nWorkflowHealthRow[];
  error?: string;
}> {
  const { workflows, error: listError } = await listN8nWorkflows();
  if (listError) return { rows: [], error: listError };
  if (workflows.length === 0) return { rows: [] };

  let executions: N8nExecutionSummary[] = [];
  const { restConfigured, mcpConfigured } = getN8nConfig();
  try {
    if (restConfigured) {
      executions = await listN8nExecutions(100);
    } else if (mcpConfigured) {
      executions = await listN8nExecutionsViaMcp(workflows);
    }
  } catch (err) {
    return {
      rows: [],
      error: err instanceof Error ? err.message : "Could not load n8n executions",
    };
  }

  const byWorkflowId = new Map<string, N8nExecutionSummary[]>();
  for (const ex of executions) {
    const list = byWorkflowId.get(ex.workflowId) ?? [];
    list.push(ex);
    byWorkflowId.set(ex.workflowId, list);
  }

  const clientLinks = await loadClientWorkflowLinks();

  const rows: N8nWorkflowHealthRow[] = workflows.map((wf) => {
    const wfExecutions = byWorkflowId.get(wf.id) ?? [];
    const health = computeWorkflowHealth(wfExecutions);
    const link = clientLinks.get(wf.id);
    const availableInMcp = wf.availableInMcp ?? false;
    let errorMessage = health.errorMessage;
    if (wfExecutions.length === 0 && !availableInMcp && mcpConfigured && !restConfigured) {
      errorMessage =
        "Enable MCP access in this workflow’s n8n settings to show execution health.";
    }

    return {
      workflowId: wf.id,
      workflowName: wf.name,
      active: wf.active,
      editorUrl: wf.editorUrl,
      clientId: link?.clientId ?? null,
      clientName: link?.clientName ?? null,
      workflowType: link?.workflowType ?? null,
      lastRun: health.lastRun,
      lastStatus: health.lastStatus,
      healthStatus: health.healthStatus,
      successRate: health.successRate,
      recentRuns: wfExecutions.length,
      errorMessage,
      availableInMcp,
      source: "n8n" as const,
    };
  });

  rows.sort((a, b) => {
    if (a.clientName && !b.clientName) return -1;
    if (!a.clientName && b.clientName) return 1;
    return a.workflowName.localeCompare(b.workflowName);
  });

  return { rows };
}

/** Upsert workflow_health for client-linked workflows from live n8n execution data. */
export async function syncN8nWorkflowHealthToDb() {
  const { rows, error } = await getN8nWorkflowHealthOverview();
  if (error) return { ok: false as const, error };
  if (rows.length === 0) return { ok: true as const, synced: 0 };

  const db = getBackofficeDb();
  const now = new Date().toISOString();
  let synced = 0;

  for (const row of rows) {
    if (!row.clientId) continue;

    const dbRow = {
      client_id: row.clientId,
      workflow_name: row.workflowName,
      workflow_type: row.workflowType,
      workflow_url: row.editorUrl,
      last_run: row.lastRun,
      status: row.lastStatus,
      error_message: row.errorMessage,
      health_status: row.healthStatus,
      updated_at: now,
    };

    const { data: existing } = await db
      .from("workflow_health")
      .select("id")
      .eq("client_id", row.clientId)
      .eq("workflow_name", row.workflowName)
      .maybeSingle();

    if (existing?.id) {
      await db.from("workflow_health").update(dbRow).eq("id", existing.id);
    } else {
      await db.from("workflow_health").insert(dbRow);
    }
    synced++;
  }

  return { ok: true as const, synced, total: rows.length };
}
