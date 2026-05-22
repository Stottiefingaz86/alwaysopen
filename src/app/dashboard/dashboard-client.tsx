"use client";

import type { DashboardBusiness } from "@/app/dashboard/page";
import { Logo } from "@/components/landing/logo";
import { CaseStudyEditor } from "@/components/voc/case-study-editor";
import { SetupCaseStudiesCallout } from "@/components/voc/setup-case-studies-callout";
import { SetupTagsCallout } from "@/components/voc/setup-tags-callout";
import { Button } from "@/components/ui/button";
import {
  createClientWithConfig,
  getSupabaseBrowserConfig,
} from "@/lib/supabase/client";
import {
  BUSINESS_TAG_OPTIONS,
  formatTagLabel,
  normalizeBusinessTags,
} from "@/lib/voc/business-tags";
import { currentPeriodKey } from "@/lib/voc/period";
import { reportPath } from "@/lib/voc/slug";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";

type ReportFilter =
  | "all"
  | "on-website"
  | "ready"
  | "running"
  | "failed"
  | "no-report";

const STUCK_MS = 8 * 60 * 1000;
const RUNNING_POLL_MS = 5000;

function isReportStuck(report: {
  status: string;
  updated_at?: string;
  created_at: string;
}) {
  if (report.status !== "scraping" && report.status !== "analyzing") {
    return false;
  }
  const t = new Date(report.updated_at ?? report.created_at).getTime();
  return Date.now() - t > STUCK_MS;
}

const fieldClass = cn(
  "mt-1 w-full rounded-lg border border-google-gray-200 bg-white px-3 py-2 text-sm",
  "outline-none focus-visible:border-google-blue focus-visible:ring-2 focus-visible:ring-google-blue/20"
);

