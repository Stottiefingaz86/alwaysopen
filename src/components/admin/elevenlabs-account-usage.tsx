import { cn } from "@/lib/utils";

export type ElevenLabsAccountUsage = {
  totalUsed: number;
  poolMinutes: number;
  remaining: number;
  usagePct: number;
  warn: boolean;
  critical: boolean;
  poolSource: "env" | "clients";
  syncedClientCount: number;
};

export function ElevenLabsAccountUsageCard({
  month,
  account,
  compact,
}: {
  month: string;
  account: ElevenLabsAccountUsage;
  compact?: boolean;
}) {
  const poolLabel =
    account.poolSource === "env"
      ? "account plan"
      : "allocated across clients";

  return (
    <div
      className={cn(
        "rounded-2xl border bg-white p-5 shadow-google",
        account.critical
          ? "border-google-red/40"
          : account.warn
            ? "border-amber-300"
            : "border-google-gray-200"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-google-gray-500">ElevenLabs — all agents ({month})</p>
          <p className="mt-1 text-2xl font-medium text-foreground">
            {account.totalUsed}{" "}
            <span className="text-lg font-normal text-google-gray-500">
              / {account.poolMinutes} min used
            </span>
          </p>
          <p className="mt-1 text-sm text-google-gray-600">
            {account.remaining} min remaining · {account.syncedClientCount} client(s) synced · pool
            from {poolLabel}
          </p>
        </div>
        <div className="text-right">
          <p
            className={cn(
              "text-3xl font-semibold tabular-nums",
              account.critical
                ? "text-google-red"
                : account.warn
                  ? "text-amber-700"
                  : "text-google-green"
            )}
          >
            {account.usagePct}%
          </p>
          {account.warn ? (
            <p className="mt-1 text-xs font-medium text-amber-800">
              {account.critical ? "Critical — near limit" : "Warning — over 70%"}
            </p>
          ) : (
            <p className="mt-1 text-xs text-google-gray-500">of account pool</p>
          )}
        </div>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-google-gray-100">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            account.critical
              ? "bg-google-red"
              : account.warn
                ? "bg-amber-500"
                : "bg-google-green"
          )}
          style={{ width: `${Math.min(100, account.usagePct)}%` }}
        />
      </div>

      {!compact ? (
        <p className="mt-3 text-xs text-google-gray-500">
          Total is summed from ElevenLabs API across every client agent. Each client still has their
          own included minutes (e.g. 500) on their profile.
        </p>
      ) : null}
    </div>
  );
}
