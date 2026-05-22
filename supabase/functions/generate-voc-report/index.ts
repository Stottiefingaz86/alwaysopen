import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/** Supabase edge global — do not read from globalThis (often undefined in production). */
declare const EdgeRuntime: {
  waitUntil: (promise: Promise<unknown>) => void;
};
import { createClient } from "jsr:@supabase/supabase-js@2";
import { VOC_UX_RESEARCHER_SYSTEM } from "../_shared/voc-constants.ts";
import {
  buildAnalysisUserPayload,
  normalizeVocReport,
} from "../_shared/voc-ai-prompt.ts";
import type { ReviewForAi } from "../_shared/voc-ai-prompt.ts";
import {
  applyAreaBenchmarkToReport,
  buildMarketGapsFromPeers,
  loadAreaPeerInsights,
} from "../_shared/area-benchmark.ts";
import {
  computeTrendingFromReviews,
  fallbackGoogleReply,
  findUnrepliedLowStarReviews,
  formatReviewDate,
  starReviewLabel,
} from "../_shared/review-metrics.ts";

const ACTOR = "compass~Google-Maps-Reviews-Scraper";

type ScrapedReview = {
  stars?: number;
  text?: string;
  name?: string;
  publishedAtDate?: string;
  totalScore?: number;
  responseFromOwnerText?: string | null;
};

function formatPeriodLabel(periodKey: string): string {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const [y, m] = periodKey.split("-");
  const i = Number(m) - 1;
  if (!y || i < 0 || i > 11) return periodKey;
  return `${months[i]} ${y}`;
}

function buildStubReport(input: {
  businessName: string;
  location: string;
  periodKey: string;
  reviews: ScrapedReview[];
  placeRating?: number | null;
}) {
  const { businessName, location, periodKey, reviews } = input;
  const count = reviews.length;
  const stars = reviews.map((r) => r.stars ?? 0).filter((s) => s > 0);
  const avg = stars.length
    ? stars.reduce((a, b) => a + b, 0) / stars.length
    : input.placeRating ?? 4;
  const score = Math.round(Math.min(100, Math.max(0, (avg / 5) * 100)));
  const low = [...reviews].filter((r) => (r.text ?? "").length > 8)
    .sort((a, b) => (a.stars ?? 3) - (b.stars ?? 3))[0];
  const high = [...reviews].filter((r) => (r.text ?? "").length > 8)
    .sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0))[0];

  return {
    businessName,
    location: location || "—",
    listingGapsTitle: "Listing & profile gaps",
    source: "google",
    reviewCount: count,
    score,
    scoreLabel: score >= 70 ? "Good" : "Fair",
    period: formatPeriodLabel(periodKey),
    metrics: [
      { key: "overall", label: "Overall sentiment", value: score, color: "violet" },
      { key: "service", label: "Service", value: Math.min(100, score + 8), color: "green" },
      { key: "value", label: "Value", value: Math.max(40, score - 12), color: "amber" },
      { key: "issues", label: "Issue rate", value: 20, color: "red" },
    ],
    sentiment: {
      chartLabel: "Sentiment score (estimated)",
      trend: "→ Stable",
      months: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
      bars: [score - 20, score - 15, score - 10, score - 6, score - 3, score],
    },
    menuGaps: ["AI analysis unavailable — using basic scoring"],
    trending: computeTrendingFromReviews(
      reviews.filter((r) => (r.text ?? "").trim().length > 8).map((r) => ({
        stars: r.stars ?? null,
        text: (r.text ?? "").trim(),
        author: (r.name ?? "Anonymous").trim(),
        date: r.publishedAtDate ?? null,
      }))
    ),
    positives: ["See monthly report sections below"],
    negatives: ["See monthly report sections below"],
    recommendations: [
      { priority: "High", text: "Reply to recent low-star reviews within 48 hours" },
    ],
    monthlyReport: {
      complaints: {
        themes: ["Generated from scraped review sample"],
        review: {
          author: low?.name ?? "Reviewer",
          source: "Google",
          stars: low?.stars,
          quote: low?.text?.slice(0, 220) ?? "No negative sample in scrape.",
          tags: ["Fallback"],
        },
      },
      praise: {
        themes: ["Generated from scraped review sample"],
        review: {
          author: high?.name ?? "Reviewer",
          source: "Google",
          stars: high?.stars,
          quote: high?.text?.slice(0, 220) ?? "No positive sample in scrape.",
          tags: ["Fallback"],
        },
      },
      competitors: {
        chartLabel: "Competitor mentions",
        note: "Limited data in fallback mode",
        rows: [{ name: businessName, rating: Math.round(avg * 10) / 10, highlight: true }],
      },
      suggestions: (() => {
        const mapped = mapReviewsForAnalysis(reviews);
        const unreplied = findUnrepliedLowStarReviews(mapped, 8);
        const items = unreplied.map((r) => ({
          reviewLabel: starReviewLabel(r.stars),
          reviewAuthor: (r.author || "Reviewer").trim(),
          reviewQuote: r.text.slice(0, 400),
          stars: r.stars ?? undefined,
          date: formatReviewDate(r.date),
          replyLabel: "Suggested Google reply",
          replyText: fallbackGoogleReply(r.author),
        }));
        return {
          summary: items.length
            ? `${items.length} low-star review${items.length === 1 ? "" : "s"} still need a Google reply`
            : "No unreplied low-star reviews in this scrape",
          items,
        };
      })(),
      googleStrategy: [
        "Reply to reviews from the last 30 days",
        "Keep Google Business photos and hours up to date",
      ],
    },
  };
}

