/** n8n instance MCP server (JSON-RPC over HTTP + SSE). */

type JsonRpcResponse = {
  jsonrpc?: string;
  id?: number;
  result?: {
    content?: { type: string; text?: string }[];
    structuredContent?: unknown;
    isError?: boolean;
  };
  error?: { code: number; message: string };
};

function getMcpConfig() {
  const url =
    process.env.N8N_MCP_URL?.trim() ||
    (process.env.N8N_API_BASE_URL?.trim()
      ? `${process.env.N8N_API_BASE_URL.replace(/\/$/, "")}/mcp-server/http`
      : "");
  const token = process.env.N8N_MCP_TOKEN?.trim();
  return { url, token, configured: Boolean(url && token) };
}

function parseSseJsonRpc(body: string): JsonRpcResponse | null {
  for (const line of body.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) continue;
    const payload = trimmed.slice(5).trim();
    if (!payload || payload === "[DONE]") continue;
    try {
      return JSON.parse(payload) as JsonRpcResponse;
    } catch {
      continue;
    }
  }
  return null;
}

let rpcId = 0;

export async function n8nMcpCallTool<T>(toolName: string, args: Record<string, unknown> = {}): Promise<T> {
  const { url, token, configured } = getMcpConfig();
  if (!configured || !url || !token) {
    throw new Error("Set N8N_MCP_URL and N8N_MCP_TOKEN (n8n → Settings → MCP).");
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: ++rpcId,
      method: "tools/call",
      params: { name: toolName, arguments: args },
    }),
    cache: "no-store",
  });

  const body = await res.text();
  if (!res.ok) {
    throw new Error(`n8n MCP HTTP ${res.status}: ${body.slice(0, 200)}`);
  }

  const parsed = parseSseJsonRpc(body);
  if (parsed?.error) {
    throw new Error(parsed.error.message || "n8n MCP error");
  }

  const result = parsed?.result;
  if (!result) {
    throw new Error("Empty n8n MCP response");
  }

  if (result.structuredContent != null) {
    return result.structuredContent as T;
  }

  const text = result.content?.find((c) => c.type === "text")?.text;
  if (text) {
    return JSON.parse(text) as T;
  }

  throw new Error("n8n MCP returned no structured content");
}

export function isN8nMcpConfigured() {
  return getMcpConfig().configured;
}

export type McpWorkflowRow = {
  id: string;
  name: string | null;
  description: string | null;
  active: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
  triggerCount: number | null;
  availableInMCP: boolean;
};

export type McpExecutionRow = {
  id: string;
  workflowId: string;
  status: string;
  startedAt: string | null;
  stoppedAt: string | null;
};

export async function mcpSearchWorkflows(limit = 200) {
  return n8nMcpCallTool<{ data: McpWorkflowRow[]; count: number }>("search_workflows", {
    limit,
  });
}

export async function mcpSearchExecutions(args: {
  workflowId?: string;
  limit?: number;
  status?: string[];
}) {
  return n8nMcpCallTool<{
    data: McpExecutionRow[];
    count: number;
    error?: string;
  }>("search_executions", {
    limit: args.limit ?? 50,
    ...(args.workflowId ? { workflowId: args.workflowId } : {}),
    ...(args.status ? { status: args.status } : {}),
  });
}
