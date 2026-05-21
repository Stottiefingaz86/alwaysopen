"use client";

import { CtaButton } from "@/components/landing/cta-button";
import { PublicReportView } from "@/components/voc/public-report-view";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLocale } from "@/components/providers/locale-provider";
import { getBookingMailto } from "@/lib/contact";
import type { VocReportData } from "@/lib/voc/report-types";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type VocCaseStudyPreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
  report: VocReportData | null;
  businessSlug: string | null;
  period: string | null;
  title?: string | null;
};

export function VocCaseStudyPreviewDialog({
  open,
  onOpenChange,
  loading = false,
  report,
  businessSlug,
  period,
  title,
}: VocCaseStudyPreviewDialogProps) {
  const { m, locale } = useLocale();
  const cs = m.caseStudies;
  const mailto = getBookingMailto(locale);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        overlayClassName="bg-black/45 backdrop-blur-md"
        className={cn(
          "flex max-h-[min(94vh,920px)] max-w-[calc(100%-1rem)] flex-col gap-0 overflow-hidden",
          "border-google-gray-200 p-0 sm:max-w-3xl lg:max-w-4xl"
        )}
      >
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <div className="max-h-[min(78vh,760px)] overflow-y-auto bg-google-gray-50">
            {loading ? (
              <div className="flex min-h-[280px] items-center justify-center gap-2 text-sm text-google-gray-500">
                <Loader2 className="size-5 animate-spin text-google-blue" aria-hidden />
                {cs.loadingReport}
              </div>
            ) : report && businessSlug && period ? (
              <PublicReportView
                report={report}
                businessSlug={businessSlug}
                period={period}
                previewMode
              />
            ) : (
              <p className="p-8 text-center text-sm text-google-gray-500">
                {cs.reportUnavailable}
              </p>
            )}
          </div>
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/90 to-transparent"
            aria-hidden
          />
        </div>

        <div className="relative z-10 shrink-0 border-t border-google-gray-200 bg-white px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                {title ?? report?.businessName ?? cs.defaultTitle}
              </p>
              <p className="mt-0.5 text-xs text-google-gray-500">{cs.previewFootnote}</p>
            </div>
            <CtaButton href={mailto} variant="secondary" size="default" className="shrink-0">
              {cs.getFullReport}
            </CtaButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