function mapReviewsForAnalysis(reviews: ScrapedReview[]): ReviewForAi[] {
  const withText = reviews.filter((r) => (r.text ?? "").trim().length > 8);
  const sorted = [...withText].sort((a, b) => {
    const da = a.publishedAtDate ?? "";
    const db = b.publishedAtDate ?? "";
    return db.localeCompare(da);
  });
  return sorted.map((r) => ({
    stars: r.stars ?? null,
    text: (r.text ?? "").trim().slice(0, 600),
    author: (r.name ?? "Anonymous").trim(),
    date: r.publishedAtDate ?? null,
    hasOwnerReply: Boolean(r.responseFromOwnerText?.trim()),
  }));
}

function reviewsForAi(reviews: ScrapedReview[]): ReviewForAi[] {
  return mapReviewsForAnalysis(reviews).slice(0, 60);
}

async function analyzeWithOpenAI(input: {
  apiKey: string;
  businessName: string;
  location: string;
  periodKey: string;
  reviews: ScrapedReview[];
  placeRating?: number | null;
  areaPeerReportInsights?: Awaited<ReturnType<typeof loadAreaPeerInsights>>;
}) {
  const period = formatPeriodLabel(input.periodKey);
  const allMapped = mapReviewsForAnalysis(input.reviews);
  const sample = allMapped.slice(0, 60);
  if (sample.length < 3) {
    throw new Error("Not enough review text to analyse (need at least 3 reviews with text)");
  }

  const user = buildAnalysisUserPayload({
    businessName: input.businessName,
    location: input.location,
    period,
    periodKey: input.periodKey,
    placeRating: input.placeRating ?? null,
    reviews: sample,
    areaPeerReportInsights: input.areaPeerReportInsights,
  });

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.35,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: VOC_UX_RESEARCHER_SYSTEM },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI failed (${res.status}): ${err.slice(0, 300)}`);
  }

  const payload = await res.json();
  const content = payload?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("OpenAI returned empty content");
  }

  const parsed = JSON.parse(content) as Record<string, unknown>;
  return normalizeVocReport(parsed, {
    businessName: input.businessName,
    location: input.location,
    period,
    periodKey: input.periodKey,
    reviewCount: input.reviews.length,
    placeRating: input.placeRating ?? null,
    reviews: allMapped,
    generatedAt: new Date().toISOString(),
  });
}

const APIFY_MAX_REVIEWS = 40;
const APIFY_POLL_MS = 4000;
/** Keep under Supabase edge max duration (~150s free / 400s paid). */
const APIFY_MAX_WAIT_MS = 140_000;

function apifyTokenParam(token: string) {
  return `token=${encodeURIComponent(token)}`;
}

async function scrapeGoogleReviews(
  placeId: string,
  token: string,
  onPoll?: () => Promise<void>
): Promise<ScrapedReview[]> {
  const startRes = await fetch(
    `https://api.apify.com/v2/acts/${ACTOR}/runs?${apifyTokenParam(token)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        placeIds: [placeId],
        maxReviews: APIFY_MAX_REVIEWS,
        reviewsSort: "newest",
        language: "en",
        reviewsOrigin: "google",
      }),
    }
  );
  if (!startRes.ok) {
    const text = await startRes.text();
    throw new Error(`Apify start failed (${startRes.status}): ${text.slice(0, 400)}`);
  }
  const started = await startRes.json();
  const runId = started?.data?.id as string | undefined;
  if (!runId) throw new Error("Apify did not return a run id");

  const deadline = Date.now() + APIFY_MAX_WAIT_MS;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, APIFY_POLL_MS));
    if (onPoll) await onPoll();
    const statusRes = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}?${apifyTokenParam(token)}`
    );
    if (!statusRes.ok) continue;
    const statusPayload = await statusRes.json();
    const run = statusPayload?.data;
    const st = run?.status as string | undefined;

    if (st === "SUCCEEDED") {
      const datasetId = run?.defaultDatasetId as string | undefined;
      if (!datasetId) throw new Error("Apify run succeeded but no dataset id");
      const itemsRes = await fetch(
        `https://api.apify.com/v2/datasets/${datasetId}/items?${apifyTokenParam(token)}&clean=true`
      );
      if (!itemsRes.ok) {
        throw new Error(`Apify dataset fetch failed (${itemsRes.status})`);
      }
      const data = await itemsRes.json();
      return Array.isArray(data) ? data : [];
    }

    if (st === "FAILED" || st === "ABORTED" || st === "TIMED-OUT") {
      throw new Error(`Apify run ${st}: ${run?.statusMessage ?? "unknown error"}`);
    }
  }

  throw new Error(
    "Google review scrape timed out — try Generate again (Apify may still be running in the background)"
  );
}

