const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** URL period key, e.g. `2026-03`. */
export function currentPeriodKey(date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function formatPeriodLabel(periodKey: string): string {
  const [y, m] = periodKey.split("-");
  const monthIndex = Number(m) - 1;
  if (!y || monthIndex < 0 || monthIndex > 11) return periodKey;
  return `${MONTH_NAMES[monthIndex]} ${y}`;
}
