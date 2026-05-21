"use client";

import { CtaButton } from "@/components/landing/cta-button";
import { PublicReportView } from "@/components/voc/public-report-view";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { useLocale } from "@/components/providers/locale-provider";
import { getBookingMailto } from "@/lib/contact";
import type { VocReportData } from "@/lib/voc/report-types";
import { cn } from "@/lib/utils";
import { Loader2, Lock, XIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/** Full paywall (blur + frost + CTA) at this scroll fraction */
const FULL_PAYWALL_AT = 0.5;

type PanelRect = {
  left: number;
  width: number;
  bottom: number;
  height: number;
};

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [panelRect, setPanelRect] = useState<PanelRect | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const measurePanel = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPanelRect({
      left: r.left,
      width: r.width,
      bottom: r.bottom,
      height: r.height,
    });
  }, []);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setScrollRatio(max < 4 ? 0 : Math.min(1, el.scrollTop / max));
    measurePanel();
  }, [measurePanel]);

  useEffect(() => {
    if (!open || loading) return;
    const id = requestAnimationFrame(() => {
      onScroll();
      measurePanel();
    });
    return () => cancelAnimationFrame(id);
  }, [open, loading, report, onScroll, measurePanel]);

  useEffect(() => {
    if (!open) return;
    const onResize = () => measurePanel();
    window.addEventListener("resize", onResize);
    const el = scrollRef.current;
    let ro: ResizeObserver | undefined;
    if (el) {
      ro = new ResizeObserver(measurePanel);
      ro.observe(el);
    }
    return () => {
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
    };
  }, [open, measurePanel, report, loading]);

  const resetScroll = useCallback(() => {
    setScrollRatio(0);
    setPanelRect(null);
    scrollRef.current?.scrollTo({ top: 0 });
  }, []);

  const paywallProgress = Math.min(1, scrollRatio / FULL_PAYWALL_AT);
  const blurPx = Math.round(2 + paywallProgress * 18);
  const frostHeightPx = panelRect
    ? Math.round(panelRect.height * paywallProgress)
    : 0;
  const showPaywallCta = paywallProgress >= 0.35;
  const ctaOpacity = Math.min(1, (paywallProgress - 0.3) / 0.4);

  const displayName = title ?? report?.businessName ?? cs.defaultTitle;

  const paywallLayer =
    mounted &&
    open &&
    panelRect &&
    report &&
    !loading &&
    paywallProgress > 0.03 &&
    frostHeightPx > 2
      ? createPortal(
          <>
            <div
              className="pointer-events-none fixed z-[100] transform-gpu"
              style={{
                left: panelRect.left,
                width: panelRect.width,
                bottom: window.innerHeight - panelRect.bottom,
                height: frostHeightPx,
                backdropFilter: `blur(${blurPx}px) saturate(1.15)`,
                WebkitBackdropFilter: `blur(${blurPx}px) saturate(1.15)`,
                background:
                  paywallProgress >= 0.92
                    ? "rgba(255, 255, 255, 0.97)"
                    : `linear-gradient(
                        to top,
                        rgba(255, 255, 255, 0.98) 0%,
                        rgba(255, 255, 255, 0.92) 30%,
                        rgba(255, 255, 255, 0.72) 55%,
                        rgba(255, 255, 255, 0.35) 80%,
                        rgba(255, 255, 255, 0.05) 100%
                      )`,
              }}
              aria-hidden
            />

            <div
              className={cn(
                "fixed z-[101] flex flex-col items-center justify-center px-6 text-center",
                !showPaywallCta && "pointer-events-none"
              )}
              style={{
                left: panelRect.left,
                width: panelRect.width,
                bottom: window.innerHeight - panelRect.bottom,
                height: Math.max(frostHeightPx, showPaywallCta ? panelRect.height * 0.5 : 0),
                opacity: showPaywallCta ? ctaOpacity : 0,
              }}
            >
              <span className="mb-2 flex size-10 items-center justify-center rounded-full border border-google-gray-200 bg-white shadow-google">
                <Lock className="size-4 text-google-blue" aria-hidden />
              </span>
              <p className="max-w-sm text-base font-medium text-foreground sm:text-lg">
                {cs.paywallTitle}
              </p>
              <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-google-gray-600">
                {cs.paywallBody.replace("{{business}}", displayName)}
              </p>
              <CtaButton
                href={mailto}
                variant="secondary"
                size="default"
                className={cn(
                  "mt-4 w-full sm:w-auto",
                  showPaywallCta && "pointer-events-auto"
                )}
              >
                {cs.getInTouch}
              </CtaButton>
            </div>
          </>,
          document.body
        )
      : null;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) resetScroll();
        onOpenChange(next);
      }}
    >
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/40"
        className={cn(
          "flex min-h-[min(62vh,540px)] max-h-[min(78vh,680px)] w-[calc(100%-1rem)] max-w-[calc(100%-1rem)] flex-col gap-0 overflow-hidden bg-white p-0",
          "border-google-gray-200 shadow-google-elevated sm:max-w-xl md:max-w-2xl"
        )}
      >
        <DialogClose
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute top-2 right-2 z-[110] size-8 rounded-full bg-white text-google-gray-600 shadow-google hover:bg-google-gray-50"
              aria-label="Close preview"
            />
          }
        >
          <XIcon className="size-4" />
        </DialogClose>

        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-google-gray-100 bg-white px-4 py-3 pr-12">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
            {period ? (
              <p className="text-[11px] text-google-gray-500">{period} · Preview</p>
            ) : null}
          </div>
          <CtaButton href={mailto} variant="secondary" size="sm" className="shrink-0">
            {cs.getInTouch}
          </CtaButton>
        </div>

        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain bg-google-gray-50"
        >
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
      </DialogContent>
      {paywallLayer}
    </Dialog>
  );
}
