"use client";

import { BorderBeam } from "@/components/ui/border-beam";
import { CtaButton } from "@/components/landing/cta-button";
import { PhoneRingPulse } from "@/components/landing/decorations";
import { ReviewCardMock } from "@/components/landing/illustrations";
import { FadeIn, Section, SectionHeader } from "@/components/ui/section";
import { BOOK_MEETING_MAILTO } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  FileText,
  ListChecks,
  Phone,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";

const receptionistFeatures = [
  "Answers your real phone line",
  "Books appointments & handles FAQs",
  "Sends confirmations automatically",
];

const pillars = [
  {
    title: "Review Intelligence",
    tagline: "Turn reviews into insight",
    description:
      "Spot themes in Google reviews before they cost you customers — complaints, praise, and trends in one view.",
    icon: BarChart3,
    href: "#voc",
    cta: "See review insights",
    visual: "reviews" as const,
    highlights: ["Theme detection", "Sentiment trends", "Response drafts"],
  },
  {
    title: "Voice of Customer",
    tagline: "Know what to fix next",
    description:
      "Monthly summaries with ranked actions — what to fix this week, not another spreadsheet to ignore.",
    icon: FileText,
    href: "#voc",
    cta: "See VoC reports",
    visual: "voc" as const,
    highlights: ["Monthly action plan", "Competitor context", "Owner-friendly"],
  },
];

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
  return (
    <div className="relative flex h-full min-h-[220px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-pastel-blue/80 via-white to-google-gray-50 p-6 md:min-h-0">
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
        className="relative z-10 flex size-24 items-center justify-center rounded-3xl border border-white/80 bg-white shadow-google-elevated sm:size-28"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Bot className="size-12 text-google-blue sm:size-14" strokeWidth={1.25} />
      </motion.div>
      <motion.div
        className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-google-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-google-gray-700 shadow-google"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <PhoneRingPulse />
        Live on your line
      </motion.div>
      <motion.div
        className="absolute bottom-5 left-5 flex items-center gap-2 rounded-xl border border-google-gray-200 bg-white/95 px-3 py-2 shadow-google-card"
        initial={{ opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <Phone className="size-4 text-google-blue" />
        <span className="text-xs font-medium text-google-gray-700">24/7 pickup</span>
      </motion.div>
      <motion.div
        className="absolute bottom-5 right-5 flex items-center gap-1.5 rounded-xl border border-google-gray-200 bg-white/95 px-3 py-2 shadow-google-card"
        initial={{ opacity: 0, x: 8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.35 }}
      >
        <Sparkles className="size-4 text-google-blue" />
        <span className="text-xs font-medium text-google-gray-700">AI trained</span>
      </motion.div>
    </div>
  );
}

function VocVisual() {
  const bars = [40, 65, 45, 80, 55, 72];
  return (
    <div className="mt-5 rounded-xl border border-dashed border-google-gray-200 bg-google-gray-50/80 p-4">
      <div className="mb-3 flex items-center justify-between text-xs text-google-gray-500">
        <span>Monthly themes</span>
        <span className="font-medium text-google-green">↑ Improving</span>
      </div>
      <div className="flex h-20 items-end justify-between gap-1.5">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="w-full max-w-8 rounded-t-md bg-google-blue/70"
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
          />
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {["Fix wait times", "Promote evening slots"].map((action) => (
          <li
            key={action}
            className="flex items-center gap-2 text-xs text-google-gray-700"
          >
            <ListChecks className="size-3.5 shrink-0 text-google-blue" />
            {action}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SolutionSection() {
  return (
    <Section id="services" background="pattern">
      <SectionHeader
        eyebrow="The solution"
        title="One system for phone calls, reviews and customer insight"
        subtitle="Telephone reception, review intelligence, and monthly insight — connected in one place."
      />

      {/* AI Receptionist — hero feature */}
      <FadeIn>
        <article className="group relative overflow-hidden rounded-3xl border border-google-gray-200 bg-white shadow-google-elevated">
          <CornerMarks />
          <BorderBeam
            size={140}
            duration={10}
            colorFrom="#6b9ae8"
            colorTo="#4a9b73"
            className="from-transparent via-google-blue/60 to-transparent"
          />

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
            <div className="flex flex-col justify-center p-7 md:p-10 lg:p-12">
              <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-pastel-blue px-3 py-1 text-xs font-semibold uppercase tracking-wider text-google-blue">
                <Bot className="size-3.5" />
                Core product
              </span>
              <h3 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl lg:text-[2rem]">
                AI Receptionist
              </h3>
              <p className="mt-2 text-lg text-google-gray-500">
                Your business number, answered 24/7
              </p>
              <ul className="mt-6 space-y-3">
                {receptionistFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-google-gray-700 md:text-[15px]"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-pastel-blue">
                      <Check className="size-3.5 text-google-blue" strokeWidth={2.5} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-google-gray-500">
                The core of AlwaysOpen — every caller reaches a trained agent on{" "}
                <strong className="font-medium text-foreground">your</strong> number.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <CtaButton href="#phone-receptionist" size="default">
                  How it works
                </CtaButton>
                <CtaButton href={BOOK_MEETING_MAILTO} variant="secondary" size="default">
                  Book Meeting
                </CtaButton>
              </div>
            </div>

            <div className="border-t border-google-gray-100 p-4 lg:border-l lg:border-t-0 lg:p-6">
              <ReceptionistVisual />
            </div>
          </div>
        </article>
      </FadeIn>

      {/* Review + VoC pillars */}
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:mt-8">
        {pillars.map((pillar, i) => (
          <FadeIn key={pillar.title} delay={0.08 + i * 0.06}>
            <article
              className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-google-gray-200 bg-white p-6 shadow-google-card transition-all",
                "hover:border-google-blue/35 hover:shadow-google-elevated md:p-7"
              )}
            >
              <CornerMarks />
              <div className="flex items-start gap-4">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-pastel-blue text-google-blue shadow-google transition-transform group-hover:scale-105">
                  <pillar.icon className="size-7" strokeWidth={1.5} />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-medium tracking-tight">{pillar.title}</h3>
                  <p className="mt-1 text-sm text-google-gray-500">{pillar.tagline}</p>
                </div>
              </div>

              <p className="mt-5 flex-1 text-sm leading-relaxed text-google-gray-600">
                {pillar.description}
              </p>

              <ul className="mt-4 flex flex-wrap gap-2">
                {pillar.highlights.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-google-gray-200 bg-google-gray-50 px-2.5 py-1 text-xs font-medium text-google-gray-600"
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              {pillar.visual === "reviews" ? (
                <div className="relative mt-5">
                  <ReviewCardMock className="transition-transform group-hover:-translate-y-0.5" />
                  <div className="absolute -right-1 -top-2 flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-medium text-google-yellow shadow-google">
                    <Star className="size-3 fill-google-yellow" />
                    4.8
                  </div>
                </div>
              ) : (
                <VocVisual />
              )}

              <Link
                href={pillar.href}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-google-blue transition-colors hover:text-[var(--pastel-blue-hover)]"
              >
                {pillar.cta}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </article>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
