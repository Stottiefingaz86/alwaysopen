"use client";

import { CtaButton } from "@/components/landing/cta-button";
import { FadeIn } from "@/components/ui/section";
import { DotGrid, PhoneRingPulse } from "@/components/landing/decorations";
import { AgentShowcase } from "@/components/landing/agent-showcase";
import { BOOK_MEETING_MAILTO } from "@/lib/contact";
import { Check } from "lucide-react";

const bullets = [
  "Answer your real business number 24/7",
  "Capture bookings automatically",
  "Monthly customer feedback reports (VoC)",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pb-6 pt-4 md:pb-12 md:pt-8">
      <DotGrid className="opacity-35" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_1.05fr] lg:items-center lg:gap-10">
          <div className="relative z-10 lg:pt-2">
            <FadeIn>
              <p className="mb-4 inline-flex items-center gap-2 text-sm text-google-gray-500">
                <PhoneRingPulse />
                For salons, clinics, trades &amp; local shops
              </p>
            </FadeIn>

            <FadeIn delay={0.05}>
              <h1 className="max-w-lg text-balance text-[1.75rem] font-normal leading-[1.15] tracking-tight text-foreground sm:text-[2.125rem] lg:text-[2.5rem]">
                Your phone line, answered{" "}
                <span className="text-google-blue">24/7</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.08}>
              <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-google-gray-500 sm:text-base">
                Customers ring your normal business number. AlwaysOpen picks up and
                books appointments. Each month we prepare a customer feedback
                report (VoC): what people are saying, what to fix, and how to act on
                Google.
              </p>
            </FadeIn>

            <FadeIn delay={0.09}>
              <ul className="mt-4 flex flex-col gap-2">
                {bullets.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-google-gray-700"
                  >
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-google-green"
                      strokeWidth={2.5}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <CtaButton href={BOOK_MEETING_MAILTO} size="lg">
                  Book Meeting
                </CtaButton>
                <CtaButton href="#pricing" variant="secondary" size="lg">
                  View pricing
                </CtaButton>
              </div>
            </FadeIn>
          </div>

          <AgentShowcase />
        </div>
      </div>
    </section>
  );
}
