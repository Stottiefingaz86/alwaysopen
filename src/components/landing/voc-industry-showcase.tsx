"use client";

import { VocCaseStudyPreviewDialog } from "@/components/landing/voc-case-study-preview-dialog";
import { VocReportDialog } from "@/components/landing/voc-report-dialog";
import { VocScoreCard } from "@/components/landing/voc-score-card";
import { FadeIn } from "@/components/ui/section";
import { useLocale } from "@/components/providers/locale-provider";
import type { IndustryAgentKey } from "@/lib/elevenlabs-agent";
import type { CaseStudyListItem } from "@/lib/voc/case-studies";
import { collectFilterTags } from "@/lib/voc/case-studies";
import { formatTagLabel } from "@/lib/voc/business-tags";
import { industryDemoToReportCard } from "@/lib/voc/demo-to-card";
import { caseStudyToReportCard } from "@/lib/voc/report-card";
import type { VocReportData } from "@/lib/voc/report-types";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const INDUSTRY_KEYS: IndustryAgentKey[] = [
  "restaurant",
  "salon",
  "estateAgency",
  "clinic",
];

const LANDING_PLACEMENTS = "voc-demos,voc-carousel";

type VocIndustryShowcaseProps = {
  className?: string;
  embedded?: boolean;
  /** SSR from homepage — avoids empty grid when client fetch fails */
  initialPublished?: CaseStudyListItem[];
};

