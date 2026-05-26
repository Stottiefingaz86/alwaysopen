/** n8n Cloud / self-hosted REST API (v1). */

import { n8nEditorUrl } from "@/lib/n8n-url";

export type N8nWorkflowSummary = {
  id: string;
  name: string;
  active: boolean;
  editorUrl: string;
};

export function getN8nConfig() {
  const base = process.env.N8N_API_BASE_URL?.trim().replace(/\/$/, "");
  const apiKey = process.env.N8N_API_KEY?.trim();
  return { base, apiKey, configured: Boolean(base && apiKey) };
}

export async function listN8nWorkflows(): Promise<{
  workflows: N8nWorkflowSummary[];
  error?: string;
}> {
  const { base, apiKey, configured } = getN8nConfig();
  if (!configured || !base || !apiKey) {
    return {
      workflows: [],
      error: "Set N8N_API_BASE_URL and N8N_API_KEY (n8n → Settings → API).",
    };
  }

  const res = await fetch(`${base}/api/v1/workflows`, {
    headers: { "X-N8N-API-KEY": apiKey, Accept: "application/json" },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return {
      workflows: [],
      error: `n8n API ${res.status}${text ? `: ${text.slice(0, 120)}` : ""}`,
    };
  }

  const json = (await res.json()) as { data?: unknown[] } | unknown[];
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
}
