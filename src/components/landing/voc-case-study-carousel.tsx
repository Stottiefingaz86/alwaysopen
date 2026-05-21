"use client";

import { VocCaseStudyPreviewDialog } from "@/components/landing/voc-case-study-preview-dialog";
import { useLocale } from "@/components/providers/locale-provider";
import type { CaseStudyListItem } from "@/lib/voc/case-studies";
import { collectFilterTags } from "@/lib/voc/case-studies";
import { formatTagLabel } from "@/lib/voc/business-tags";
import { getVocScoreTier } from "@/lib/voc-score-tier";
import type { VocReportData } from "@/lib/voc/report-types";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const GOOGLE_ICON = "/google-my-business-icon.svg";

type VocCaseStudyCarouselProps = {
  placement?: string;
  className?: string;
};

export function VocCaseStudyCarousel({
  placement = "voc-carousel",
  className,
}: VocCaseStudyCarouselProps) {
  const { m } = useLocale();
  const cs = m.caseStudies;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<CaseStudyListItem[]>([]);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [previewReport, setPreviewReport] = useState<VocReportData | null>(null);
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);
  const [previewPeriod, setPreviewPeriod] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string | null>(null);

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/case-studies?placement=${encodeURIComponent(placement)}`);
      const json = (await res.json()) as { items?: CaseStudyListItem[] };
      setItems(json.items ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [placement]);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  const filterTags = collectFilterTags(items);
  const visible = filterTag
    ? items.filter((i) => i.tags.includes(filterTag))
    : items;

  const activeItem = items.find((i) => i.id === activeId);

  async function openPreview(id: string) {
    setActiveId(id);
    setDialogOpen(true);
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

  function scrollBy(dx: number) {
    scrollRef.current?.scrollBy({ left: dx, behavior: "smooth" });
  }

  if (loading) {
    return (
      <p className={cn("text-sm text-google-gray-500", className)}>{cs.loadingCarousel}</p>
    );
  }

  if (!items.length) return null;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-google-blue">
            {cs.carouselEyebrow}
          </p>
          <h4 className="mt-1 text-base font-medium text-foreground md:text-lg">
            {cs.carouselTitle}
          </h4>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => scrollBy(-320)}
            className="rounded-full border border-google-gray-200 bg-white p-2 text-google-gray-600 shadow-google hover:bg-google-gray-50"
            aria-label={cs.scrollPrev}
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(320)}
            className="rounded-full border border-google-gray-200 bg-white p-2 text-google-gray-600 shadow-google hover:bg-google-gray-50"
            aria-label={cs.scrollNext}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {filterTags.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilterTag(null)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              filterTag === null
                ? "border-google-blue bg-pastel-blue text-google-blue"
                : "border-google-gray-200 bg-white text-google-gray-600"
            )}
          >
            {cs.filterAll}
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
                  : "border-google-gray-200 bg-white text-google-gray-600"
              )}
            >
              {formatTagLabel(tag)}
            </button>
          ))}
        </div>
      ) : null}

      <div
        ref={scrollRef}
        className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 scrollbar-thin"
      >
        {visible.map((item) => {
          const tier = m.vocDemos.tiers[getVocScoreTier(item.score)];
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => void openPreview(item.id)}
              className="w-[min(100%,280px)] shrink-0 snap-start rounded-2xl border border-google-gray-200 bg-white p-4 text-left shadow-google-card transition-shadow hover:shadow-elevated sm:w-[300px]"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-google-gray-200 bg-white">
                  <Image src={GOOGLE_ICON} alt="" width={22} height={22} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{item.title}</p>
                  <p className="truncate text-xs text-google-gray-500">
                    {item.location} · {item.period}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-end justify-between gap-2">
                <div>
                  <p className="text-3xl font-semibold tabular-nums leading-none text-foreground">
                    {item.score}
                  </p>
                  <p className="mt-1 text-xs text-google-gray-500">
                    {tier} · {item.reviewCount} reviews
                  </p>
                </div>
                <span className="text-xs font-medium text-google-blue">{cs.viewReport}</span>
              </div>
              {item.tagLabels.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1">
                  {item.tagLabels.slice(0, 3).map((label) => (
                    <span
                      key={label}
                      className="rounded-full bg-google-gray-100 px-2 py-0.5 text-[10px] text-google-gray-600"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              ) : null}
            </button>
          );
        })}
      </div>

      <VocCaseStudyPreviewDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setActiveId(null);
        }}
        loading={reportLoading}
        report={previewReport}
        businessSlug={previewSlug}
        period={previewPeriod}
        title={previewTitle ?? activeItem?.title}
      />
    </div>
  );
}
