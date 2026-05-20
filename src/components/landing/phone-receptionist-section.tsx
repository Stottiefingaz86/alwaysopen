"use client";

import { BorderBeam } from "@/components/ui/border-beam";
import { Card, CardContent } from "@/components/ui/card";
import {
  FloatingBadge,
  PhoneRingPulse,
} from "@/components/landing/decorations";
import { FadeIn, Section, SectionHeader } from "@/components/ui/section";
import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Building2,
  CalendarCheck,
  Check,
  ChevronRight,
  Globe,
  Phone,
  PhoneIncoming,
  Sparkles,
} from "lucide-react";

const stepIcons = [PhoneIncoming, Sparkles, CalendarCheck] as const;

function PhoneFlowDiagram({
  labels,
  badge,
}: {
  labels: [string, string, string];
  badge: string;
}) {
  const nodes = [
    { label: labels[0], icon: Globe },
    { label: labels[1], icon: Phone },
    { label: labels[2], icon: Sparkles },
  ];

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
      </div>
      <motion.div
        className="mx-auto mt-3 flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-google-green shadow-google"
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.35 }}
      >
        <PhoneRingPulse />
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
  const steps = m.phone.steps.map((step, i) => ({
    ...step,
    icon: stepIcons[i] ?? PhoneIncoming,
  }));

  return (
    <Section id="phone-receptionist" background="gray">
      <SectionHeader
        eyebrow={m.phone.eyebrow}
        title={m.phone.title}
        subtitle={m.phone.subtitle}
      />

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_1.05fr] lg:gap-16">
        <FadeIn className="pt-5">
          <Card className="relative overflow-visible rounded-2xl border-google-gray-200 bg-white shadow-google-elevated">
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
              <PhoneRingPulse />
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
                  <p className="mt-1 font-mono text-2xl font-medium tracking-tight text-foreground md:text-[1.75rem]">
                    (01) 234 5678
                  </p>
                  <p className="mt-1 text-xs text-google-gray-500">{m.phone.lineCaption}</p>
                </div>
              </div>

              <PhoneFlowDiagram
                labels={[m.phone.flowGoogle, m.phone.flowLine, m.phone.flowBrand]}
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
          <ol className="space-y-6 md:space-y-8">
            {steps.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.1}>
                <li className="group relative flex gap-5 md:gap-6">
                  <div className="relative z-10 flex flex-col items-center">
                    <motion.span
                      className={cn(
                        "flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-white bg-pastel-blue text-google-blue shadow-google transition-shadow group-hover:shadow-google-float",
                        i === 1 && "bg-google-blue text-white"
                      )}
                      whileHover={{ scale: 1.05 }}
                    >
                      <step.icon className="size-5" strokeWidth={1.75} />
                    </motion.span>
                    <span className="mt-2 text-[10px] font-bold tabular-nums text-google-blue/80">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <article className="flex-1 rounded-2xl border border-google-gray-200 bg-white p-5 shadow-google-card transition-all group-hover:border-google-blue/30 group-hover:shadow-google-elevated md:p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-google-gray-400">
                      {m.phone.step} {i + 1}
                    </p>
                    <h3 className="mt-1.5 text-lg font-medium text-foreground md:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-google-gray-500">
                      {step.text}
                    </p>
                    {i === 1 && "badge" in step && step.badge && (
                      <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-pastel-blue px-2.5 py-1 text-xs font-medium text-google-blue">
                        <Sparkles className="size-3" />
                        {step.badge}
                      </p>
                    )}
                  </article>
                </li>
              </FadeIn>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
