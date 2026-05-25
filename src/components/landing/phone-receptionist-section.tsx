"use client";

import { BorderBeam } from "@/components/ui/border-beam";
import { Card, CardContent } from "@/components/ui/card";
import { FloatingBadge } from "@/components/landing/decorations";
import { FadeIn, Section, SectionHeader } from "@/components/ui/section";
import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  BarChart3,
  BellRing,
  Building2,
  CalendarCheck,
  Check,
  ChevronRight,
  Globe,
  Inbox,
  MessageCircle,
  Phone,
  RefreshCw,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const highlightIcons: LucideIcon[] = [Inbox, CalendarCheck, RefreshCw, BarChart3];

const stepIcons: LucideIcon[] = [
  MessageCircle,
  Sparkles,
  BellRing,
  RefreshCw,
  BarChart3,
];

const channelIcons = [Phone, MessageCircle, Globe] as const;

function ChannelFlowDiagram({
  channels,
  brand,
  badge,
}: {
  channels: [string, string, string];
  brand: string;
  badge: string;
}) {
  const nodes = channels.map((label, i) => ({
    label,
    icon: channelIcons[i] ?? Phone,
  }));

  return (
    <div
      className="mt-6 rounded-xl border border-dashed border-google-gray-200 bg-google-gray-50/80 p-4"
      aria-hidden
    >
      <div className="flex items-center justify-center gap-1 sm:gap-2">
        {nodes.map((node, i) => (
          <div key={node.label} className="flex items-center gap-1 sm:gap-2">
            <div className="flex flex-col items-center gap-1.5">
              <span className="flex size-10 items-center justify-center rounded-full border border-google-gray-200 bg-white shadow-google">
                <node.icon className="size-4 text-google-blue" strokeWidth={1.75} />
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wide text-google-gray-500">
                {node.label}
              </span>
            </div>
            {i < nodes.length - 1 && (
              <ChevronRight className="size-4 shrink-0 text-google-blue/50" />
            )}
          </div>
        ))}
        <ChevronRight className="size-4 shrink-0 text-google-blue/50" />
        <div className="flex flex-col items-center gap-1.5">
          <span className="flex size-10 items-center justify-center rounded-full border border-google-blue/30 bg-google-blue text-white shadow-google">
            <Sparkles className="size-4" strokeWidth={1.75} />
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wide text-google-blue">
            {brand}
          </span>
        </div>
      </div>
      <motion.div
        className="mx-auto mt-3 flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-google-green shadow-google"
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.35 }}
      >
        {badge}
      </motion.div>
    </div>
  );
}

function CardCorner() {
  return (
    <>
      <span className="absolute -left-px -top-px block size-2.5 border-l-2 border-t-2 border-google-blue" />
      <span className="absolute -right-px -top-px block size-2.5 border-r-2 border-t-2 border-google-blue" />
      <span className="absolute -bottom-px -left-px block size-2.5 border-b-2 border-l-2 border-google-blue" />
      <span className="absolute -bottom-px -right-px block size-2.5 border-b-2 border-r-2 border-google-blue" />
    </>
  );
}