export function DashboardClient({
  initialBusinesses,
  initialTagsColumnMissing = false,
  userEmail,
}: {
  initialBusinesses: DashboardBusiness[];
  initialTagsColumnMissing?: boolean;
  userEmail: string;
}) {
  const router = useRouter();
  const [businesses, setBusinesses] = useState(initialBusinesses);
  const [name, setName] = useState("");
  const [placeId, setPlaceId] = useState("");
  const [location, setLocation] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["restaurant"]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tagsColumnMissing, setTagsColumnMissing] = useState(initialTagsColumnMissing);
  const [caseStudiesTableMissing, setCaseStudiesTableMissing] = useState(false);
  const period = useMemo(() => currentPeriodKey(), []);
  const [linkCopiedId, setLinkCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [reportFilter, setReportFilter] = useState<ReportFilter>("all");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [publishedReportIds, setPublishedReportIds] = useState<Set<string>>(
    () => new Set()
  );

  const loadPublishedCaseStudies = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/case-studies");
      const json = (await res.json()) as {
        items?: { report_id: string; is_published: boolean }[];
      };
      if (!res.ok) return;
      const ids = new Set(
        (json.items ?? [])
          .filter((i) => i.is_published)
          .map((i) => i.report_id)
      );
      setPublishedReportIds(ids);
    } catch {
      setPublishedReportIds(new Set());
    }
  }, []);

  useEffect(() => {
    void loadPublishedCaseStudies();
  }, [loadPublishedCaseStudies]);

  const filteredBusinesses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return businesses.filter((b) => {
      const latest = b.voc_reports[0];
      if (tagFilter && !(b.tags ?? []).includes(tagFilter)) return false;

      if (reportFilter === "on-website") {
        if (!latest || latest.status !== "ready" || !publishedReportIds.has(latest.id)) {
          return false;
        }
      } else if (reportFilter === "ready") {
        if (latest?.status !== "ready") return false;
      } else if (reportFilter === "running") {
        if (latest?.status !== "scraping" && latest?.status !== "analyzing") {
          return false;
        }
      } else if (reportFilter === "failed") {
        if (latest?.status !== "failed") return false;
      } else if (reportFilter === "no-report") {
        if (latest) return false;
      }

      if (!q) return true;
      const hay = [
        b.name,
        b.slug,
        b.location ?? "",
        b.google_place_id ?? "",
        latest?.period ?? "",
        latest?.status ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [businesses, searchQuery, reportFilter, tagFilter, publishedReportIds]);

  const checkSchema = useCallback(async () => {
    const res = await fetch("/api/admin/voc/schema-check");
    const json = await res.json().catch(() => ({}));
    setTagsColumnMissing(json.tagsColumn === false);
    setCaseStudiesTableMissing(json.caseStudiesTable === false);
    if (json.tagsColumn === true && error?.includes("tags")) {
      setError(null);
    }
  }, [error]);

  useEffect(() => {
    void checkSchema();
  }, [checkSchema]);

  const runningTargets = useMemo(
    () =>
      businesses.flatMap((b) =>
        b.voc_reports
          .filter((r) => r.status === "scraping" || r.status === "analyzing")
          .map((r) => ({ reportId: r.id, businessId: b.id }))
      ),
    [businesses]
  );
  const runningTargetsRef = useRef(runningTargets);
  runningTargetsRef.current = runningTargets;
  const runningPollKey = useMemo(
    () => runningTargets.map((t) => t.reportId).sort().join(","),
    [runningTargets]
  );

  /** Keep UI in sync when a run continues after refresh or edge `waitUntil` background work. */
  useEffect(() => {
    if (!runningPollKey) return;

    let cancelled = false;

    const tick = async () => {
      const cfg = await getSupabaseBrowserConfig();
      if (!cfg || cancelled) return;
      const supabase = createClientWithConfig(cfg);

      for (const { reportId, businessId } of runningTargetsRef.current) {
        const { data } = await supabase
          .from("voc_reports")
          .select(
            "id, period, status, public_slug, review_count, generated_at, created_at, updated_at, error_message"
          )
          .eq("id", reportId)
          .single();
        if (!data || cancelled) continue;

        setBusinesses((prev) =>
          prev.map((b) =>
            b.id === businessId
              ? {
                  ...b,
                  voc_reports: b.voc_reports.map((r) =>
                    r.id === reportId
                      ? {
                          ...r,
                          status: data.status,
                          review_count: data.review_count,
                          generated_at: data.generated_at,
                          updated_at: data.updated_at ?? r.updated_at,
                          error_message: data.error_message ?? null,
                        }
                      : r
                  ),
                }
              : b
          )
        );
      }
    };

    void tick();
    const timer = window.setInterval(() => void tick(), RUNNING_POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [runningPollKey]);

  async function signOut() {
    const cfg = await getSupabaseBrowserConfig();
    if (cfg) {
      const supabase = createClientWithConfig(cfg);
      await supabase.auth.signOut();
    }
    router.push("/login");
    router.refresh();
  }

  async function addBusiness(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy("add");
    const res = await fetch("/api/admin/voc/businesses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        google_place_id: placeId.trim(),
        location: location.trim() || null,
        tags: selectedTags,
      }),
    });
    const json = await res.json().catch(() => ({}));
    setBusy(null);
    if (!res.ok) {
      setError(json.error ?? "Could not add business");
      return;
    }
    setBusinesses((prev) => [json.business, ...prev]);
    setName("");
    setPlaceId("");
    setLocation("");
    setSelectedTags(["restaurant"]);
  }

  function toggleAddTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function saveBusinessTags(businessId: string, tags: string[]) {
    setError(null);
    setBusy(`tags-${businessId}`);
    const res = await fetch(`/api/admin/voc/businesses/${businessId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags }),
    });
    const json = await res.json().catch(() => ({}));
    setBusy(null);
    if (!res.ok) {
      const msg = json.error ?? "Could not update tags";
      setError(msg);
      if (msg.includes("tags") && msg.includes("schema")) {
        setTagsColumnMissing(true);
      }
      return;
    }
    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === businessId ? { ...b, tags: json.business.tags ?? tags } : b
      )
    );
  }

  async function pollReportUntilDone(reportId: string, businessId: string) {
    const cfg = await getSupabaseBrowserConfig();
    if (!cfg) return;
    const supabase = createClientWithConfig(cfg);
    const maxAttempts = 80;

    for (let i = 0; i < maxAttempts; i += 1) {
      await new Promise((r) => setTimeout(r, 4000));
      const { data, error } = await supabase
        .from("voc_reports")
        .select(
          "id, period, status, public_slug, review_count, generated_at, created_at, updated_at, error_message"
        )
        .eq("id", reportId)
        .single();

      if (error || !data) continue;

      setBusinesses((prev) =>
        prev.map((b) =>
          b.id === businessId
            ? {
                ...b,
                voc_reports: b.voc_reports.map((r) =>
                  r.id === reportId
                    ? {
                        ...r,
                        status: data.status,
                        review_count: data.review_count,
                        generated_at: data.generated_at,
                        updated_at: data.updated_at ?? r.updated_at,
                        error_message: data.error_message ?? null,
                      }
                    : r
                ),
              }
            : b
        )
      );

      if (data.status === "ready" || data.status === "failed") {
        setBusinesses((prev) =>
          prev.map((b) =>
            b.id === businessId
              ? {
                  ...b,
                  voc_reports: [
                    {
                      id: data.id,
                      period: data.period,
                      status: data.status,
                      public_slug: data.public_slug,
                      review_count: data.review_count,
                      generated_at: data.generated_at,
                      created_at: data.created_at,
                      updated_at: data.updated_at,
                      error_message: data.error_message,
                    },
                    ...b.voc_reports.filter((r) => r.id !== data.id),
                  ],
                }
              : b
          )
        );
        if (data.status === "failed" && data.error_message) {
          setError(data.error_message);
        }
        return;
      }
    }

    setError(
      "Report is still running after several minutes. If the edge function shut down, use Mark failed or Continue analysis below."
    );
  }

  async function recoverReport(
    reportId: string,
    businessId: string,
    action: "fail" | "continue"
  ) {
    setError(null);
    setBusy(`recover-${reportId}`);
    const res = await fetch(`/api/admin/voc/reports/${reportId}/recover`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setBusy(null);
      setError(json.error ?? "Could not update report");
      return;
    }
    if (action === "fail" && json.report) {
      const data = json.report as {
        id: string;
        status: string;
        error_message: string | null;
        updated_at: string;
      };
      setBusinesses((prev) =>
        prev.map((b) =>
          b.id === businessId
            ? {
                ...b,
                voc_reports: b.voc_reports.map((r) =>
                  r.id === reportId
                    ? {
                        ...r,
                        status: data.status,
                        error_message: data.error_message,
                        updated_at: data.updated_at,
                      }
                    : r
                ),
              }
            : b
        )
      );
      setBusy(null);
      return;
    }
    setBusy(null);
    if (action === "continue") {
      await pollReportUntilDone(reportId, businessId);
    }
  }

  async function generateReport(businessId: string) {
    setError(null);
    setBusy(`gen-${businessId}`);
    const res = await fetch("/api/admin/voc/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ business_id: businessId, period }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setBusy(null);
      setError(json.error ?? "Report generation failed");
      return;
    }

    const report = json.report as {
      id: string;
      period: string;
      status: string;
      public_slug: string;
      review_count: number;
      generated_at: string | null;
      created_at?: string;
      error_message?: string | null;
    };

    const reportRow = {
      id: report.id,
      period: report.period,
      status: report.status,
      public_slug: report.public_slug,
      review_count: report.review_count,
      generated_at: report.generated_at,
      created_at: report.created_at ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
      error_message: report.error_message ?? null,
    };

    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === businessId
          ? {
              ...b,
              voc_reports: [
                reportRow,
                ...b.voc_reports.filter((r) => r.id !== report.id),
              ],
            }
          : b
      )
    );

    if (json.accepted || report.status === "scraping" || report.status === "analyzing") {
      await pollReportUntilDone(report.id, businessId);
    }
    setBusy(null);
  }

  function copyLink(reportId: string, slug: string, reportPeriod: string) {
    const path = reportPath(slug, reportPeriod);
    const url = `${window.location.origin}${path}`;
    void navigator.clipboard.writeText(url).then(() => {
      setLinkCopiedId(reportId);
      setTimeout(() => setLinkCopiedId(null), 2000);
    });
  }

  return (
    <div className="min-h-screen bg-google-gray-50">
      <header className="border-b border-google-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-3 text-sm text-google-gray-600">
            <span className="hidden sm:inline">{userEmail}</span>
            <Button type="button" variant="outline" size="sm" onClick={() => void signOut()}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6">
        {tagsColumnMissing ? (
          <SetupTagsCallout
            onFixed={() => {
              void checkSchema();
              setError(null);
            }}
          />
        ) : null}

        {caseStudiesTableMissing ? (
          <SetupCaseStudiesCallout
            onFixed={() => {
              void checkSchema();
            }}
          />
        ) : null}

        <details className="rounded-2xl border border-google-gray-200 bg-white shadow-google-card group">
          <summary className="cursor-pointer list-none px-6 py-4 marker:content-none [&::-webkit-details-marker]:hidden">
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-lg font-medium text-foreground">Add business</h1>
              <span className="text-xs text-google-gray-500 group-open:hidden">Expand</span>
            </div>
            <p className="mt-1 text-sm text-google-gray-500">
              Google Place ID only for now. TripAdvisor and Trustpilot coming later.
            </p>
          </summary>
          <form
            onSubmit={(e) => void addBusiness(e)}
            className="grid gap-4 border-t border-google-gray-100 px-6 pb-6 pt-4 sm:grid-cols-2"
          >
            <div className="sm:col-span-2">
              <label className="text-sm font-medium">Business name</label>
              <input
                className={fieldClass}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="La Vista Marina"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Google Place ID</label>
              <input
                className={fieldClass}
                required
                value={placeId}
                onChange={(e) => setPlaceId(e.target.value)}
                placeholder="ChIJ..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Location (area)</label>
              <input
                className={fieldClass}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Sotogrande"
              />
              <p className="mt-1 text-xs text-google-gray-500">
                Used with tags to benchmark against other businesses in your portfolio
                in the same area.
              </p>
            </div>
            <div className="sm:col-span-2">
              <span className="text-sm font-medium">Tags</span>
              <p className="mt-0.5 text-xs text-google-gray-500">
                e.g. restaurant — peers with the same tag and location appear as area
                competitors on reports.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {BUSINESS_TAG_OPTIONS.map((tag) => {
                  const on = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleAddTag(tag)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                        on
                          ? "border-google-blue bg-pastel-blue text-google-blue"
                          : "border-google-gray-200 bg-white text-google-gray-600 hover:border-google-gray-300"
                      )}
                    >
                      {formatTagLabel(tag)}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={busy === "add"}>
                {busy === "add" ? "Saving…" : "Add business"}
              </Button>
            </div>
          </form>
          {error ? (
            <p className="mt-4 text-sm text-google-red" role="alert">
              {error}
            </p>
          ) : null}
        </details>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-medium text-foreground">Businesses & reports</h2>
              <p className="mt-1 text-sm text-google-gray-500">
                Generate report for {period}. Scraping takes 2–5 minutes — status updates
                automatically. Reports are not auto-generated every 30 days yet — run
                Generate each month (scheduled cron can be added later).
              </p>
            </div>
            <p className="text-xs text-google-gray-500">
              {filteredBusinesses.length} of {businesses.length} shown
            </p>
          </div>

          {businesses.length > 0 ? (
            <div className="mt-4 space-y-3">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-google-gray-400"
                  aria-hidden
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, slug, location, place ID…"
                  className={cn(fieldClass, "mt-0 pl-9")}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["all", "All"],
                    ["on-website", "On website"],
                    ["ready", "Ready"],
                    ["running", "Running"],
                    ["failed", "Failed"],
                    ["no-report", "No report"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setReportFilter(id)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium",
                      reportFilter === id
                        ? "border-google-blue bg-pastel-blue text-google-blue"
                        : "border-google-gray-200 bg-white text-google-gray-600"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-google-gray-500">Tag:</span>
                <button
                  type="button"
                  onClick={() => setTagFilter(null)}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[10px] font-medium",
                    tagFilter === null
                      ? "border-google-blue bg-pastel-blue text-google-blue"
                      : "border-google-gray-200 bg-white text-google-gray-600"
                  )}
                >
                  Any
                </button>
                {BUSINESS_TAG_OPTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[10px] font-medium",
                      tagFilter === tag
                        ? "border-google-blue bg-pastel-blue text-google-blue"
                        : "border-google-gray-200 bg-white text-google-gray-600"
                    )}
                  >
                    {formatTagLabel(tag)}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <ul className="mt-6 space-y-4">
            {businesses.length === 0 ? (
              <li className="rounded-xl border border-dashed border-google-gray-300 p-8 text-center text-sm text-google-gray-500">
                No businesses yet.
              </li>
            ) : filteredBusinesses.length === 0 ? (
              <li className="rounded-xl border border-dashed border-google-gray-300 p-8 text-center text-sm text-google-gray-500">
                No businesses match your search or filters.
              </li>
            ) : (
              filteredBusinesses.map((b) => {
                const latest = b.voc_reports[0];
                const stuck = latest ? isReportStuck(latest) : false;
                const running =
                  latest?.status === "scraping" || latest?.status === "analyzing";
                return (
                  <li
                    key={b.id}
                    className="rounded-2xl border border-google-gray-200 bg-white p-5 shadow-google-card"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-medium text-foreground">{b.name}</h3>
                        <p className="mt-1 text-xs text-google-gray-500">
                          /{b.slug} · Place ID: {b.google_place_id ?? "—"}
                        </p>
                        {b.location ? (
                          <p className="text-xs text-google-gray-500">{b.location}</p>
                        ) : null}
                        <BusinessTagEditor
                          businessId={b.id}
                          tags={b.tags ?? []}
                          disabled={busy?.startsWith("tags-") ?? false}
                          onSave={(tags) => void saveBusinessTags(b.id, tags)}
                        />
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        disabled={busy === `gen-${b.id}` || (running && !stuck)}
                        onClick={() => void generateReport(b.id)}
                      >
                        {busy === `gen-${b.id}` || (running && !stuck)
                          ? "Running…"
                          : `Generate ${period}`}
                      </Button>
                    </div>
                    {latest ? (
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                            latest.status === "ready"
                              ? "bg-google-green/10 text-google-green"
                              : latest.status === "failed"
                                ? "bg-google-red/10 text-google-red"
                                : latest.status === "analyzing"
                                  ? "bg-violet-100 text-violet-800"
                                  : "bg-pastel-blue text-google-blue"
                          )}
                        >
                          {latest.status}
                        </span>
                        <span className="text-google-gray-500">
                          {latest.review_count} reviews · {latest.period}
                        </span>
                        {latest.status === "ready" &&
                        publishedReportIds.has(latest.id) ? (
                          <span className="rounded-full bg-google-green/10 px-2 py-0.5 text-xs font-medium text-google-green">
                            On website
                          </span>
                        ) : null}
                        {latest.status === "ready" ? (
                          <>
                            <Link
                              href={reportPath(b.slug, latest.period)}
                              className="text-google-blue hover:underline"
                              target="_blank"
                            >
                              View report
                            </Link>
                            <button
                              type="button"
                              className="text-google-blue hover:underline"
                              onClick={() => copyLink(latest.id, b.slug, latest.period)}
                            >
                              {linkCopiedId === latest.id ? "Link copied" : "Copy link"}
                            </button>
                          </>
                        ) : null}
                      </div>
                    ) : null}
                    {latest?.error_message &&
                    (latest.status === "failed" ||
                      latest.status === "scraping" ||
                      latest.status === "analyzing") ? (
                      <p
                        className={cn(
                          "mt-2 text-xs",
                          latest.status === "failed"
                            ? "text-google-red"
                            : "text-google-gray-600"
                        )}
                        role={latest.status === "failed" ? "alert" : "status"}
                      >
                        {latest.error_message}
                      </p>
                    ) : null}
                    {latest && (stuck || running) ? (
                      <div className="mt-3 rounded-lg border border-amber-200/80 bg-amber-50/80 px-3 py-2.5">
                        <p className="text-xs text-amber-950">
                          {stuck
                            ? "This run may have stopped when the edge function shut down. Check Supabase → Edge Functions → Secrets (APIFY_API_TOKEN, OPENAI_API_KEY), then Mark failed and Generate again."
                            : latest.review_count > 0
                              ? "Scrape finished — if analysis hangs, use Continue analysis."
                              : "Still scraping (2–5 min). If this lasts more than 8 minutes, use Mark failed and Generate again."}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {latest.review_count > 0 ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              disabled={Boolean(busy)}
                              onClick={() =>
                                void recoverReport(latest.id, b.id, "continue")
                              }
                            >
                              {busy === `recover-${latest.id}`
                                ? "Starting…"
                                : "Continue analysis"}
                            </Button>
                          ) : null}
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={Boolean(busy)}
                            onClick={() => void recoverReport(latest.id, b.id, "fail")}
                          >
                            Mark failed
                          </Button>
                        </div>
                      </div>
                    ) : null}
                    {latest?.status === "ready" ? (
                      <CaseStudyEditor
                        reportId={latest.id}
                        businessName={b.name}
                        businessTags={b.tags ?? []}
                        disabled={Boolean(busy)}
                        onPublishedChange={() => void loadPublishedCaseStudies()}
                      />
                    ) : null}
                    {!latest ? (
                      <p className="mt-3 text-sm text-google-gray-500">No reports yet.</p>
                    ) : null}
                  </li>
                );
              })
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}

function BusinessTagEditor({
  businessId,
  tags,
  disabled,
  onSave,
}: {
  businessId: string;
  tags: string[];
  disabled: boolean;
  onSave: (tags: string[]) => void;
}) {
  const [draft, setDraft] = useState(tags);

  useEffect(() => {
    setDraft(tags);
  }, [tags]);

  const dirty =
    draft.length !== tags.length || draft.some((t, i) => t !== tags[i]);

  return (
    <div className="mt-2">
      <p className="text-[10px] font-medium uppercase tracking-wider text-google-gray-500">
        Tags
      </p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {BUSINESS_TAG_OPTIONS.map((tag) => {
          const on = draft.includes(tag);
          return (
            <button
              key={`${businessId}-${tag}`}
              type="button"
              disabled={disabled}
              onClick={() =>
                setDraft((prev) =>
                  prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                )
              }
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[10px] font-medium",
                on
                  ? "border-google-blue/40 bg-pastel-blue/80 text-google-blue"
                  : "border-google-gray-200 text-google-gray-500"
              )}
            >
              {formatTagLabel(tag)}
            </button>
          );
        })}
      </div>
      {dirty ? (
        <button
          type="button"
          disabled={disabled || draft.length === 0}
          onClick={() => onSave(normalizeBusinessTags(draft))}
          className="mt-2 text-xs font-medium text-google-blue hover:underline disabled:opacity-50"
        >
          Save tags
        </button>
      ) : tags.length === 0 ? (
        <p className="mt-1 text-[10px] text-google-gray-500">
          Add at least one tag for area benchmarking.
        </p>
      ) : null}
    </div>
  );
}
