"use client";

import { VocCaseStudyPreviewDialog } from "@/components/landing/voc-case-study-preview-dialog";
import { VocReportDialog } from "@/components/landing/voc-report-dialog";
import { VocScoreCard } from "@/components/landing/voc-score-card";
import { useLocale } from "@/components/providers/locale-provider";
import type { IndustryAgentKey } from "@/lib/elevenlabs-agent";
import type { CaseStudyListItem } from "@/lib/voc/case-studies";
import { collectFilterTags } from "@/lib/voc/case-studies";
import { formatTagLabel } from "@/lib/voc/business-tags";
import { industryDemoToReportCard } from "@/lib/voc/demo-to-card";
import { caseStudyToReportCard } from "@/lib/voc/report-card";
import type { VocReportData } from "@/lib/voc/report-types";
import { trackVocFilter, trackVocReportOpen } from "@/lib/analytics/gtag";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/** ~lg:grid-cols-4 column width, carousel uses fixed slides, not full row stretch */
const CAROUSEL_CARD_CLASS =
  "w-[min(72vw,240px)] shrink-0 snap-start sm:w-[260px]";

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
  /** SSR from homepage, avoids empty grid when client fetch fails */
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
  const scrollRef = useRef<HTMLUListElement>(null);

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
          "Reports cannot load on this deployment, set SUPABASE_SERVICE_ROLE_KEY in Vercel and redeploy."
        );
      } else if (json.tableMissing) {
        setLoadIssue(
          "Database table missing, run the voc_case_studies migration from the dashboard setup box."
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
    trackVocReportOpen({
      reportType: "sample",
      industry: key,
      reportTitle: ui.industries[key].tabName,
      location: embedded ? "voc_section_embedded" : "voc_demos",
    });
    setActiveIndustry(key);
    setSampleDialogOpen(true);
  };

  async function openPublishedReport(id: string) {
    const item = published.find((i) => i.id === id);
    trackVocReportOpen({
      reportType: "published",
      reportId: id,
      reportTitle: item?.title ?? item?.businessName,
      location: embedded ? "voc_section_embedded" : "voc_demos",
    });
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

  const placeholderCount =
    (showSampleRestaurant ? 1 : 0) +
    (showIndustryPlaceholders
      ? INDUSTRY_KEYS.filter((k) => k !== "restaurant").length
      : 0);
  const carouselCardCount = visiblePublished.length + placeholderCount;
  const showCarouselNav = carouselCardCount > 1;

  function scrollCarousel(dx: number) {
    scrollRef.current?.scrollBy({ left: dx, behavior: "smooth" });
  }

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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative min-w-0 flex-1 max-w-md">
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
            {showCarouselNav ? (
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => scrollCarousel(-276)}
                  className="rounded-full border border-google-gray-200 bg-white p-2 text-google-gray-600 shadow-google hover:bg-google-gray-50"
                  aria-label={m.caseStudies.scrollPrev}
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCarousel(276)}
                  className="rounded-full border border-google-gray-200 bg-white p-2 text-google-gray-600 shadow-google hover:bg-google-gray-50"
                  aria-label={m.caseStudies.scrollNext}
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            ) : null}
          </div>

          {filterTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  trackVocFilter(null, embedded ? "voc_section_embedded" : "voc_demos");
                  setFilterTag(null);
                }}
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
                  onClick={() => {
                    trackVocFilter(tag, embedded ? "voc_section_embedded" : "voc_demos");
                    setFilterTag(tag);
                  }}
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
      ) : showCarouselNav ? (
        <div className="mb-4 flex justify-end gap-1">
          <button
            type="button"
            onClick={() => scrollCarousel(-276)}
            className="rounded-full border border-google-gray-200 bg-white p-2 text-google-gray-600 shadow-google hover:bg-google-gray-50"
            aria-label={m.caseStudies.scrollPrev}
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollCarousel(276)}
            className="rounded-full border border-google-gray-200 bg-white p-2 text-google-gray-600 shadow-google hover:bg-google-gray-50"
            aria-label={m.caseStudies.scrollNext}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      ) : null}

      <div className="overflow-visible">
      <ul
        ref={scrollRef}
        className={cn(
          "flex list-none gap-4 overflow-x-auto overscroll-x-contain py-1 snap-x snap-proximity",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          !embedded && "px-4 sm:px-6"
        )}
      >
        {visiblePublished.map((item) => (
          <li key={item.id} className={cn(CAROUSEL_CARD_CLASS, "h-full")}>
            <VocScoreCard
              className="h-full"
              card={caseStudyToReportCard(item)}
              ui={ui}
              onViewReport={() => void openPublishedReport(item.id)}
            />
          </li>
        ))}

        {showSampleRestaurant ? (
          <li className={cn(CAROUSEL_CARD_CLASS, "h-full")}>
            <VocScoreCard
              className="h-full"
              card={industryDemoToReportCard(
                ui.industries.restaurant,
                ui.industries.restaurant.tabName
              )}
              ui={ui}
              onViewReport={() => openSampleReport("restaurant")}
            />
          </li>
        ) : null}

        {showIndustryPlaceholders
          ? INDUSTRY_KEYS.filter((key) => key !== "restaurant").map((key) => {
              const demo = ui.industries[key];
              return (
                <li key={key} className={cn(CAROUSEL_CARD_CLASS, "h-full")}>
                  <VocScoreCard
                    className="h-full"
                    card={industryDemoToReportCard(demo, demo.tabName)}
                    ui={ui}
                    onViewReport={
                      demo.available ? () => openSampleReport(key) : undefined
                    }
                  />
                </li>
              );
            })
          : null}
        <li className="w-2 shrink-0" aria-hidden />
      </ul>
      </div>

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
