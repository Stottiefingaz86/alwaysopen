"use client";

import { BorderBeam } from "@/components/ui/border-beam";
import { SiriOrb } from "@/components/ui/siri-orb";
import { CtaButton } from "@/components/landing/cta-button";
import { IndustryShowcase } from "@/components/landing/industry-showcase-section";
import { VocIndustryShowcase } from "@/components/landing/voc-industry-showcase";
import type { CaseStudyListItem } from "@/lib/voc/case-studies";
import { VocFloatingReviewsVisual } from "@/components/landing/voc-floating-reviews-visual";
import { PhoneRingPulse } from "@/components/landing/decorations";
import { FadeIn, Section, SectionHeader } from "@/components/ui/section";
import { useLocale } from "@/components/providers/locale-provider";
import { getContactHref, getTalkOverCoffeeCta } from "@/lib/contact";
import type { Messages } from "@/lib/i18n/messages/en";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Bot,
  Check,
  FileText,
  Phone,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import {
  scrollToAnchor,
  scrollTargetFromHash,
  serviceTabFromHash,
  type ServiceTab,
} from "@/lib/hash-navigation";
import { useEffect, useState } from "react";

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

function ReceptionistVisual({ ai }: { ai: Messages["solution"]["ai"] }) {
  return (
    <div className="relative flex h-full min-h-[220px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-pastel-blue/80 via-white to-google-gray-50 p-6 md:min-h-[280px]">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--google-gray-200) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
        aria-hidden
      />
      <motion.div
        className="relative z-10 flex items-center justify-center"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="pointer-events-none absolute size-32 rounded-full bg-google-blue/20 blur-2xl sm:size-36"
          aria-hidden
        />
        <SiriOrb
          size="112px"
          animationDuration={12}
          colors={{
            bg: "oklch(98% 0.008 240)",
            c1: "oklch(55% 0.14 240)",
            c2: "oklch(72% 0.12 220)",
            c3: "oklch(65% 0.1 235)",
          }}
          className="relative shadow-google-elevated"
        />
      </motion.div>
      <motion.div
        className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-google-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-google-gray-700 shadow-google"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <PhoneRingPulse />
        {ai.liveOnLine}
      </motion.div>
      <motion.div
        className="absolute bottom-5 left-5 flex items-center gap-2 rounded-xl border border-google-gray-200 bg-white/95 px-3 py-2 shadow-google-card"
        initial={{ opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <Phone className="size-4 text-google-blue" />
        <span className="text-xs font-medium text-google-gray-700">{ai.pickup}</span>
      </motion.div>
      <motion.div
        className="absolute bottom-5 right-5 flex items-center gap-1.5 rounded-xl border border-google-gray-200 bg-white/95 px-3 py-2 shadow-google-card"
        initial={{ opacity: 0, x: 8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.35 }}
      >
        <Sparkles className="size-4 text-google-blue" />
        <span className="text-xs font-medium text-google-gray-700">{ai.aiTrained}</span>
      </motion.div>
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
    { id: "voc", label: labels.voc, icon: FileText },
    { id: "ai", label: labels.ai, icon: Bot },
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
  const { m, locale } = useLocale();
  const s = m.solution;
  const contactHref = getContactHref(true);
  const [activeService, setActiveService] = useState<ServiceTab>(() =>
    typeof window === "undefined" ? "voc" : serviceTabFromHash(window.location.hash)
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
                      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <CtaButton href="#phone-receptionist" size="default">
                          {s.ai.howItWorks}
                        </CtaButton>
                        <CtaButton href={contactHref} variant="secondary" size="default">
                          {getTalkOverCoffeeCta(locale)}
                        </CtaButton>
                      </div>
                    </div>
                    <div className="border-t border-google-gray-100 p-4 lg:border-l lg:border-t-0 lg:p-6">
                      <ReceptionistVisual ai={s.ai} />
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
