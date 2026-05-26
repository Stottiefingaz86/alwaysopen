import { currentMonthKey, getBackofficeDb } from "@/lib/backoffice/db";

type ConversationSummary = {
  call_duration_secs?: number;
  status?: string;
};

function monthUnixBounds(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  const start = Date.UTC(year, month - 1, 1, 0, 0, 0);
  const end = Date.UTC(year, month, 1, 0, 0, 0);
  return {
    call_start_after_unix: Math.floor(start / 1000),
    call_start_before_unix: Math.floor(end / 1000),
  };
}

async function fetchAgentMinutesForMonth(
  apiKey: string,
  agentId: string,
  monthKey: string
): Promise<{ minutes: number; error?: string }> {
  const bounds = monthUnixBounds(monthKey);
  let cursor: string | null = null;
  let totalSeconds = 0;

  for (let page = 0; page < 50; page++) {
    const params = new URLSearchParams({
      agent_id: agentId,
      page_size: "100",
      call_start_after_unix: String(bounds.call_start_after_unix),
      call_start_before_unix: String(bounds.call_start_before_unix),
    });
    if (cursor) params.set("cursor", cursor);

    const res = await fetch(`https://api.elevenlabs.io/v1/convai/conversations?${params}`, {
      headers: { "xi-api-key": apiKey, Accept: "application/json" },
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return {
        minutes: 0,
        error: `ElevenLabs API ${res.status} for agent ${agentId}: ${detail.slice(0, 200) || res.statusText}`,
      };
    }

    const json = (await res.json()) as {
      conversations?: ConversationSummary[];
      next_cursor?: string | null;
      has_more?: boolean;
    };

    for (const conv of json.conversations ?? []) {
      if (conv.status === "failed") continue;
      totalSeconds += conv.call_duration_secs ?? 0;
    }

    if (!json.has_more || !json.next_cursor) break;
    cursor = json.next_cursor;
  }

  return { minutes: Math.round((totalSeconds / 60) * 100) / 100 };
}

async function upsertUsageForClient(
  clientId: string,
  agentId: string,
  month: string,
  minutes: number,
  included: number,
  overageRate: number
) {
  const db = getBackofficeDb();
  const overageMinutes = Math.max(0, minutes - included);
  const overageCost = overageMinutes * overageRate;
  const syncedAt = new Date().toISOString();

  await db.from("usage_logs").upsert(
    {
      client_id: clientId,
      month,
      elevenlabs_agent_id: agentId,
      elevenlabs_minutes: minutes,
      included_minutes: included,
      overage_minutes: overageMinutes,
      overage_cost: overageCost,
      elevenlabs_synced_at: syncedAt,
    },
    { onConflict: "client_id,month" }
  );

  return syncedAt;
}

export async function syncElevenLabsUsageForClient(clientId: string) {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  if (!apiKey) {
    return {
      ok: false as const,
      error:
        "ELEVENLABS_API_KEY is not set. Add it to .env.local and Vercel, then redeploy.",
    };
  }

  const db = getBackofficeDb();
  const month = currentMonthKey();

  const { data: client, error } = await db
    .from("clients")
    .select("id, included_minutes, overage_rate, client_integrations(elevenlabs_agent_id)")
    .eq("id", clientId)
    .maybeSingle();

  if (error || !client) {
    return { ok: false as const, error: error?.message ?? "Client not found" };
  }

  const integration = Array.isArray(client.client_integrations)
    ? client.client_integrations[0]
    : client.client_integrations;
  const agentId = integration?.elevenlabs_agent_id?.trim();
  if (!agentId) {
    return { ok: false as const, error: "No ElevenLabs agent ID on this client" };
  }

  const { minutes, error: apiError } = await fetchAgentMinutesForMonth(apiKey, agentId, month);
  if (apiError) return { ok: false as const, error: apiError };

  const syncedAt = await upsertUsageForClient(
    client.id,
    agentId,
    month,
    minutes,
    client.included_minutes ?? 0,
    Number(client.overage_rate ?? 0)
  );

  return { ok: true as const, minutes, syncedAt };
}

export async function syncElevenLabsUsage() {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  if (!apiKey) {
    return {
      ok: false as const,
      error:
        "ELEVENLABS_API_KEY is not set. Add it to .env.local and Vercel, then redeploy.",
    };
  }

  const db = getBackofficeDb();
  const month = currentMonthKey();

  const { data: clients, error: clientsError } = await db
    .from("clients")
    .select("id, included_minutes, overage_rate, client_integrations(elevenlabs_agent_id)");

  if (clientsError) {
    return { ok: false as const, error: clientsError.message };
  }

  const results: { clientId: string; minutes: number }[] = [];
  const errors: string[] = [];

  for (const client of clients ?? []) {
    const integration = Array.isArray(client.client_integrations)
      ? client.client_integrations[0]
      : client.client_integrations;
    const agentId = integration?.elevenlabs_agent_id?.trim();
    if (!agentId) continue;

    const { minutes, error } = await fetchAgentMinutesForMonth(apiKey, agentId, month);
    if (error) {
      errors.push(error);
      continue;
    }

    await upsertUsageForClient(
      client.id,
      agentId,
      month,
      minutes,
      client.included_minutes ?? 0,
      Number(client.overage_rate ?? 0)
    );

    results.push({ clientId: client.id, minutes });
  }

  if (results.length === 0 && errors.length > 0) {
    return { ok: false as const, error: errors[0] };
  }

  return {
    ok: true as const,
    synced: results.length,
    results,
    warnings: errors.length ? errors : undefined,
  };
}
