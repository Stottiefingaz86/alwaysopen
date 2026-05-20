"use client";

import { FadeIn, Section, SectionHeader } from "@/components/ui/section";
import { BorderBeam } from "@/components/ui/border-beam";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Calendar,
  ChevronDown,
  FileBarChart,
  Lightbulb,
  Mail,
  MessageCircle,
  Phone,
  Sparkles,
  Star,
  type LucideIcon,
} from "lucide-react";

type StageItem = { text: string; icon: LucideIcon };

type Stage = {
  label: string;
  items: StageItem[];
  highlight?: boolean;
};

const stages: Stage[] = [
  {
    label: "In",
    items: [
      { text: "Calls to your number", icon: Phone },
      { text: "Customer reviews", icon: Star },
      { text: "Enquiries", icon: MessageCircle },
    ],
  },
  {
    label: "RingsAway",
    highlight: true,
    items: [{ text: "AI answers & books", icon: Sparkles }],
  },
  {
    label: "Out",
    items: [
      { text: "Bookings captured", icon: Calendar },
      { text: "Feedback report prepared", icon: Star },
      { text: "Google plan & actions", icon: FileBarChart },
    ],
  },
  {
    label: "You get",
    items: [
      { text: "Calendar updates", icon: Calendar },
      { text: "Email confirmations", icon: Mail },
      { text: "Monthly feedback report", icon: FileBarChart },
      { text: "Google Business strategy", icon: Lightbulb },
    ],
  },
];

function FlowConnector({ index }: { index: number }) {
  return (
    <div
      className="relative flex h-16 items-center justify-center md:h-20"
      aria-hidden
    >
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-google-gray-200" />
      <motion.div
        className="absolute left-1/2 size-2 -translate-x-1/2 rounded-full bg-google-blue shadow-[0_0_12px_rgba(59,127,212,0.5)]"
        animate={{ y: ["-24px", "24px"], opacity: [0.2, 1, 0.2] }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.35,
        }}
      />
      <motion.div
        className="relative z-10 flex size-9 items-center justify-center rounded-full border border-google-blue/25 bg-white shadow-google"
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
      >
        <ChevronDown className="size-4 text-google-blue" strokeWidth={2} />
      </motion.div>
    </div>
  );
}

function StageNode({ label, highlight }: { label: string; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "absolute left-0 top-6 z-10 flex size-10 items-center justify-center rounded-full border-2 border-white shadow-google md:top-7",
        highlight
          ? "bg-google-blue text-white ring-4 ring-pastel-blue"
          : "bg-white text-google-blue ring-2 ring-google-gray-100"
      )}
    >
      <span className="text-[10px] font-bold uppercase tracking-wide">
        {highlight ? "RA" : label.charAt(0)}
      </span>
    </div>
  );
}

function StageCard({ stage, index }: { stage: Stage; index: number }) {
  const isHighlight = stage.highlight;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative pl-14 md:pl-16"
    >
      <StageNode label={stage.label} highlight={isHighlight} />

      <div
        className={cn(
          "relative w-full rounded-2xl border px-5 py-5 shadow-google-card md:px-6 md:py-6",
          isHighlight
            ? "overflow-hidden border-google-blue/35 bg-pastel-blue/60"
            : "border-google-gray-200 bg-white"
        )}
      >
        {isHighlight && (
          <BorderBeam
            size={100}
            duration={10}
            colorFrom="#3b7fd4"
            colorTo="#4a9b73"
            className="from-transparent via-google-blue/50 to-transparent"
          />
        )}

        <p
          className={cn(
            "mb-4 text-xs font-semibold uppercase tracking-widest",
            isHighlight ? "text-google-blue" : "text-google-gray-400"
          )}
        >
          {stage.label}
        </p>

        {isHighlight ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <motion.span
              className="flex size-14 items-center justify-center rounded-full bg-google-blue text-white shadow-google-elevated"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="size-7" strokeWidth={1.5} />
            </motion.span>
            <p className="max-w-sm text-base font-medium leading-snug text-google-gray-800">
              {stage.items[0].text}
            </p>
          </div>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {stage.items.map((item, i) => (
              <motion.li
                key={item.text}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 + i * 0.05 }}
                className="inline-flex items-center gap-2 rounded-full border border-google-gray-200 bg-google-gray-50/80 px-3 py-1.5 text-sm text-google-gray-700"
              >
                <item.icon className="size-3.5 shrink-0 text-google-blue" strokeWidth={1.75} />
                {item.text}
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

export function PipelineSection() {
  return (
    <Section background="pattern">
      <SectionHeader
        eyebrow="How it works"
        title="How RingsAway works for your business"
        subtitle="From every customer touchpoint to clear actions, in one connected flow."
      />

      <FadeIn>
        <div className="relative mx-auto max-w-2xl">
          {/* Backbone line */}
          <div
            className="absolute bottom-8 left-5 top-8 w-px bg-linear-to-b from-google-gray-200 via-google-blue/50 to-google-gray-200 md:left-5"
            aria-hidden
          />

          <div className="relative space-y-0">
            {stages.map((stage, i) => (
              <div key={stage.label}>
                <StageCard stage={stage} index={i} />
                {i < stages.length - 1 && <FlowConnector index={i} />}
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}
