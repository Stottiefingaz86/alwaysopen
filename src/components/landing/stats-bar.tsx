"use client";

import { FadeIn } from "@/components/ui/section";

const stats = [
  { value: "24/7", label: "Phone line coverage" },
  { value: "3×", label: "More booking capture" },
  { value: "100+", label: "Reviews read per report" },
];

const quote = {
  text: "We stopped losing evening calls. Bookings come through while we're still with clients. The phone just works now.",
  author: "Sarah M., salon owner",
};

export function StatsBar() {
  return (
    <section className="border-y border-google-gray-200 bg-white py-16 md:py-24">
      <div className="mx-auto max-w-5xl space-y-10 px-4 sm:px-6 md:space-y-14">
        <FadeIn>
          <div className="max-w-xl space-y-4">
            <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              Built for how local customers actually call you
            </h2>
            <p className="text-google-gray-500">
              Your real business number, answered around the clock, plus monthly
              reports our team writes from your reviews and feedback.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-10 sm:grid-cols-2 md:gap-16 lg:gap-24">
          <FadeIn delay={0.06}>
            <div>
              <p className="text-sm leading-relaxed text-google-gray-500">
                Salons, clinics, trades and shops use AlwaysOpen on the line
                customers already trust, not a separate app or chat widget.
              </p>
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
                &ldquo;{quote.text}&rdquo;
              </p>
              <cite className="mt-5 block text-sm font-medium not-italic text-foreground">
                {quote.author}
              </cite>
            </blockquote>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
