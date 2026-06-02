"use client";

import { CtaButton } from "@/components/landing/cta-button";
import { FadeIn } from "@/components/ui/section";
import { useLocale } from "@/components/providers/locale-provider";
import { BookDemoButton } from "@/components/landing/book-demo-button";
import { getContactHref, getTalkOverCoffeeCta } from "@/lib/contact";

export function FinalCta() {
  const { m, locale } = useLocale();
  const contactHref = getContactHref(true);

  return (
    <section id="final-cta" className="py-16 md:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-balance text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
              {m.finalCta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-google-gray-500">
              {m.finalCta.subtitle}
            </p>

            <div className="mx-auto mt-10 flex max-w-md flex-col items-center justify-center gap-4 sm:flex-row">
              <CtaButton href={contactHref} size="lg" analyticsLocation="final_cta">
                {getTalkOverCoffeeCta(locale)}
              </CtaButton>
              <BookDemoButton variant="secondary" size="lg" analyticsLocation="final_cta">
                {m.finalCta.bookDemo}
              </BookDemoButton>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
