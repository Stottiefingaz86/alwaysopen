"use client";

import { CtaButton } from "@/components/landing/cta-button";
import { FadeIn } from "@/components/ui/section";
import { DotGrid } from "@/components/landing/decorations";
import { cn } from "@/lib/utils";
import { AgentShowcase } from "@/components/landing/agent-showcase";
import { useLocale } from "@/components/providers/locale-provider";
import { BookDemoButton } from "@/components/landing/book-demo-button";
import { getContactHref, getTalkOverCoffeeCta } from "@/lib/contact";
import { Check } from "lucide-react";

export function Hero() {
  const { m, locale } = useLocale();
  const contactHref = getContactHref(true);

  return (
    <section className="relative overflow-hidden bg-white pb-6 pt-4 md:pb-12 md:pt-8">
      <DotGrid className="opacity-35" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_1.05fr] lg:items-center lg:gap-10">
          <div className="relative z-10 lg:pt-2">
            <FadeIn>
              <h1 className="max-w-xl text-balance text-[1.75rem] font-normal leading-[1.2] tracking-tight text-foreground sm:text-[2.125rem] lg:text-[2.5rem]">
                {m.hero.titleLines.map((line, index) => (
                  <span
                    key={line}
                    className={cn(
                      "block",
                      index === m.hero.titleLines.length - 1 && "text-google-blue"
                    )}
                  >
                    {line}
                  </span>
                ))}
              </h1>
            </FadeIn>

            <FadeIn delay={0.08}>
              <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-google-gray-500 sm:text-base">
                {m.hero.subtitle}
              </p>
            </FadeIn>

            <FadeIn delay={0.09}>
              <ul className="mt-4 flex flex-col gap-2">
                {m.hero.bullets.map((item) => (
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
                <CtaButton href={contactHref} size="lg">
                  {getTalkOverCoffeeCta(locale)}
                </CtaButton>
                <BookDemoButton variant="secondary" size="lg">
                  {m.hero.bookDemo}
                </BookDemoButton>
              </div>
              <p className="mt-3 max-w-md text-sm text-google-gray-500">{m.hero.ctaMicro}</p>
            </FadeIn>
          </div>

          <AgentShowcase />
        </div>
      </div>
    </section>
  );
}
