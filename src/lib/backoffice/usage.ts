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
