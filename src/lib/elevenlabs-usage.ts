import { currentMonthKey, getBackofficeDb } from "@/lib/backoffice/db";

type ConversationRow = {
  agent_id?: string;
  call_duration_secs?: number;
  duration_secs?: number;
};

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
    .select("id, included_minutes, overage_rate, status, client_integrations(elevenlabs_agent_id)")
    .eq("status", "active");

  if (clientsError) {
    return { ok: false as const, error: clientsError.message };
  }

  const results: { clientId: string; minutes: number }[] = [];

  for (const client of clients ?? []) {
    const integration = Array.isArray(client.client_integrations)
      ? client.client_integrations[0]
      : client.client_integrations;
    const agentId = integration?.elevenlabs_agent_id;
    if (!agentId) continue;

    const res = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations?agent_id=${encodeURIComponent(agentId)}`,
      {
        headers: { "xi-api-key": apiKey },
      }
    );

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return {
        ok: false as const,
        error: `ElevenLabs API error for agent ${agentId}: ${detail || res.status}`,
      };
    }

    const json = (await res.json()) as {
      conversations?: ConversationRow[];
    };

    const now = new Date();
    let totalSeconds = 0;
    for (const conv of json.conversations ?? []) {
      const secs = conv.call_duration_secs ?? conv.duration_secs ?? 0;
      totalSeconds += secs;
    }

    const minutes = Math.round((totalSeconds / 60) * 100) / 100;
    const included = client.included_minutes ?? 0;
    const overageMinutes = Math.max(0, minutes - included);
    const overageCost = overageMinutes * Number(client.overage_rate ?? 0);

    await db.from("usage_logs").upsert(
      {
        client_id: client.id,
        month,
        elevenlabs_agent_id: agentId,
        elevenlabs_minutes: minutes,
        included_minutes: included,
        overage_minutes: overageMinutes,
        overage_cost: overageCost,
      },
      { onConflict: "client_id,month" }
    );

    results.push({ clientId: client.id, minutes });
  }

  return { ok: true as const, synced: results.length, results };
}