export function VocIndustryShowcase({
  className,
  embedded = false,
  initialPublished = [],
}: VocIndustryShowcaseProps) {
  const { m } = useLocale();
  const ui = m.vocDemos;

  const [published, setPublished] = useState<CaseStudyListItem[]>(initialPublished);
  const [publishedLoading, setPublishedLoading] = useState(!initialPublished.length);
  const [loadIssue, setLoadIssue] = useState<string | null>(null);

  const [sampleDialogOpen, setSampleDialogOpen] = useState(false);
  const [activeIndustry, setActiveIndustry] = useState<IndustryAgentKey | null>(
    null
  );

  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [previewReport, setPreviewReport] = useState<VocReportData | null>(null);
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);
  const [previewPeriod, setPreviewPeriod] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState<string | null>(null);

  const loadPublished = useCallback(async () => {
    setPublishedLoading(true);
    setLoadIssue(null);
    try {
      const res = await fetch(
        `/api/case-studies?placement=${encodeURIComponent(LANDING_PLACEMENTS)}`
      );
      const json = (await res.json()) as {
        items?: CaseStudyListItem[];
        error?: string;
        configMissing?: boolean;
        tableMissing?: boolean;
      };
      setPublished(json.items ?? []);
      if (json.configMissing) {
        setLoadIssue(
          "Reports cannot load on this deployment — set SUPABASE_SERVICE_ROLE_KEY in Vercel and redeploy."
        );
      } else if (json.tableMissing) {
        setLoadIssue(
          "Database table missing — run the voc_case_studies migration from the dashboard setup box."
        );
      } else if (!json.items?.length && json.error) {
        setLoadIssue(json.error);
      }
    } catch {
      setPublished(initialPublished);
      setLoadIssue("Could not load published reports.");
    } finally {
      setPublishedLoading(false);
    }
  }, [initialPublished]);

  useEffect(() => {
    if (!initialPublished.length) {
      void loadPublished();
    }
  }, [initialPublished.length, loadPublished]);

  const activeDemo =
    activeIndustry && ui.industries[activeIndustry].available
      ? ui.industries[activeIndustry]
      : null;

  const filterTags = collectFilterTags(published);

  const visiblePublished = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return published.filter((item) => {
      if (filterTag && !item.tags.includes(filterTag)) return false;
      if (!q) return true;
      const hay = [
        item.title,
        item.businessName,
        item.location,
        ...item.tagLabels,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [published, filterTag, searchQuery]);

  const hasPublished = published.length > 0;
  const hasVisiblePublished = visiblePublished.length > 0;
  const showSampleRestaurant =
    !hasPublished && ui.industries.restaurant.available;
  const showIndustryPlaceholders = !hasPublished;

  const openSampleReport = (key: IndustryAgentKey) => {
    if (!ui.industries[key].available) return;
    setActiveIndustry(key);
    setSampleDialogOpen(true);
  };

  async function openPublishedReport(id: string) {
    setActiveCaseId(id);
    setPreviewOpen(true);
    setReportLoading(true);
    setPreviewReport(null);
    try {
      const res = await fetch(`/api/case-studies/${id}`);
      if (!res.ok) throw new Error("load failed");
      const json = (await res.json()) as {
        report: VocReportData;
        businessSlug: string;
        period: string;
        title: string;
      };
      setPreviewReport(json.report);
      setPreviewSlug(json.businessSlug);
      setPreviewPeriod(json.period);
      setPreviewTitle(json.title);
    } catch {
      setPreviewReport(null);
    } finally {
      setReportLoading(false);
    }
  }

  const activeCase = published.find((i) => i.id === activeCaseId);

  return (
    <div className={cn("scroll-mt-24", className)} id="voc-demos">
      <div className={cn(embedded ? "mb-6" : "mb-8 text-center md:mb-10")}>
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-wider text-google-blue",
            embedded && "text-google-gray-500"
          )}
        >
          {ui.eyebrow}
        </p>
        <h3
          className={cn(
            "mt-2 font-medium tracking-tight text-foreground",
            embedded ? "text-lg md:text-xl" : "text-xl md:text-2xl"
          )}
        >
          {ui.title}
        </h3>
        <p
          className={cn(
            "mt-2 text-sm leading-relaxed text-google-gray-500",
            embedded ? "max-w-3xl" : "mx-auto max-w-2xl md:text-base"
          )}
        >
          {ui.subtitle}
        </p>
      </div>

      {publishedLoading ? (
        <p className="mb-6 text-sm text-google-gray-500">{m.caseStudies.loadingCarousel}</p>
      ) : null}

      {hasPublished ? (
        <div className="mb-6 space-y-4">
          <div className="relative max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-google-gray-400"
              aria-hidden
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={m.caseStudies.searchPlaceholder}
              className={cn(
                "h-10 w-full rounded-full border border-google-gray-200 bg-white pl-9 pr-4 text-sm",
                "outline-none focus-visible:border-google-blue focus-visible:ring-2 focus-visible:ring-google-blue/20"
              )}
            />
          </div>

          {filterTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFilterTag(null)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  filterTag === null
                    ? "border-google-blue bg-pastel-blue text-google-blue"
                    : "border-google-gray-200 bg-white text-google-gray-600 hover:border-google-gray-300"
                )}
              >
                {m.caseStudies.filterAll}
              </button>
              {filterTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setFilterTag(tag)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    filterTag === tag
                      ? "border-google-blue bg-pastel-blue text-google-blue"
                      : "border-google-gray-200 bg-white text-google-gray-600 hover:border-google-gray-300"
                  )}
                >
                  {formatTagLabel(tag)}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <ul className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {visiblePublished.map((item, index) => (
          <FadeIn key={item.id} delay={index * 0.05} className="h-full">
            <li className="h-full">
              <VocScoreCard
                card={caseStudyToReportCard(item)}
                ui={ui}
                onViewReport={() => void openPublishedReport(item.id)}
              />
            </li>
          </FadeIn>
        ))}

        {showSampleRestaurant ? (
          <FadeIn delay={published.length * 0.05} className="h-full">
            <li className="h-full">
              <VocScoreCard
                card={industryDemoToReportCard(
                  ui.industries.restaurant,
                  ui.industries.restaurant.tabName
                )}
                ui={ui}
                onViewReport={() => openSampleReport("restaurant")}
              />
            </li>
          </FadeIn>
        ) : null}

        {showIndustryPlaceholders
          ? INDUSTRY_KEYS.filter((key) => key !== "restaurant").map((key, index) => {
          const demo = ui.industries[key];
          return (
            <FadeIn
              key={key}
              delay={(published.length + (showSampleRestaurant ? 1 : 0) + index) * 0.05}
              className="h-full"
            >
              <li className="h-full">
                <VocScoreCard
                  card={industryDemoToReportCard(demo, demo.tabName)}
                  ui={ui}
                  onViewReport={
                    demo.available ? () => openSampleReport(key) : undefined
                  }
                />
              </li>
            </FadeIn>
          );
        })
          : null}
      </ul>

      {loadIssue ? (
        <p className="mt-4 text-center text-xs text-google-red" role="alert">
          {loadIssue}
        </p>
      ) : null}

      {!publishedLoading && !hasPublished && !loadIssue ? (
        <p className="mt-4 text-center text-xs text-google-gray-500">
          {m.caseStudies.emptyGridHint}
        </p>
      ) : null}

      {!publishedLoading && hasPublished && !hasVisiblePublished ? (
        <p className="mt-4 text-center text-sm text-google-gray-500">
          {m.caseStudies.noSearchResults}
        </p>
      ) : null}

      {activeDemo && activeIndustry && (
        <VocReportDialog
          open={sampleDialogOpen}
          onOpenChange={(open) => {
            setSampleDialogOpen(open);
            if (!open) {
              setActiveIndustry(null);
              if (window.location.hash === "#voc-demos") {
                window.history.replaceState(null, "", "#voice-of-customer");
              }
            }
          }}
          demo={activeDemo}
          ui={ui}
        />
      )}

      <VocCaseStudyPreviewDialog
        open={previewOpen}
        onOpenChange={(open) => {
          setPreviewOpen(open);
          if (!open) setActiveCaseId(null);
        }}
        loading={reportLoading}
        report={previewReport}
        businessSlug={previewSlug}
        period={previewPeriod}
        title={previewTitle ?? activeCase?.title}
      />
    </div>
  );
}
