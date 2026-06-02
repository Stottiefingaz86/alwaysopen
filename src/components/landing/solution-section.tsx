"use client";

import { BorderBeam } from "@/components/ui/border-beam";
import { SectionAnchorCta } from "@/components/landing/section-anchor-cta";
import { IndustryShowcase } from "@/components/landing/industry-showcase-section";
import { VocIndustryShowcase } from "@/components/landing/voc-industry-showcase";
import type { CaseStudyListItem } from "@/lib/voc/case-studies";
import { VocFloatingReviewsVisual } from "@/components/landing/voc-floating-reviews-visual";
import { FadeIn, Section, SectionHeader } from "@/components/ui/section";
import { useLocale } from "@/components/providers/locale-provider";
import type { Messages } from "@/lib/i18n/messages/en";
import { aiReceptionistVideoSrc } from "@/lib/brand-assets";
import { trackVideoPlay, trackVideoStop } from "@/lib/analytics/gtag";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Bot,
  Check,
  FileText,
  Play,
  Square,
} from "lucide-react";
import Link from "next/link";
import {
  scrollToAnchor,
  scrollTargetFromHash,
  serviceTabFromHash,
  type ServiceTab,
} from "@/lib/hash-navigation";
import { useEffect, useRef, useState } from "react";

function CornerMarks() {
  return (
    <>
      <span className="absolute -left-px -top-px block size-2.5 border-l-2 border-t-2 border-google-blue" />
      <span className="absolute -right-px -top-px block size-2.5 border-r-2 border-t-2 border-google-blue" />
      <span className="absolute -bottom-px -left-px block size-2.5 border-b-2 border-l-2 border-google-blue" />
      <span className="absolute -bottom-px -right-px block size-2.5 border-b-2 border-r-2 border-google-blue" />
    </>
  );
}

function ReceptionistVisual() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = async () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    try {
      await video.play();
      setPlaying(true);
      trackVideoPlay("services_ai_receptionist");
    } catch {
      video.pause();
      video.muted = true;
    }
  };

  const handleStop = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    video.muted = true;
    setPlaying(false);
    trackVideoStop("services_ai_receptionist");
  };

  return (
    <div className="relative h-full min-h-[220px] overflow-hidden rounded-2xl bg-google-gray-900 md:min-h-[280px]">
      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-cover"
        src={aiReceptionistVideoSrc}
        loop
        muted
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        aria-label="AI receptionist on your business phone line"
      />
      {!playing ? (
        <button
          type="button"
          onClick={() => void handlePlay()}
          className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/25 transition-colors hover:bg-black/35"
          data-ga-skip-global
          aria-label="Play video with sound"
        >
          <span className="flex size-16 items-center justify-center rounded-full border border-white/40 bg-white/95 shadow-google-elevated transition-transform hover:scale-105 sm:size-[4.5rem]">
            <Play
              className="size-7 translate-x-0.5 fill-google-blue text-google-blue sm:size-8"
              aria-hidden
            />
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleStop}
          className="absolute bottom-4 right-4 z-10 inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/40 bg-white/95 px-4 py-2.5 text-sm font-medium text-google-gray-800 shadow-google-elevated transition-colors hover:bg-white"
          data-ga-skip-global
          aria-label="Stop video"
        >
          <Square className="size-3.5 fill-google-blue text-google-blue" aria-hidden />
          Stop
        </button>
      )}
    </div>
  );
}

function VocReportVisual({ voc }: { voc: Messages["solution"]["voc"] }) {
  return (
    <VocFloatingReviewsVisual
      reviews={voc.floatingReviews}
      sourceLabels={voc.reviewSources}
    />
  );
}

