"use client";

import { VocCaseStudyCarousel } from "@/components/landing/voc-case-study-carousel";
import { VocReportDialog } from "@/components/landing/voc-report-dialog";
import { VocScoreCard } from "@/components/landing/voc-score-card";
import { FadeIn } from "@/components/ui/section";
import { useLocale } from "@/components/providers/locale-provider";
import type { IndustryAgentKey } from "@/lib/elevenlabs-agent";
import { cn } from "@/lib/utils";
import { useState } from "react";

const INDUSTRY_KEYS: IndustryAgentKey[] = [
  "restaurant",
  "salon",
  "estateAgency",
  "clinic",
];

type VocIndustryShowcaseProps = {
  className?: string;
  /** Renders inside the VoC service card (no duplicate section chrome). */
  embedded?: boolean;
};

export function VocIndustryShowcase({
  className,
  embedded = false,
}: VocIndustryShowcaseProps) {
  const { m } = useLocale();
  const ui = m.vocDemos;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeIndustry, setActiveIndustry] = useState<IndustryAgentKey | null>(
    null
  );

  const activeDemo =
    activeIndustry && ui.industries[activeIndustry].available
      ? ui.industries[activeIndustry]
      : null;

  const openReport = (key: IndustryAgentKey) => {
    if (!ui.industries[key].available) return;
    setActiveIndustry(key);
    setDialogOpen(true);
  };

  return (
    <div
      className={cn("scroll-mt-24", className)}
      id="voc-demos"
    >
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

      <VocCaseStudyCarousel placement="voc-carousel" className="mb-8" />

      <ul className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {INDUSTRY_KEYS.map((key, index) => {
          const demo = ui.industries[key];

          return (
            <FadeIn key={key} delay={index * 0.05} className="h-full">
              <li className="h-full">
                <VocScoreCard
                  demo={demo}
                  ui={ui}
                  industryLabel={demo.tabName}
                  onViewReport={
                    demo.available ? () => openReport(key) : undefined
                  }
                />
              </li>
            </FadeIn>
          );
        })}
      </ul>

      {activeDemo && activeIndustry && (
        <VocReportDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
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
    </div>
  );
}
