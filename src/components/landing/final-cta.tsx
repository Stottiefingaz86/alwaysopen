import { CtaButton } from "@/components/landing/cta-button";
import { FadeIn } from "@/components/ui/section";
import { BOOK_MEETING_MAILTO, TALK_OVER_COFFEE_CTA } from "@/lib/contact";

export function FinalCta() {
  return (
    <section className="py-16 md:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-balance text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
              One missed call can pay for itself
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-google-gray-500">
              Your phone line answered around the clock. Capture more enquiries,
              improve reviews, and grow your business.
            </p>

            <div className="mx-auto mt-10 flex max-w-md flex-col items-center justify-center gap-4 sm:flex-row">
              <CtaButton href={BOOK_MEETING_MAILTO} size="lg">
                {TALK_OVER_COFFEE_CTA}
              </CtaButton>
              <CtaButton href="#pricing" variant="secondary" size="lg">
                View pricing
              </CtaButton>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