function ServicePicker({
  active,
  onChange,
  labels,
  vocPriceShort,
}: {
  active: ServiceTab;
  onChange: (tab: ServiceTab) => void;
  labels: Messages["solution"]["tabs"];
  vocPriceShort: string;
}) {
  const tabs: { id: ServiceTab; label: string; icon: typeof Bot }[] = [
    { id: "ai", label: labels.ai, icon: Bot },
    { id: "voc", label: labels.voc, icon: FileText },
  ];

  return (
    <div
      className="mx-auto flex w-full max-w-md flex-col gap-2 sm:max-w-lg"
      role="tablist"
      aria-label="Services"
    >
      <div className="flex rounded-full border border-google-gray-200 bg-white p-1 shadow-google">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-medium transition-all",
              active === tab.id
                ? "bg-google-blue text-white shadow-google"
                : "text-google-gray-600 hover:text-google-blue"
            )}
          >
            <tab.icon className="size-4 shrink-0" strokeWidth={1.75} />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.id === "ai" ? "AI" : "VoC"}</span>
            {tab.id === "voc" ? (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                  active === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-pastel-blue/80 text-google-blue"
                )}
              >
                {vocPriceShort}
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SolutionSection({
  initialCaseStudies = [],
}: {
  initialCaseStudies?: CaseStudyListItem[];
}) {
  const { m } = useLocale();
  const s = m.solution;
  const [activeService, setActiveService] = useState<ServiceTab>(() =>
    typeof window === "undefined" ? "ai" : serviceTabFromHash(window.location.hash)
  );

  useEffect(() => {
    const applyHash = () => {
      setActiveService(serviceTabFromHash(window.location.hash));
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  useEffect(() => {
    const target = scrollTargetFromHash(window.location.hash);
    if (!target) return;
    const tab = serviceTabFromHash(window.location.hash);
    if (tab !== activeService) return;
    requestAnimationFrame(() => scrollToAnchor(target));
  }, [activeService]);

  const handleServiceChange = (tab: ServiceTab) => {
    setActiveService(tab);
    const hash = tab === "voc" ? "#voice-of-customer" : "#ai-receptionist";
    window.history.replaceState(null, "", hash);
    requestAnimationFrame(() =>
      scrollToAnchor(tab === "voc" ? "voice-of-customer" : "ai-receptionist")
    );
  };

  return (
    <Section id="services" background="pattern" className="py-14 md:py-20">
      <SectionHeader
        compact
        eyebrow={s.eyebrow}
        title={s.title}
        subtitle={s.subtitle}
      />

      <FadeIn delay={0.04}>
        <ServicePicker
          active={activeService}
          onChange={handleServiceChange}
          labels={s.tabs}
          vocPriceShort={s.voc.priceShort}
        />
      </FadeIn>

      <div className="mt-6 lg:mt-8">
        <AnimatePresence mode="wait">
          {activeService === "ai" ? (
            <motion.div
              key="ai"
              id="ai-receptionist"
              className="scroll-mt-24"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              <FadeIn>
                <article className="group relative overflow-hidden rounded-3xl border border-google-gray-200 bg-white shadow-google-elevated">
                  <div className="relative overflow-hidden rounded-t-3xl">
                  <CornerMarks />
                  <BorderBeam
                    size={140}
                    duration={10}
                    colorFrom="#3b7fd4"
                    colorTo="#4a9b73"
                    className="from-transparent via-google-blue/60 to-transparent"
                  />
                  <div className="grid lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
                    <div className="flex flex-col justify-center p-7 md:p-10 lg:p-12">
                      <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-pastel-blue px-3 py-1 text-xs font-semibold uppercase tracking-wider text-google-blue">
                        <Bot className="size-3.5" />
                        {s.ai.badge}
                      </span>
                      <h3 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">
                        {s.ai.title}
                      </h3>
                      <p className="mt-2 text-lg text-google-gray-500">{s.ai.tagline}</p>
                      <p className="mt-4 text-sm leading-relaxed text-google-gray-600">
                        {s.ai.description}
                      </p>
                      <ul className="mt-6 space-y-3">
                        {s.ai.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center gap-3 text-sm text-google-gray-700"
                          >
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-pastel-blue">
                              <Check className="size-3.5 text-google-blue" strokeWidth={2.5} />
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-8">
                        <SectionAnchorCta
                          targetId="industry-demos"
                          label={s.ai.liveDemosCta}
                        />
                      </div>
                    </div>
                    <div className="border-t border-google-gray-100 p-4 lg:border-l lg:border-t-0 lg:p-6">
                      <ReceptionistVisual />
                    </div>
                  </div>
                  </div>

                  <div className="border-t border-google-gray-100 bg-google-gray-50/40 px-5 py-8 md:px-8 md:py-10 lg:px-10">
                    <IndustryShowcase embedded />
                  </div>
                </article>
              </FadeIn>
            </motion.div>
          ) : (
            <motion.div
              key="voc"
              id="voice-of-customer"
              className="scroll-mt-24"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              <FadeIn>
                <article className="group relative overflow-visible rounded-3xl border border-google-gray-200 bg-white shadow-google-elevated">
                  <div className="relative overflow-hidden rounded-t-3xl">
                  <CornerMarks />
                  <BorderBeam
                    size={140}
                    duration={10}
                    colorFrom="#4a9b73"
                    colorTo="#3b7fd4"
                    className="from-transparent via-google-green/50 to-transparent"
                  />
                  <div className="grid lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
                    <div className="flex flex-col justify-center p-7 md:p-10 lg:p-12">
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-google-green/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-google-green">
                          <FileText className="size-3.5" />
                          {s.voc.badge}
                        </span>
                        <span className="rounded-full border border-google-green/30 bg-white px-3 py-1 text-xs font-semibold tabular-nums text-google-green">
                          {s.voc.priceOneOff}
                        </span>
                      </div>
                      <h3 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">
                        {s.voc.title}
                      </h3>
                      <p className="mt-2 text-lg text-google-gray-500">{s.voc.tagline}</p>
                      <p className="mt-4 text-sm leading-relaxed text-google-gray-600">
                        {s.voc.description}
                      </p>
                      <ul className="mt-6 space-y-2">
                        {s.voc.highlights.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 text-sm text-google-gray-700"
                          >
                            <Check
                              className="mt-0.5 size-4 shrink-0 text-google-green"
                              strokeWidth={2.5}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="#voc-demos"
                        className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-google-blue transition-colors hover:text-[var(--pastel-blue-hover)]"
                      >
                        {s.voc.cta}
                        <ArrowRight className="size-4" />
                      </Link>
                    </div>
                    <div className="min-h-[220px] border-t border-google-gray-100 p-4 lg:min-h-0 lg:border-l lg:border-t-0 lg:p-6">
                      <VocReportVisual voc={s.voc} />
                    </div>
                  </div>
                  </div>

                  <div className="overflow-visible rounded-b-3xl border-t border-google-gray-100 bg-google-gray-50/40 px-5 py-8 md:px-8 md:py-10 lg:px-10">
                    <VocIndustryShowcase
                      embedded
                      initialPublished={initialCaseStudies}
                    />
                  </div>
                </article>
              </FadeIn>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}
