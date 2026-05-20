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
import { useLocale } from "@/components/providers/locale-provider";
import {
  getBookingMailto,
  getTalkOverCoffeeCta,
  getTalkOverCoffeeLink,
} from "@/lib/contact";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const planKeys = ["starter", "growth", "premium"] as const;

export function PricingSection() {
  const { m, locale } = useLocale();
  const mailto = getBookingMailto(locale);

  const plans = planKeys.map((key, i) => ({
    key,
    name: m.pricing.plans[key].name,
    setup: m.pricing.prices[key].setup,
    monthly: m.pricing.prices[key].monthly,
    minutes: m.pricing.minutes[key],
    overage: m.pricing.overageRates[key],
    includes: m.pricing.plans[key].includes,
    popular: key === "growth",
    delay: i * 0.08,
  }));

  return (
    <Section id="pricing" background="pattern">
      <div className="mx-auto max-w-6xl px-0">
        <FadeIn>
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-google-blue">
              {m.pricing.eyebrow}
            </p>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              {m.pricing.title}
            </h2>
            <p className="text-google-gray-500">{m.pricing.subtitle}</p>
            <p className="text-sm font-medium text-google-gray-600">
              {m.pricing.cancelAnytime}
            </p>
          </div>
        </FadeIn>

        <div className="mt-10 grid gap-6 pt-4 md:mt-16 md:grid-cols-3 md:items-stretch">
          {plans.map((plan) => (
            <FadeIn key={plan.key} delay={plan.delay} className="min-h-0">
              <Card
                className={cn(
                  "relative flex h-full flex-col overflow-visible border-google-gray-200 shadow-google-card",
                  plan.popular && "z-[1] border-google-blue shadow-google-elevated md:-mt-2"
                )}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-google-blue px-3 py-1 text-xs font-medium text-white shadow-google">
                    {m.pricing.popular}
                  </span>
                )}
                <CardHeader className={cn("pb-4", plan.popular && "pt-7")}>
                  <CardTitle className="text-sm font-medium uppercase tracking-wider text-google-gray-500">
                    {plan.name}
                  </CardTitle>
                  <p className="mt-3 text-sm text-google-gray-500">
                    {m.pricing.setup}{" "}
                    <span className="text-lg font-medium text-foreground">{plan.setup}</span>
                  </p>
                  <span className="mt-2 block text-3xl font-semibold tracking-tight">
                    {plan.monthly}
                    <span className="text-base font-normal text-google-gray-500">
                      {m.pricing.perMonth}
                    </span>
                  </span>
                  <CardDescription className="mt-3 rounded-lg bg-google-gray-50 px-3 py-2 text-sm">
                    {plan.minutes}
                  </CardDescription>
                  <CtaButton
                    href={mailto}
                    variant={plan.popular ? "primary" : "secondary"}
                    size="default"
                    className="mt-4 w-full"
                  >
                    {getTalkOverCoffeeCta(locale)}
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
                    {m.pricing.overage} {plan.overage}
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2} className="mt-8 text-center">
          <CtaButton href={mailto} variant="secondary">
            {m.pricing.questions} {getTalkOverCoffeeLink(locale)}
          </CtaButton>
        </FadeIn>
      </div>
    </Section>
  );
}
