"use client";

import { FadeIn, Section, SectionHeader } from "@/components/ui/section";
import {
  Calendar,
  Mail,
  FileBarChart,
  Lightbulb,
  Phone,
  Star,
  MessageCircle,
  Sparkles,
} from "lucide-react";

const stages = [
  {
    label: "In",
    items: [
      { text: "Calls to your number", icon: Phone },
      { text: "Customer reviews", icon: Star },
      { text: "Enquiries", icon: MessageCircle },
    ],
  },
  {
    label: "AlwaysOpen",
    highlight: true,
    items: [{ text: "AI answers, books & analyses", icon: Sparkles }],
  },
  {
    label: "Out",
    items: [
      { text: "Bookings captured", icon: Calendar },
      { text: "Reviews analysed", icon: Star },
      { text: "Patterns surfaced", icon: FileBarChart },
    ],
  },
  {
    label: "You get",
    items: [
      { text: "Calendar updates", icon: Calendar },
      { text: "Email confirmations", icon: Mail },
      { text: "Monthly VoC reports", icon: FileBarChart },
      { text: "Action recommendations", icon: Lightbulb },
    ],
  },
];

export function PipelineSection() {
  return (
    <Section background="pattern">
      <SectionHeader
        eyebrow="How it works"
        title="How AlwaysOpen works for your business"
        subtitle="From every customer touchpoint to clear actions — in one connected flow."
      />

      <FadeIn>
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          {stages.map((stage, i) => (
            <div key={stage.label} className="flex w-full flex-col items-center">
              <div
                className={`w-full rounded-2xl border px-6 py-5 shadow-google-card ${
                  stage.highlight
                    ? "border-google-blue/30 bg-pastel-blue text-center"
                    : "border-google-gray-200 bg-white"
                }`}
              >
                <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-google-gray-400">
                  {stage.label}
                </p>
                <ul
                  className={
                    stage.highlight
                      ? "flex justify-center"
                      : "flex flex-wrap justify-center gap-2"
                  }
                >
                  {stage.items.map((item) => (
                    <li
                      key={item.text}
                      className={
                        stage.highlight
                          ? "flex flex-col items-center gap-2"
                          : "inline-flex items-center gap-2 rounded-full border border-google-gray-200 bg-google-gray-50 px-3 py-1.5 text-sm text-google-gray-700"
                      }
                    >
                      {!stage.highlight && (
                        <item.icon className="size-3.5 text-google-blue" />
                      )}
                      {stage.highlight && (
                        <span className="flex size-12 items-center justify-center rounded-full bg-google-blue text-white">
                          <item.icon className="size-6" />
                        </span>
                      )}
                      <span className={stage.highlight ? "font-medium" : undefined}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              {i < stages.length - 1 && (
                <div className="my-3 h-8 w-px bg-google-gray-300" aria-hidden />
              )}
            </div>
          ))}
        </div>
      </FadeIn>
    </Section>
  );
}
