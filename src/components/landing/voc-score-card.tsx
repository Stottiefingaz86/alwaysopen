"use client";

import { VocScoreGauge } from "@/components/landing/voc-score-gauge";
import { Progress } from "@/components/ui/progress";
import type { Messages } from "@/lib/i18n/messages/en";
import { getVocScoreTier } from "@/lib/voc-score-tier";
import { cn } from "@/lib/utils";
import Image from "next/image";

const GOOGLE_ICON = "/google-my-business-icon.svg";

type VocIndustryDemo =
  Messages["vocDemos"]["industries"][keyof Messages["vocDemos"]["industries"]];

type VocScoreCardProps = {
  demo: VocIndustryDemo;
  ui: Messages["vocDemos"];
  industryLabel: string;
  onViewReport?: () => void;
  className?: string;
};

const ghostButtonClass =
  "inline-flex h-11 w-full items-center justify-center rounded-full border-[1.5px] border-google-gray-200 bg-white px-5 text-sm font-medium text-google-blue shadow-google transition-all hover:border-google-blue hover:bg-pastel-blue active:scale-[0.98]";

export function VocScoreCard({
  demo,
  ui,
  industryLabel,
  onViewReport,
  className,
}: VocScoreCardProps) {
  const isAvailable = demo.available;
  const source = demo.source as "google" | "tripadvisor";
  const sourceLabel =
    source === "tripadvisor" ? ui.sourceTripadvisor : ui.sourceGoogle;
  const tier = isAvailable ? getVocScoreTier(demo.score) : "fair";
  const tierLabel = ui.tiers[tier];

  return (
    <article
      className={cn(
        "flex h-full min-h-[22rem] flex-col overflow-hidden rounded-2xl border bg-white shadow-google-card sm:min-h-[23.5rem]",
        isAvailable
          ? "border-google-gray-200"
          : "border-google-gray-200/80 opacity-55",
        className
      )}
    >
      <div className="relative flex flex-1 flex-col gap-3 p-5">
        {!isAvailable && (
          <span className="absolute right-3 top-3 rounded-full bg-google-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-google-gray-500">
            {ui.comingSoon}
          </span>
        )}

        <header className="space-y-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-google-gray-500">
            {industryLabel}
          </p>
          <p
            className={cn(
              "line-clamp-2 min-h-[2.5rem] text-base font-medium leading-snug",
              isAvailable ? "text-foreground" : "text-google-gray-500"
            )}
          >
            {demo.businessName}
          </p>
          {demo.location ? (
            <p className="truncate text-xs text-google-gray-500">{demo.location}</p>
          ) : (
            <p className="h-4" aria-hidden />
          )}
        </header>

        {isAvailable ? (
          <>
            <div className="flex min-h-8 items-center gap-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded border border-google-gray-200 bg-white">
                {source === "tripadvisor" ? (
                  <span className="text-[8px] font-bold text-google-gray-600">TA</span>
                ) : (
                  <Image
                    src={GOOGLE_ICON}
                    alt=""
                    width={16}
                    height={16}
                    className="size-3.5"
                  />
                )}
              </span>
              <p className="line-clamp-2 text-[10px] leading-snug font-medium text-google-gray-500">
                {sourceLabel}
                <span className="text-google-gray-400">
                  {" · "}
                  {ui.reviewsAnalyzed.replace("{{count}}", String(demo.reviewCount))}
                </span>
              </p>
            </div>

            <VocScoreGauge
              score={demo.score}
              label={ui.scoreLabel}
              qualityLabel={tierLabel}
            />

            <ul className="flex flex-col gap-2.5">
              {demo.metrics.slice(0, 3).map((metric) => (
                <li key={metric.key}>
                  <div className="mb-1 flex items-center justify-between gap-2 text-[10px]">
                    <span className="min-w-0 truncate font-medium text-google-gray-600">
                      {metric.label}
                    </span>
                    <span className="shrink-0 tabular-nums text-google-gray-500">
                      {metric.value}
                    </span>
                  </div>
                  <Progress
                    value={metric.value}
                    className="h-1.5"
                    indicatorClassName="bg-google-blue/75"
                  />
                </li>
              ))}
            </ul>

            <p className="mt-auto pt-1 text-[10px] text-google-gray-400">
              {demo.period}
            </p>
          </>
        ) : (
          <p className="flex-1 text-sm leading-relaxed text-google-gray-500">
            {ui.comingSoonBlurb}
          </p>
        )}
      </div>

      <div className="mt-auto shrink-0 border-t border-google-gray-100 p-4">
        {isAvailable && onViewReport ? (
          <button type="button" onClick={onViewReport} className={ghostButtonClass}>
            {ui.viewReport}
          </button>
        ) : (
          <div className="h-11" aria-hidden />
        )}
      </div>
    </article>
  );
}
