"use client";

import type { DashboardBusiness } from "@/app/dashboard/page";
import { Logo } from "@/components/landing/logo";
import { CaseStudyEditor } from "@/components/voc/case-study-editor";
import { SetupTagsCallout } from "@/components/voc/setup-tags-callout";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
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
import { useCallback, useEffect, useMemo, useState } from "react";

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
  const period = useMemo(() => currentPeriodKey(), []);
  const [linkCopiedId, setLinkCopiedId] = useState<string | null>(null);

  const checkSchema = useCallback(async () => {
    const res = await fetch("/api/admin/voc/schema-check");
    const json = await res.json().catch(() => ({}));
    setTagsColumnMissing(json.tagsColumn === false);
    if (json.tagsColumn === true && error?.includes("tags")) {
      setError(null);
    }
  }, [error]);

  useEffect(() => {
    void checkSchema();
  }, [checkSchema]);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
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
    const supabase = createClient();
    const maxAttempts = 80;

    for (let i = 0; i < maxAttempts; i += 1) {
      await new Promise((r) => setTimeout(r, 4000));
      const { data, error } = await supabase
        .from("voc_reports")
        .select(
          "id, period, status, public_slug, review_count, generated_at, created_at, error_message"
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
      "Report is still running after several minutes. Refresh the page — if it stays on scraping, click Generate again."
    );
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

        <section className="rounded-2xl border border-google-gray-200 bg-white p-6 shadow-google-card">
          <h1 className="text-lg font-medium text-foreground">Add business</h1>
          <p className="mt-1 text-sm text-google-gray-500">
            Google Place ID only for now. TripAdvisor and Trustpilot coming later.
          </p>
          <form onSubmit={(e) => void addBusiness(e)} className="mt-6 grid gap-4 sm:grid-cols-2">
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
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground">Businesses & reports</h2>
          <p className="mt-1 text-sm text-google-gray-500">
            Generate report for {period}. Scraping Google reviews can take 2–5 minutes — status updates automatically.
          </p>
          <ul className="mt-6 space-y-4">
            {businesses.length === 0 ? (
              <li className="rounded-xl border border-dashed border-google-gray-300 p-8 text-center text-sm text-google-gray-500">
                No businesses yet.
              </li>
            ) : (
              businesses.map((b) => {
                const latest = b.voc_reports[0];
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
                        disabled={
                          busy === `gen-${b.id}` ||
                          latest?.status === "scraping" ||
                          latest?.status === "analyzing"
                        }
                        onClick={() => void generateReport(b.id)}
                      >
                        {busy === `gen-${b.id}` ||
                        latest?.status === "scraping" ||
                        latest?.status === "analyzing"
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
                    {latest?.status === "ready" ? (
                      <CaseStudyEditor
                        reportId={latest.id}
                        businessName={b.name}
                        businessTags={b.tags ?? []}
                        disabled={Boolean(busy)}
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
