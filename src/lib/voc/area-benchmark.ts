import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { VocReportData } from "@/lib/voc/report-types";

export function normalizeAreaKey(location: string | null | undefined): string {
  if (!location?.trim()) return "";
  return location.trim().toLowerCase();
}

export function tagsOverlap(a: string[], b: string[]): boolean {
  if (!a.length || !b.length) return false;
  const set = new Set(a.map((t) => t.toLowerCase()));
  return b.some((t) => set.has(t.toLowerCase()));
}

export function scoreToGoogleRating(score: number): number {
  return Math.round((score / 20) * 10) / 10;
}

type PeerScore = { name: string; score: number };

type PeerReportPayload = {
  name: string;
  score: number;
  metrics: { key: string; value: number }[];
};

async function loadPortfolioPeerReports(
  supabase: SupabaseClient<Database>,
  input: {
    businessId: string;
    location: string | null;
    tags: string[];
    period: string;
  }
): Promise<PeerReportPayload[]> {
  const areaKey = normalizeAreaKey(input.location);
  const tags = input.tags.map((t) => t.toLowerCase().trim()).filter(Boolean);
  if (!areaKey || !tags.length) return [];

  const { data: businesses, error } = await supabase
    .from("businesses")
    .select("id, name, location, tags")
    .neq("id", input.businessId);

  if (error || !businesses?.length) return [];

  const peers = businesses.filter(
    (b) =>
      normalizeAreaKey(b.location) === areaKey &&
      Array.isArray(b.tags) &&
      tagsOverlap(tags, b.tags)
  );

  if (!peers.length) return [];

  const peerIds = peers.map((p) => p.id);
  const { data: reports } = await supabase
    .from("voc_reports")
    .select("business_id, period, report_data, status, generated_at")
    .in("business_id", peerIds)
    .eq("status", "ready")
    .order("generated_at", { ascending: false });

  const bestByBusiness = new Map<
    string,
    { data: Record<string, unknown>; samePeriod: boolean }
  >();

  for (const row of reports ?? []) {
    const raw = row.report_data as Record<string, unknown> | null;
    if (!raw || typeof raw.score !== "number") continue;

    const samePeriod = row.period === input.period;
    const existing = bestByBusiness.get(row.business_id);
    if (!existing) {
      bestByBusiness.set(row.business_id, { data: raw, samePeriod });
      continue;
    }
    if (samePeriod && !existing.samePeriod) {
      bestByBusiness.set(row.business_id, { data: raw, samePeriod: true });
    }
  }

  const out: PeerReportPayload[] = [];
  for (const peer of peers) {
    const best = bestByBusiness.get(peer.id);
    if (!best) continue;
    const metrics = Array.isArray(best.data.metrics)
      ? (best.data.metrics as { key?: string; value?: number }[])
          .filter((m) => typeof m.key === "string" && typeof m.value === "number")
          .map((m) => ({ key: m.key as string, value: m.value as number }))
      : [];
    out.push({
      name: peer.name,
      score: best.data.score as number,
      metrics,
    });
  }

  return out.sort((a, b) => b.score - a.score);
}

export function computePeerMetricAverages(
  peerReports: readonly PeerReportPayload[]
): { key: string; average: number }[] {
  const acc = new Map<string, { sum: number; n: number }>();

  for (const peer of peerReports) {
    for (const m of peer.metrics) {
      const entry = acc.get(m.key) ?? { sum: 0, n: 0 };
      entry.sum += m.value;
      entry.n += 1;
      acc.set(m.key, entry);
    }
  }

  return [...acc.entries()]
    .map(([key, { sum, n }]) => ({
      key,
      average: Math.round(sum / n),
    }))
    .sort((a, b) => a.key.localeCompare(b.key));
}

export async function loadPortfolioPeerScores(
  supabase: SupabaseClient<Database>,
  input: {
    businessId: string;
    location: string | null;
    tags: string[];
    period: string;
  }
): Promise<PeerScore[]> {
  const reports = await loadPortfolioPeerReports(supabase, input);
  return reports.map((p) => ({ name: p.name, score: p.score }));
}

export function applyPortfolioBenchmarkToReport(
  report: VocReportData,
  input: {
    businessName: string;
    location: string;
    tags: string[];
    peers: PeerScore[];
  }
): VocReportData {
  if (!input.peers.length) return report;

  const clientRating = scoreToGoogleRating(report.score);
  const areaRows = [
    { name: input.businessName, rating: clientRating, highlight: true as const },
    ...input.peers.map((p) => ({
      name: p.name,
      rating: scoreToGoogleRating(p.score),
      highlight: false as const,
    })),
  ].sort((a, b) => b.rating - a.rating);

  const existing = report.monthlyReport.competitors;
  const areaNames = new Set(areaRows.map((r) => r.name.toLowerCase()));
  const fromReviews = (existing.rows ?? []).filter(
    (r) => !r.highlight && !areaNames.has(r.name.toLowerCase())
  );

  const tagLabel = input.tags[0]?.replace(/-/g, " ") ?? "business";
  const peerCount = input.peers.length;

  return {
    ...report,
    monthlyReport: {
      ...report.monthlyReport,
      competitors: {
        ...existing,
        chartLabel: "Area benchmark (your portfolio)",
        note: `Compared with ${peerCount} other ${tagLabel}${peerCount === 1 ? "" : "s"} in ${input.location}, Google-equivalent scores from latest VoC reports in your account.`,
        rows: [...areaRows, ...fromReviews].slice(0, 8),
        areaBenchmark: true,
      },
    },
  };
}

/** Merge portfolio peer scores when stored report predates peer reports or area benchmark. */
export async function enrichReportWithPortfolioBenchmark(
  supabase: SupabaseClient<Database>,
  input: {
    businessId: string;
    businessName: string;
    location: string | null;
    tags: string[] | null;
    period: string;
    report: VocReportData;
  }
): Promise<VocReportData> {
  const tags = (input.tags ?? []).map((t) => String(t).toLowerCase().trim()).filter(Boolean);
  const location = input.location?.trim() ?? "";
  if (!tags.length || !location) return input.report;

  const peerReports = await loadPortfolioPeerReports(supabase, {
    businessId: input.businessId,
    location,
    tags,
    period: input.period,
  });
  if (!peerReports.length) return input.report;

  const tagLabel = tags[0]?.replace(/-/g, " ") ?? "business";
  const metricAverages = computePeerMetricAverages(peerReports);

  let report = input.report;
  const comp = report.monthlyReport.competitors;
  const peerRows = (comp.rows ?? []).filter((r) => !r.highlight);
  if (!comp.areaBenchmark || peerRows.length < peerReports.length) {
    report = applyPortfolioBenchmarkToReport(report, {
      businessName: input.businessName,
      location,
      tags,
      peers: peerReports.map((p) => ({ name: p.name, score: p.score })),
    });
  }

  if (metricAverages.length) {
    report = {
      ...report,
      areaMetricBenchmark: {
        location,
        tagLabel,
        peerCount: peerReports.length,
        averages: metricAverages,
      },
    };
  }

  return report;
}
