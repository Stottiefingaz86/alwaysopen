"use client";

import { CtaButton } from "@/components/landing/cta-button";
import { VocSampleReportContent } from "@/components/landing/voc-sample-report-content";
import { VocScoreGauge } from "@/components/landing/voc-score-gauge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useLocale } from "@/components/providers/locale-provider";
import { getBookingMailto } from "@/lib/contact";
import { getVocScoreTier } from "@/lib/voc-score-tier";
import type { Messages } from "@/lib/i18n/messages/en";
import Image from "next/image";

const GOOGLE_ICON = "/google-my-business-icon.svg";

type VocIndustryDemo = Extract<
  Messages["vocDemos"]["industries"][keyof Messages["vocDemos"]["industries"]],
  { available: true }
>;

type VocReportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  demo: VocIndustryDemo;
  ui: Messages["vocDemos"];
};

export function VocReportDialog({
  open,
  onOpenChange,
  demo,
  ui,
}: VocReportDialogProps) {
  const { m, locale } = useLocale();
  const mailto = getBookingMailto(locale);
  const p = m.voc.panels;

  if (!demo.available) return null;

  const tierLabel = ui.tiers[getVocScoreTier(demo.score)];

  const sourceLabel =
    (demo.source as "google" | "tripadvisor") === "tripadvisor"
      ? ui.sourceTripadvisor
      : ui.sourceGoogle;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[min(92vh,880px)] max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden border-google-gray-200 p-0 sm:max-w-2xl lg:max-w-3xl"
        showCloseButton
      >
        <DialogHeader className="shrink-0 border-b border-google-gray-100 px-5 pb-4 pt-5 pr-12">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-google-gray-200 bg-white">
              {demo.source === "google" ? (
                <Image src={GOOGLE_ICON} alt="" width={28} height={28} />
              ) : (
                <span className="text-sm font-bold text-[#34e0a1]">TA</span>
              )}
            </span>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-lg font-medium">
                {demo.businessName}
              </DialogTitle>
              <DialogDescription className="text-google-gray-500">
                {demo.location} · {sourceLabel} · {demo.period}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <div className="mb-5 grid gap-4 rounded-2xl border border-google-gray-200 bg-google-gray-50/60 p-4 sm:grid-cols-[minmax(0,9.5rem)_1fr] sm:items-center">
            <div className="min-w-0">
              <VocScoreGauge
                score={demo.score}
                label={ui.scoreLabel}
                qualityLabel={tierLabel}
                large
              />
              <p className="mt-2 text-center text-[10px] text-google-gray-500">
                {ui.reviewsAnalyzed.replace("{{count}}", String(demo.reviewCount))}
              </p>
            </div>
            <div className="flex min-w-0 flex-col gap-3">
              {demo.metrics.map((metric) => (
                <div key={metric.key} className="min-w-0 w-full">
                  <div className="mb-1 flex items-center justify-between gap-2 text-xs font-medium">
                    <span className="min-w-0 truncate text-google-gray-600">
                      {metric.label}
                    </span>
                    <span className="shrink-0 tabular-nums text-google-gray-500">
                      {metric.value}
                    </span>
                  </div>
                  <Progress
                    value={metric.value}
                    className="h-2 w-full"
                    indicatorClassName={
                      metric.value < 60 ? "bg-google-red/70" : "bg-google-blue/75"
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <VocSampleReportContent demo={demo} ui={ui} panels={p} />
        </div>

        <div className="shrink-0 border-t border-google-gray-100 bg-google-gray-50/80 px-5 py-4">
          <CtaButton
            href={mailto}
            variant="secondary"
            size="default"
            className="w-full sm:w-auto"
          >
            {ui.getMyReport}
          </CtaButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
