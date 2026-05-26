"use client";

import { SectionSeparator } from "@/components/landing/section-separator";
import { FadeIn } from "@/components/ui/section";
import { useLocale } from "@/components/providers/locale-provider";
import {
  statsSeparatorHeight,
  statsSeparatorSrc,
  statsSeparatorWidth,
} from "@/lib/brand-assets";

export function StatsBar() {
  const { m } = useLocale();
  const stats = [
    { value: m.stats.stat1Value, label: m.stats.stat1Label },
    { value: m.stats.stat2Value, label: m.stats.stat2Label },
    { value: m.stats.stat3Value, label: m.stats.stat3Label },
  ];

  return (
    <>
    <section className="flow-root overflow-visible border-t border-google-gray-200 bg-white pt-16 md:pt-24">
      <div className="mx-auto max-w-5xl space-y-10 px-4 pb-0 sm:px-6 md:space-y-14">
        <FadeIn>
          <div className="max-w-xl space-y-4">
            <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              {m.stats.title}
            </h2>
            <p className="text-google-gray-500">{m.stats.subtitle}</p>
          </div>
        </FadeIn>

        <div className="grid gap-10 sm:grid-cols-2 md:gap-16 lg:gap-24">
          <FadeIn delay={0.06}>
            <div>
              <p className="text-sm leading-relaxed text-google-gray-500">{m.stats.body}</p>
              <div className="mt-10 grid grid-cols-2 gap-6 md:mt-12">
                {stats.map((stat) => (
                  <div key={stat.label} className="space-y-2">
                    <div className="bg-linear-to-r from-google-gray-700 to-google-blue bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                      {stat.value}
                    </div>
                    <p className="text-sm text-google-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.12}>
            <blockquote className="border-l-4 border-google-blue pl-5">
              <p className="text-lg leading-relaxed text-google-gray-700">
                &ldquo;{m.stats.quote}&rdquo;
              </p>
              <cite className="mt-5 block text-sm font-medium not-italic text-foreground">
                {m.stats.quoteAuthor}
              </cite>
            </blockquote>
          </FadeIn>
        </div>
      </div>
    </section>

    <SectionSeparator
      src={statsSeparatorSrc}
      width={statsSeparatorWidth}
      height={statsSeparatorHeight}
      className="bg-white"
    />
    </>
  );
}
