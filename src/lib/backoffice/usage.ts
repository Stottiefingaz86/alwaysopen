import type { UsageLog } from "@/lib/backoffice/types";
import { usagePercent } from "@/lib/backoffice/format";

/** Minutes count only when last synced from ElevenLabs API. */
export function isElevenLabsUsageVerified(log: Pick<UsageLog, "elevenlabs_synced_at"> | null | undefined) {
  return Boolean(log?.elevenlabs_synced_at);
}

export function verifiedMinutesUsed(log: Pick<UsageLog, "elevenlabs_minutes" | "elevenlabs_synced_at"> | null) {
  if (!log || !isElevenLabsUsageVerified(log)) return null;
  return Number(log.elevenlabs_minutes ?? 0);
}

export function verifiedUsagePercent(
  log: Pick<UsageLog, "elevenlabs_minutes" | "included_minutes" | "elevenlabs_synced_at"> | null
) {
  const used = verifiedMinutesUsed(log);
  if (used == null) return null;
  return usagePercent(used, log?.included_minutes ?? 0);
}

/** One ElevenLabs account, many agents — aggregate synced usage vs pool. */
export function computeAccountElevenLabsUsage(
  usageLogs: Pick<UsageLog, "elevenlabs_minutes" | "elevenlabs_synced_at">[],
  clients: { status: string; included_minutes: number }[]
) {
  const totalUsed = usageLogs.reduce((sum, log) => {
    const m = verifiedMinutesUsed(log);
    return sum + (m ?? 0);
  }, 0);

  const envPool = Number(process.env.ELEVENLABS_ACCOUNT_INCLUDED_MINUTES ?? 0);
  const allocatedPool = clients
    .filter((c) => c.status === "active")
    .reduce((sum, c) => sum + Number(c.included_minutes ?? 0), 0);

  /** Total minutes on your plan, or sum of client allowances if unset. */
  const poolMinutes = envPool > 0 ? envPool : allocatedPool;
  const usagePct = poolMinutes > 0 ? Math.round((totalUsed / poolMinutes) * 100) : 0;
  const remaining = Math.max(0, poolMinutes - totalUsed);

  return {
    totalUsed: Math.round(totalUsed * 100) / 100,
    poolMinutes,
    remaining: Math.round(remaining * 100) / 100,
    usagePct,
    warn: poolMinutes > 0 && usagePct >= 70,
    critical: poolMinutes > 0 && usagePct >= 90,
    poolSource: envPool > 0 ? ("env" as const) : ("clients" as const),
    syncedClientCount: usageLogs.filter((u) => isElevenLabsUsageVerified(u)).length,
  };
}
