import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";

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

export type PeerReportInsight = {
  name: string;
  score: number;
  negatives: string[];
  positives: string[];
  menuGaps: string[];
};

function readReportSlices(raw: Record<string, unknown> | null) {
  if (!raw) {
    return { negatives: [] as string[], positives: [] as string[], menuGaps: [] as string[] };
  }
  const negatives = Array.isArray(raw.negatives)
    ? (raw.negatives as string[]).filter((s) => typeof s === "string" && s.trim())
    : [];
  const positives = Array.isArray(raw.positives)
    ? (raw.positives as string[]).filter((s) => typeof s === "string" && s.trim())
    : [];
  const menuGaps = Array.isArray(raw.menuGaps)
    ? (raw.menuGaps as string[]).filter((s) => typeof s === "string" && s.trim())
    : [];
  return { negatives, positives, menuGaps };
}

export async function loadAreaPeerScores(
  supabase: SupabaseClient,
  input: {
    businessId: string;
    location: string | null;
    tags: string[];
    period: string;
  }
): Promise<PeerScore[]> {
  const areaKey = normalizeAreaKey(input.location);
  const tags = input.tags.map((t) => t.toLowerCase().trim()).filter(Boolean);
  if (!areaKey || !tags.length) return [];

  let businesses: { id: string; name: string; location: string | null; tags?: string[] | null }[] | null =
    null;
  const { data, error } = await supabase
    .from("businesses")
    .select("id, name, location, tags")
    .neq("id", input.businessId);

  if (error) {
    const msg = error.message ?? "";
    if (msg.includes("tags") || msg.includes("column")) {
      const fallback = await supabase
        .from("businesses")
        .select("id, name, location")
        .neq("id", input.businessId);
      if (fallback.error || !fallback.data?.length) return [];
      businesses = fallback.data.map((b) => ({ ...b, tags: [] }));
    } else {
      console.error("loadAreaPeerScores businesses:", msg);
      return [];
    }
  } else {
    businesses = data;
  }

  if (!businesses?.length) return [];

  const peers = businesses.filter(
    (b) =>
      normalizeAreaKey(b.location) === areaKey &&
      Array.isArray(b.tags) &&
      tagsOverlap(tags, b.tags as string[])
  );

  if (!peers.length) return [];

  const peerIds = peers.map((p) => p.id);
  const { data: reports } = await supabase
    .from("voc_reports")
    .select("business_id, period, report_data, status, generated_at")
    .in("business_id", peerIds)
    .eq("status", "ready")
    .order("generated_at", { ascending: false });

  const bestByBusiness = new Map<string, { score: number; samePeriod: boolean }>();

  for (const row of reports ?? []) {
    const raw = row.report_data as { score?: number } | null;
    const score = typeof raw?.score === "number" ? raw.score : null;
    if (score == null) continue;

    const samePeriod = row.period === input.period;
    const existing = bestByBusiness.get(row.business_id);
    if (!existing) {
      bestByBusiness.set(row.business_id, { score, samePeriod });
      continue;
    }
    if (samePeriod && !existing.samePeriod) {
      bestByBusiness.set(row.business_id, { score, samePeriod: true });
    }
  }

  const out: PeerScore[] = [];
  for (const peer of peers) {
    const best = bestByBusiness.get(peer.id);
    if (!best) continue;
    out.push({ name: peer.name, score: best.score });
  }

  return out.sort((a, b) => b.score - a.score);
}

/** Full peer report slices for market-gap analysis and AI context. */
export async function loadAreaPeerInsights(
  supabase: SupabaseClient,
  input: {
    businessId: string;
    location: string | null;
    tags: string[];
    period: string;
  }
): Promise<PeerReportInsight[]> {
  const areaKey = normalizeAreaKey(input.location);
  const tags = input.tags.map((t) => t.toLowerCase().trim()).filter(Boolean);
  if (!areaKey || !tags.length) return [];

  let businesses: { id: string; name: string; location: string | null; tags?: string[] | null }[] | null =
    null;
  const { data, error } = await supabase
    .from("businesses")
    .select("id, name, location, tags")
    .neq("id", input.businessId);

  if (error) {
    const msg = error.message ?? "";
    if (msg.includes("tags") || msg.includes("column")) {
      const fallback = await supabase
        .from("businesses")
        .select("id, name, location")
        .neq("id", input.businessId);
      if (fallback.error || !fallback.data?.length) return [];
      businesses = fallback.data.map((b) => ({ ...b, tags: [] }));
    } else {
      console.error("loadAreaPeerInsights businesses:", msg);
      return [];
    }
  } else {
    businesses = data;
  }

  const peers = (businesses ?? []).filter(
    (b) =>
      normalizeAreaKey(b.location) === areaKey &&
      Array.isArray(b.tags) &&
      tagsOverlap(tags, b.tags as string[])
  );

  if (!peers.length) return [];

  const peerIds = peers.map((p) => p.id);
  const { data: reports } = await supabase
    .from("voc_reports")
    .select("business_id, period, report_data, status, generated_at")
    .in("business_id", peerIds)
    .eq("status", "ready")
    .order("generated_at", { ascending: false });

  const bestReport = new Map<string, { data: Record<string, unknown>; samePeriod: boolean }>();

  for (const row of reports ?? []) {
    const raw = row.report_data as Record<string, unknown> | null;
    if (!raw || typeof raw.score !== "number") continue;
    const samePeriod = row.period === input.period;
    const existing = bestReport.get(row.business_id);
    if (!existing) {
      bestReport.set(row.business_id, { data: raw, samePeriod });
      continue;
    }
    if (samePeriod && !existing.samePeriod) {
      bestReport.set(row.business_id, { data: raw, samePeriod: true });
    }
  }

  const out: PeerReportInsight[] = [];
  for (const peer of peers) {
    const best = bestReport.get(peer.id);
    if (!best) continue;
    const slices = readReportSlices(best.data);
    out.push({
      name: peer.name,
      score: best.data.score as number,
      ...slices,
    });
  }

  return out.sort((a, b) => b.score - a.score);
}