export function PhoneReceptionistSection() {
  const { m } = useLocale();
  const flowChannels = m.phone.flowChannels as [string, string, string];
  const steps = m.phone.steps.map((step, i) => ({
    ...step,
    icon: stepIcons[i] ?? MessageCircle,
  }));

  return (
    <Section id="phone-receptionist" background="gray">
      <SectionHeader
        eyebrow={m.phone.eyebrow}
        title={m.phone.title}
        subtitle={m.phone.subtitle}
      />

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_1.05fr] lg:gap-16">
        <FadeIn className="lg:sticky lg:top-24">
          <Card className="relative overflow-visible rounded-2xl border-google-gray-200 bg-white shadow-google-elevated transition-shadow hover:shadow-google-float">
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
              aria-hidden
            >
              <CardCorner />
              <BorderBeam
                size={120}
                duration={8}
                colorFrom="#3b7fd4"
                colorTo="#4a9b73"
                className="from-transparent via-google-blue/70 to-transparent"
              />
            </div>
            <FloatingBadge className="right-3 -top-2.5 z-20 sm:right-5" delay={0.3}>
              {m.phone.badge}
            </FloatingBadge>

            <CardContent className="relative p-7 md:p-8">
              <div className="flex items-center gap-4 border-b border-google-gray-100 pb-6">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-pastel-blue text-google-blue shadow-google">
                  <Building2 className="size-7" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-google-gray-500">
                    {m.phone.lineLabel}
                  </p>
                  <p className="mt-1 text-xs text-google-gray-500">{m.phone.lineCaption}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-1">
                    {m.phone.phases.map((phase, index) => (
                      <span key={phase} className="inline-flex items-center gap-1">
                        <span className="rounded-full border border-google-gray-200 bg-google-gray-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-google-gray-600">
                          {phase}
                        </span>
                        {index < m.phone.phases.length - 1 && (
                          <ChevronRight
                            className="size-2.5 shrink-0 text-google-blue/60"
                            aria-hidden
                          />
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <ChannelFlowDiagram
                channels={flowChannels}
                brand={m.phone.flowBrand}
                badge={m.phone.flowBadge}
              />

              <ul className="mt-6 space-y-3">
                {m.phone.clarifiers.map((item, i) => (
                  <motion.li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-google-gray-700"
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-pastel-blue">
                      <Check className="size-3 text-google-blue" strokeWidth={2.5} />
                    </span>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </FadeIn>

        <div className="relative lg:pt-2">
          <div
            className="absolute left-[1.375rem] top-4 bottom-4 hidden w-px bg-linear-to-b from-google-blue/20 via-google-blue to-google-blue/20 md:block"
            aria-hidden
          />
          <ol className="space-y-5 md:space-y-6">
            {steps.map((step, i) => {
              const StepIcon = step.icon;
              const isHighlight = i === 1;

              return (
                <FadeIn key={step.title} delay={i * 0.06}>
                  <li className="group relative flex gap-5 md:gap-6">
                    <div className="relative z-10 flex flex-col items-center">
                      <motion.span
                        className={cn(
                          "flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-white shadow-google transition-shadow group-hover:shadow-google-float",
                          isHighlight
                            ? "bg-google-blue text-white"
                            : "bg-pastel-blue text-google-blue"
                        )}
                        whileHover={{ scale: 1.05 }}
                      >
                        <StepIcon className="size-5" strokeWidth={1.75} />
                      </motion.span>
                      <span className="mt-2 text-[10px] font-bold tabular-nums text-google-blue/80">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <article
                      className={cn(
                        "flex-1 rounded-2xl border bg-white p-5 shadow-google-card transition-all md:p-6",
                        "group-hover:-translate-y-0.5 group-hover:border-google-blue/30 group-hover:shadow-google-elevated",
                        isHighlight && "border-google-blue/25"
                      )}
                    >
                      <p className="text-xs font-semibold uppercase tracking-widest text-google-gray-400">
                        {m.phone.step} {i + 1}
                      </p>
                      <h3 className="mt-1.5 text-lg font-medium text-foreground md:text-xl">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-google-gray-500">
                        {step.text}
                      </p>

                      {"badge" in step && step.badge && (
                        <p
                          className={cn(
                            "mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                            isHighlight
                              ? "bg-google-blue/10 text-google-blue"
                              : "bg-google-gray-50 text-google-gray-600"
                          )}
                        >
                          {isHighlight && <Sparkles className="size-3" />}
                          {step.badge}
                        </p>
                      )}

                      {"examples" in step && step.examples && step.examples.length > 0 && (
                        <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                          {step.examples.map((example) => (
                            <li
                              key={example.industry}
                              className="rounded-xl border border-google-gray-200 bg-google-gray-50/80 px-3 py-2.5 transition-colors group-hover:bg-white"
                            >
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-google-gray-500">
                                {example.industry}
                              </p>
                              <p className="mt-1 text-xs leading-snug text-google-gray-700">
                                &ldquo;{example.quote}&rdquo;
                              </p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </article>
                  </li>
                </FadeIn>
              );
            })}
          </ol>
        </div>
      </div>

      <FadeIn delay={0.2}>
        <div className="relative mt-12 overflow-hidden rounded-2xl border border-google-blue/15 bg-linear-to-br from-pastel-blue/40 via-white to-white shadow-google-elevated md:mt-14">
          <div
            className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-google-blue/5 blur-2xl"
            aria-hidden
          />
          <div className="relative px-5 py-7 md:px-8 md:py-9">
            <p className="text-center text-lg font-medium tracking-tight text-foreground md:text-xl">
              {m.phone.highlight.headline}
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {m.phone.highlight.steps.map((phase, index) => {
                const Icon = highlightIcons[index] ?? Sparkles;
                return (
                  <motion.li
                    key={phase.label}
                    className="group rounded-xl border border-google-gray-200/90 bg-white/90 p-4 shadow-google transition-all hover:-translate-y-0.5 hover:border-google-blue/25 hover:shadow-google-md"
                    whileHover={{ scale: 1.01 }}
                  >
                    <span className="flex size-9 items-center justify-center rounded-lg bg-pastel-blue text-google-blue transition-colors group-hover:bg-google-blue group-hover:text-white">
                      <Icon className="size-4" strokeWidth={1.75} />
                    </span>
                    <p className="mt-3 text-sm font-medium text-foreground">{phase.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-google-gray-500">
                      {phase.description}
                    </p>
                  </motion.li>
                );
              })}
            </ul>

            <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-google-gray-500 md:text-base">
              {m.phone.highlight.subtext}
            </p>
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}
