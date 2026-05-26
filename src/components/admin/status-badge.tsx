import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  active: "bg-google-green/10 text-google-green border-google-green/20",
  paid: "bg-google-green/10 text-google-green border-google-green/20",
  current: "bg-google-green/10 text-google-green border-google-green/20",
  healthy: "bg-google-green/10 text-google-green border-google-green/20",
  success: "bg-google-green/10 text-google-green border-google-green/20",
  ready: "bg-google-green/10 text-google-green border-google-green/20",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  overdue: "bg-amber-50 text-amber-800 border-amber-200",
  unpaid: "bg-google-red/10 text-google-red border-google-red/20",
  failed: "bg-google-red/10 text-google-red border-google-red/20",
  error: "bg-google-red/10 text-google-red border-google-red/20",
  crashed: "bg-google-red/10 text-google-red border-google-red/20",
  canceled: "bg-google-gray-100 text-google-gray-600 border-google-gray-200",
  running: "bg-pastel-blue text-google-blue border-google-blue/20",
  waiting: "bg-amber-50 text-amber-800 border-amber-200",
  paused: "bg-google-gray-100 text-google-gray-600 border-google-gray-200",
  draft: "bg-google-gray-100 text-google-gray-600 border-google-gray-200",
  prospect: "bg-pastel-blue text-google-blue border-google-blue/20",
};

export function StatusBadge({
  status,
  className,
}: {
  status: string | null | undefined;
  className?: string;
}) {
  const key = (status ?? "unknown").toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize",
        styles[key] ?? "bg-google-gray-100 text-google-gray-600 border-google-gray-200",
        className
      )}
    >
      {status ?? "unknown"}
    </span>
  );
}