function themeKeyword(line: string): string {
  const m = line.match(/^(.+?)\s*\(\d+/);
  return (m?.[1] ?? line).toLowerCase().trim().slice(0, 40);
}

export function buildMarketGapsFromPeers(
  reportData: Record<string, unknown>,
  peers: PeerReportInsight[],
  input: { location: string; tagLabel: string; businessName: string }
): Record<string, unknown> {
  if (!peers.length) return reportData;

  const existing = reportData.marketGaps as
    | { title?: string; summary?: string; gaps?: string[]; peersCompared?: string[] }
    | undefined;
  if (existing?.summary?.trim() && Array.isArray(existing.gaps) && existing.gaps.length >= 2) {
    return {
      ...reportData,
      marketGaps: {
        title: existing.title ?? `Market gaps · ${input.location}`,
        summary: existing.summary,
        gaps: existing.gaps.slice(0, 6),
        peersCompared: existing.peersCompared ?? peers.map((p) => p.name),
      },
    };
  }

  const clientScore = typeof reportData.score === "number" ? reportData.score : 70;
  const clientSlices = readReportSlices(reportData);
  const clientThemes = new Set(
    [...clientSlices.negatives, ...clientSlices.menuGaps].map(themeKeyword)
  );

  const leader = peers[0];
  const peerNames = peers.map((p) => p.name);
  const gapLines: string[] = [];

  if (leader && leader.score > clientScore + 4) {
    gapLines.push(
      `${leader.name} leads your ${input.tagLabel} peer set in ${input.location} (${leader.score} vs your ${clientScore} sentiment score).`
    );
  }

  const peerThemeCounts = new Map<string, number>();
  for (const peer of peers) {
    for (const line of [...peer.negatives, ...peer.menuGaps]) {
      const key = themeKeyword(line);
      if (!key) continue;
      peerThemeCounts.set(key, (peerThemeCounts.get(key) ?? 0) + 1);
    }
  }

  for (const [theme, count] of [...peerThemeCounts.entries()].sort((a, b) => b[1] - a[1])) {
    if (count < 2 || clientThemes.has(theme)) continue;
    const sample = peers
      .flatMap((p) => [...p.negatives, ...p.menuGaps])
      .find((l) => themeKeyword(l) === theme);
    if (sample) gapLines.push(`Peers often flag: ${sample}`);
    if (gapLines.length >= 5) break;
  }

  for (const gap of leader?.menuGaps.slice(0, 2) ?? []) {
    if (!clientThemes.has(themeKeyword(gap)) && !gapLines.some((g) => g.includes(gap.slice(0, 30)))) {
      gapLines.push(`Top peer ${leader.name}: ${gap}`);
    }
  }

  if (!gapLines.length) {
    gapLines.push(
      `No clear portfolio-wide gaps yet — regenerate reports for more ${input.tagLabel}s in ${input.location} to sharpen comparisons.`
    );
  }

  const summary =
    existing?.summary?.trim() ||
    `Compared with ${peers.length} other ${input.tagLabel}${peers.length === 1 ? "" : "s"} in ${input.location} (${peerNames.join(", ")}). Themes below show what peers’ customers mention more often than yours in this month’s reports.`;

  return {
    ...reportData,
    marketGaps: {
      title: `Market gaps · ${input.location}`,
      summary,
      gaps: gapLines.slice(0, 6),
      peersCompared: peerNames,
    },
  };
}

export function applyAreaBenchmarkToReport(
  reportData: Record<string, unknown>,
  input: {
    businessName: string;
    location: string;
    tags: string[];
    peers: PeerScore[];
  }
): Record<string, unknown> {
  if (!input.peers.length) return reportData;

  const score = typeof reportData.score === "number" ? reportData.score : 70;
  const monthly = (reportData.monthlyReport ?? {}) as Record<string, unknown>;
  const competitors = (monthly.competitors ?? {}) as Record<string, unknown>;

  const clientRating = scoreToGoogleRating(score);
  const areaRows = [
    { name: input.businessName, rating: clientRating, highlight: true },
    ...input.peers.map((p) => ({
      name: p.name,
      rating: scoreToGoogleRating(p.score),
      highlight: false,
    })),
  ].sort((a, b) => b.rating - a.rating);

  const existingRows = Array.isArray(competitors.rows)
    ? (competitors.rows as { name: string; highlight?: boolean }[])
    : [];
  const areaNames = new Set(areaRows.map((r) => r.name.toLowerCase()));
  const fromReviews = existingRows.filter(
    (r) => !r.highlight && !areaNames.has(r.name.toLowerCase())
  );

  const tagLabel = input.tags[0]?.replace(/-/g, " ") ?? "business";
  const peerCount = input.peers.length;

  monthly.competitors = {
    ...competitors,
    chartLabel: "Area benchmark (your portfolio)",
    note: `Compared with ${peerCount} other ${tagLabel}${peerCount === 1 ? "" : "s"} in ${input.location} — Google-equivalent scores from latest VoC reports in your account.`,
    rows: [...areaRows, ...fromReviews].slice(0, 8),
    areaBenchmark: true,
  };

  return { ...reportData, monthlyReport: monthly };
}
