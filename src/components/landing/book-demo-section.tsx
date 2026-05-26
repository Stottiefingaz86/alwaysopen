"use client";

import { BookDemoButton } from "@/components/landing/book-demo-button";
import { GoogleCalendarSchedulingButton } from "@/components/landing/google-calendar-scheduling-button";
import { CtaButton } from "@/components/landing/cta-button";
import { FadeIn } from "@/components/ui/section";
import { useLocale } from "@/components/providers/locale-provider";
import {
  getBookingScheduleEmbedUrl,
  getPublicBookingUrl,
} from "@/lib/booking";
import { getBookingMailto } from "@/lib/contact";
import { Clock, Video } from "lucide-react";

const detailIcons = [Clock, Video] as const;

export function BookDemoSection() {
  const { m, locale } = useLocale();
  const b = m.bookDemo;
  const bookingUrl = getPublicBookingUrl();
  const scheduleEmbedUrl = getBookingScheduleEmbedUrl();
  const mailto = getBookingMailto(locale);
  const canBook = Boolean(scheduleEmbedUrl || bookingUrl);

  return (
    <section className="relative overflow-hidden bg-white pb-16 pt-6 md:pb-24 md:pt-10">
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
        <FadeIn>
          <p className="text-sm font-medium uppercase tracking-wider text-google-blue">
            {b.eyebrow}
          </p>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {b.title}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-google-gray-500">
            {b.subtitle}
          </p>
        </FadeIn>

        <FadeIn delay={0.08}>
          <ul className="mt-10 space-y-3 text-left">
            {b.bullets.map((item, i) => {
              const Icon = detailIcons[i] ?? Clock;
              return (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-google-gray-200 bg-google-gray-50/60 px-4 py-3.5"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-google-blue shadow-sm">
                    <Icon className="size-4" strokeWidth={1.75} />
                  </span>
                  <span className="text-sm font-medium text-google-gray-700">{item}</span>
                </li>
              );
            })}
          </ul>
        </FadeIn>

        <FadeIn delay={0.14}>
          <div className="mt-10 flex flex-col items-center gap-3">
            {scheduleEmbedUrl ? (
              <div className="flex w-full max-w-sm justify-center rounded-2xl border border-google-gray-200 bg-white px-6 py-8 shadow-google-card">
                <GoogleCalendarSchedulingButton
                  scheduleUrl={scheduleEmbedUrl}
                  label={b.openCalendarCta}
                  className="min-h-12 w-full [&_iframe]:mx-auto"
                />
              </div>
            ) : canBook && bookingUrl ? (
              <BookDemoButton variant="primary" size="lg" className="w-full max-w-sm">
                {b.openCalendarCta}
              </BookDemoButton>
            ) : (
              <CtaButton href={mailto} size="lg" className="w-full max-w-sm">
                {b.emailFallback}
              </CtaButton>
            )}

            <p className="max-w-sm text-xs leading-relaxed text-google-gray-500">
              {canBook ? b.meetNote : b.notConfigured}
            </p>

            <CtaButton href="/#pricing" variant="secondary" size="default" className="mt-2">
              {b.viewPricing}
            </CtaButton>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
