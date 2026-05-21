"use client";

import { BorderBeam } from "@/components/ui/border-beam";
import { SiriOrb } from "@/components/ui/siri-orb";
import { CtaButton } from "@/components/landing/cta-button";
import { IndustryShowcase } from "@/components/landing/industry-showcase-section";
import { VocIndustryShowcase } from "@/components/landing/voc-industry-showcase";
import { VocFloatingReviewsVisual } from "@/components/landing/voc-floating-reviews-visual";
import { PhoneRingPulse } from "@/components/landing/decorations";
import { FadeIn, Section, SectionHeader } from "@/components/ui/section";
import { useLocale } from "@/components/providers/locale-provider";
import { getBookingMailto, getTalkOverCoffeeCta } from "@/lib/contact";
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
import { scrollToAnchor } from "@/lib/hash-navigation";
import { useEffect, useState } from "react";

function getServiceTabFromHash(hash: string): ServiceTab {
  if (
    hash === "#voice-of-customer" ||
    hash === "#voc" ||
    hash === "#voc-demos"
  ) {
    return "voc";
  }
  return "ai";
}

type ServiceTab = "ai" | "voc";

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
      sourceLabel={voc.reviewSource}
    />
  );
}

function ServicePicker({
  active,
  onChange,
  labels,
}: {
  active: ServiceTab;
  onChange: (tab: ServiceTab) => void;
  labels: Messages["solution"]["tabs"];
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
          </button>
        ))}
      </div>
    </div>
  );
}

export function SolutionSection() {
  const { m, locale } = useLocale();
  const s = m.solution;
  const mailto = getBookingMailto(locale);
  const [activeService, setActiveService] = useState<ServiceTab>(() =>
    typeof window === "undefined" ? "ai" : getServiceTabFromHash(window.location.hash)
  );

  useEffect(() => {
    const syncFromHash = () => {
      setActiveService(getServiceTabFromHash(window.location.hash));
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (activeService === "voc" && hash === "#voc-demos") {
      scrollToAnchor("voc-demos");
    }
    if (activeService === "ai" && hash === "#industry-demos") {
      scrollToAnchor("industry-demos");
    }
  }, [activeService]);

  const handleServiceChange = (tab: ServiceTab) => {
    setActiveService(tab);
    const hash = window.location.hash;
    if (tab === "ai" && (hash === "#voc-demos" || hash === "#voc" || hash === "#voice-of-customer")) {
      window.history.replaceState(null, "", "#ai-receptionist");
    }
    if (tab === "voc" && hash === "#industry-demos") {
      window.history.replaceState(null, "", "#voice-of-customer");
    }
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
                        <CtaButton href={mailto} variant="secondary" size="default">
                          {getTalkOverCoffeeCta(locale)}
                        </CtaButton>
                      </div>
                    </div>
                    <div className="border-t border-google-gray-100 p-4 lg:border-l lg:border-t-0 lg:p-6">
                      <ReceptionistVisual ai={s.ai} />
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
                <article className="group relative overflow-hidden rounded-3xl border border-google-gray-200 bg-white shadow-google-elevated">
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
                      <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-google-green/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-google-green">
                        <FileText className="size-3.5" />
                        {s.voc.badge}
                      </span>
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

                  <div className="border-t border-google-gray-100 bg-google-gray-50/40 px-5 py-8 md:px-8 md:py-10 lg:px-10">
                    <VocIndustryShowcase embedded />
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
