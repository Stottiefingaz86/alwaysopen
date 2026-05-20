"use client";

import { CtaButton } from "@/components/landing/cta-button";
import { FadeIn } from "@/components/ui/section";
import { BOOK_MEETING_MAILTO } from "@/lib/contact";
import { Mail, SendHorizonal } from "lucide-react";

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
              Your phone line answered around the clock — capture more enquiries,
              improve reviews, and grow your business.
            </p>

            <div className="mx-auto mt-10 flex max-w-md flex-col items-center justify-center gap-4 sm:flex-row">
              <CtaButton href={BOOK_MEETING_MAILTO} size="lg">
                Book Meeting
              </CtaButton>
              <CtaButton href="#pricing" variant="secondary" size="lg">
                View pricing
              </CtaButton>
            </div>

            <form
              action={BOOK_MEETING_MAILTO}
              className="mx-auto mt-10 max-w-sm lg:mt-12"
            >
              <div className="relative grid grid-cols-[1fr_auto] items-center rounded-2xl border border-google-gray-200 bg-white pr-2 shadow-google-card focus-within:ring-2 focus-within:ring-google-blue/30">
                <Mail className="pointer-events-none absolute inset-y-0 left-4 my-auto size-5 text-google-gray-400" />
                <input
                  name="email"
                  placeholder="Your email for a callback"
                  className="h-12 w-full bg-transparent pl-12 text-sm focus:outline-none"
                  type="email"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="btn-primary mr-1 inline-flex min-h-10 items-center justify-center rounded-xl px-4 text-sm font-medium"
                  aria-label="Request callback"
                >
                  <span className="hidden md:inline">Get in touch</span>
                  <SendHorizonal className="size-4 md:hidden" strokeWidth={2} />
                </button>
              </div>
            </form>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