function nowIso() {
  return new Date().toISOString();
}

async function patchReport(
  supabase: ReturnType<typeof createClient>,
  reportId: string,
  patch: Record<string, unknown>
) {
  const { error } = await supabase
    .from("voc_reports")
    .update({ ...patch, updated_at: nowIso() })
    .eq("id", reportId);
  if (error) {
    throw new Error(`Could not update report: ${error.message}`);
  }
}

async function failReport(
  supabase: ReturnType<typeof createClient>,
  reportId: string,
  message: string
) {
  await patchReport(supabase, reportId, {
    status: "failed",
    error_message: message,
  });
}

async function invokeAnalyzePhase(
  reportId: string,
  supabaseUrl: string,
  serviceKey: string
) {
  const res = await fetch(`${supabaseUrl}/functions/v1/generate-voc-report`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ report_id: reportId, phase: "analyze" }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Analyze phase failed to start (${res.status}): ${text.slice(0, 400)}`
    );
  }
}

/** Scrape only — then hand off to a fresh edge invocation for OpenAI (avoids prod shutdown mid-analyze). */
async function runScrapePhase(
  supabase: ReturnType<typeof createClient>,
  reportId: string,
  report: { period: string; businesses: unknown },
  apifyToken: string | undefined,
  supabaseUrl: string,
  serviceKey: string
) {
  const business = report.businesses as {
    google_place_id: string | null;
  };

  if (!apifyToken) {
    throw new Error("APIFY_API_TOKEN not set in Supabase Edge Function secrets");
  }

  await patchReport(supabase, reportId, {
    status: "scraping",
    error_message: "Scraping Google reviews…",
  });

  const reviews = await scrapeGoogleReviews(
    business.google_place_id!,
    apifyToken,
    async () => {
      await patchReport(supabase, reportId, {
        error_message: "Scraping Google reviews… (waiting on Apify)",
      });
    }
  );

  await patchReport(supabase, reportId, {
    status: "analyzing",
    scraped_reviews: reviews,
    review_count: reviews.length,
  });

  await invokeAnalyzePhase(reportId, supabaseUrl, serviceKey);
}

async function runAnalyzePhase(
  supabase: ReturnType<typeof createClient>,
  reportId: string,
  report: {
    period: string;
    scraped_reviews: unknown;
    businesses: unknown;
  },
  openaiKey: string | undefined
) {
  const business = report.businesses as {
    id: string;
    name: string;
    location: string | null;
    tags?: string[] | null;
  };

  const reviews = Array.isArray(report.scraped_reviews)
    ? (report.scraped_reviews as ScrapedReview[])
    : [];

  if (reviews.length === 0) {
    throw new Error("No scraped reviews on file — run full generate again");
  }

  await patchReport(supabase, reportId, { status: "analyzing", error_message: null });

  const placeRating = reviews[0]?.totalScore ?? null;
  const baseInput = {
    businessName: business.name,
    location: business.location ?? "",
    periodKey: report.period,
    reviews,
    placeRating,
  };

  const tagsEarly = Array.isArray(business.tags)
    ? business.tags.map((t) => String(t).toLowerCase().trim()).filter(Boolean)
    : [];
  const locationEarly = business.location?.trim() ?? "";
  let peerInsightsForAi: Awaited<ReturnType<typeof loadAreaPeerInsights>> = [];
  if (tagsEarly.length && locationEarly) {
    try {
      peerInsightsForAi = await loadAreaPeerInsights(supabase, {
        businessId: business.id,
        location: locationEarly,
        tags: tagsEarly,
        period: report.period,
      });
    } catch (peerErr) {
      console.error("Area peer insights skipped:", peerErr);
    }
  }

  let reportData: Record<string, unknown>;
  if (openaiKey) {
    try {
      reportData = (await analyzeWithOpenAI({
        apiKey: openaiKey,
        ...baseInput,
        areaPeerReportInsights: peerInsightsForAi,
      })) as Record<string, unknown>;
    } catch (aiErr) {
      console.error("OpenAI fallback:", aiErr);
      reportData = buildStubReport(baseInput) as Record<string, unknown>;
    }
  } else {
    reportData = buildStubReport(baseInput) as Record<string, unknown>;
  }

  if (tagsEarly.length && locationEarly && peerInsightsForAi.length) {
    const peers = peerInsightsForAi.map((p) => ({ name: p.name, score: p.score }));
    reportData = applyAreaBenchmarkToReport(reportData, {
      businessName: business.name,
      location: locationEarly,
      tags: tagsEarly,
      peers,
    });
    reportData = buildMarketGapsFromPeers(reportData, peerInsightsForAi, {
      location: locationEarly,
      tagLabel: tagsEarly[0]?.replace(/-/g, " ") ?? "business",
      businessName: business.name,
    });
  }

  await patchReport(supabase, reportId, {
    status: "ready",
    report_data: reportData,
    generated_at: nowIso(),
    error_message: null,
  });
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) {
      return new Response(
        JSON.stringify({ error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in edge secrets" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const apifyToken = Deno.env.get("APIFY_API_TOKEN");
    const openaiKey = Deno.env.get("OPENAI_API_KEY");

    const supabase = createClient(supabaseUrl, serviceKey);
    const body = await req.json().catch(() => ({}));
    const reportId = body?.report_id;
    const phase = body?.phase === "analyze" ? "analyze" : "scrape";

    if (!reportId || typeof reportId !== "string") {
      return new Response(JSON.stringify({ error: "report_id required" }), { status: 400 });
    }

    const { data: report, error: reportErr } = await supabase
      .from("voc_reports")
      .select("*, businesses(*)")
      .eq("id", reportId)
      .single();

    if (reportErr || !report) {
      return new Response(JSON.stringify({ error: "Report not found" }), { status: 404 });
    }

    const business = report.businesses as {
      google_place_id: string | null;
    } | null;

    if (!business?.google_place_id) {
      await failReport(supabase, reportId, "Missing Google Place ID");
      return new Response(JSON.stringify({ error: "Missing place ID" }), { status: 400 });
    }

    if (phase === "analyze") {
      try {
        await runAnalyzePhase(supabase, reportId, report, openaiKey);
        return new Response(
          JSON.stringify({
            ok: true,
            accepted: false,
            report_id: reportId,
            status: "ready",
            message: "Analysis complete",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      } catch (e) {
        const message = e instanceof Error ? e.message : "Analysis failed";
        await failReport(supabase, reportId, message);
        return new Response(JSON.stringify({ error: message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    const scrapeWork = runScrapePhase(
      supabase,
      reportId,
      report,
      apifyToken,
      supabaseUrl,
      serviceKey
    ).catch(async (e) => {
      const message =
        e instanceof Error
          ? e.message
          : "Scrape pipeline stopped (edge timeout or shutdown)";
      console.error("Scrape phase error:", message);
      await failReport(
        supabase,
        reportId,
        `${message}. Use Continue analysis or Generate again in the dashboard.`
      );
    });

    try {
      EdgeRuntime.waitUntil(scrapeWork);
    } catch {
      console.warn("EdgeRuntime.waitUntil unavailable — awaiting scrape inline");
      await scrapeWork;
    }

    return new Response(
      JSON.stringify({
        ok: true,
        accepted: true,
        report_id: reportId,
        status: "scraping",
        message: "Scrape started — analysis runs in a second step",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Edge handler failed";
    console.error("generate-voc-report handler:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
