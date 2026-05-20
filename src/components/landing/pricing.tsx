"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CtaButton } from "@/components/landing/cta-button";
import { FadeIn, Section } from "@/components/ui/section";
import { BOOK_MEETING_MAILTO } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    setup: "€750",
    monthly: "€199",
    minutes: "150 minutes/month",
    overage: "€0.35/minute",
    popular: false,
    includes: [
      "AI receptionist",
      "Booking requests",
      "Cancellation requests",
      "Google Calendar",
      "Email confirmations",
      "FAQ knowledgebase",
      "Basic monthly review summary",
    ],
  },
  {
    name: "Growth",
    setup: "€1250",
    monthly: "€399",
    minutes: "400 minutes/month",
    overage: "€0.30/minute",
    popular: true,
    includes: [
      "Everything Starter",
      "Better knowledgebase",
      "Booking automation",
      "Calendar links",
      "Monthly customer feedback report",
      "Google Business action plan",
      "Monthly review call",
    ],
  },
  {
    name: "Premium",
    setup: "€2500",
    monthly: "€799",
    minutes: "1000 minutes/month",
    overage: "€0.25/minute",
    popular: false,
    includes: [
      "Everything Growth",
      "Multi-calendar support",
      "In-depth feedback report + Google strategy",
      "Competitor benchmarking",
      "Quarterly CX audit",
      "Strategy calls",
      "Priority support",
    ],
  },
];

export function PricingSection() {
  return (
    <Section id="pricing" background="pattern">
      <div className="mx-auto max-w-6xl px-0">
        <FadeIn>
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-google-blue">
              Pricing
            </p>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              Simple pricing
            </h2>
            <p className="text-google-gray-500">
              Three plans. Clear outcomes. No surprises.
            </p>
          </div>
        </FadeIn>

        <div className="mt-10 grid gap-6 pt-4 md:mt-16 md:grid-cols-3 md:items-stretch">
          {plans.map((plan, i) => (
            <FadeIn key={plan.name} delay={i * 0.08} className="min-h-0">
              <Card
                className={cn(
                  "relative flex h-full flex-col overflow-visible border-google-gray-200 shadow-google-card",
                  plan.popular && "z-[1] border-google-blue shadow-google-elevated md:-mt-2"
                )}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-google-blue px-3 py-1 text-xs font-medium text-white shadow-google">
                    Most popular
                  </span>
                )}
                <CardHeader className={cn("pb-4", plan.popular && "pt-7")}>
                  <CardTitle className="text-sm font-medium uppercase tracking-wider text-google-gray-500">
                    {plan.name}
                  </CardTitle>
                  <p className="mt-3 text-sm text-google-gray-500">
                    Setup{" "}
                    <span className="text-lg font-medium text-foreground">
                      {plan.setup}
                    </span>
                  </p>
                  <span className="mt-2 block text-3xl font-semibold tracking-tight">
                    {plan.monthly}
                    <span className="text-base font-normal text-google-gray-500">
                      /mo
                    </span>
                  </span>
                  <CardDescription className="mt-3 rounded-lg bg-google-gray-50 px-3 py-2 text-sm">
                    {plan.minutes}
                  </CardDescription>
                  <CtaButton
                    href={BOOK_MEETING_MAILTO}
                    variant={plan.popular ? "primary" : "secondary"}
                    size="default"
                    className="mt-4 w-full"
                  >
                    Book Meeting
                  </CtaButton>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col space-y-4">
                  <hr className="border-dashed border-google-gray-200" />
                  <ul className="flex flex-1 flex-col gap-2.5 text-sm">
                    {plan.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-google-blue" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-google-gray-500">
                    Overage: {plan.overage}
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2} className="mt-8 text-center">
          <CtaButton href={BOOK_MEETING_MAILTO} variant="secondary">
            Questions? Book a call
          </CtaButton>
        </FadeIn>
      </div>
    </Section>
  );
}
