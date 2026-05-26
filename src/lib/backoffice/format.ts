export function formatEuro(amount: number) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function usagePercent(used: number, included: number) {
  if (included <= 0) return 0;
  return Math.round((used / included) * 100);
}

export function parseOnboarding(raw: unknown) {
  if (!raw || typeof raw !== "object") return {};
  return raw as Record<string, boolean>;
}
