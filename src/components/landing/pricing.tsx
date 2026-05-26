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
import { getBookingMailto } from "@/lib/contact";
import type { Messages } from "@/lib/i18n/messages/en";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const PLAN_KEYS = ["receptionist", "bundle", "custom"] as const;
type PlanKey = (typeof PLAN_KEYS)[number];

type PlanCopy = Messages["pricing"]["plans"][PlanKey];

function PlanPrice({
  label,
  value,
  isCustom,
  customLabel,
}: {
  label: string;
  value: string;
  isCustom: boolean;
  customLabel: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-google-gray-500">
        {label}
      </p>
      <p className="mt-0.5 text-base font-medium text-foreground">
        {isCustom ? customLabel : value}
      </p>
    </div>
  );
}

export function PricingSection() {
  const { m, locale } = useLocale();
  const p = m.pricing;
  const mailto = getBookingMailto(locale);

  const plans = PLAN_KEYS.map((key, i) => ({
    key,
    plan: p.plans[key],
    popular: key === "bundle",
    delay: i * 0.08,
  }));

  const ctaLabel = (cta: PlanCopy["cta"]) =>
    cta === "contactUs" ? p.contactUs : p.bookDemo;

  return (
    <Section id="pricing" background="pattern">
      <div className="mx-auto max-w-6xl px-0">
        <FadeIn>
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-google-blue">
              {p.eyebrow}
            </p>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              {p.title}
            </h2>
            <p className="text-base leading-relaxed text-google-gray-500 md:text-lg">
              {p.subtitle}
            </p>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-google-gray-500">
              {p.flexNote}
            </p>
          </div>
        </FadeIn>

        <div className="mt-8 grid gap-6 pt-3 md:mt-10 md:grid-cols-3 md:items-stretch">
          {plans.map(({ key, plan, popular, delay }) => {
            const isCustom = key === "custom";

            return (
              <FadeIn key={key} delay={delay} className="min-h-0">
                <Card
                  className={cn(
                    "relative flex h-full flex-col overflow-visible border-google-gray-200 bg-white shadow-google-card",
                    popular && "z-[1] border-google-green/40 shadow-google-elevated"
                  )}
                >
                  {popular ? (
                    <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-google-green px-3 py-1 text-[10px] font-semibold tracking-wider text-white shadow-google">
                      {p.popular}
                    </span>
                  ) : null}
                  <CardHeader className="space-y-4 pb-4 pt-0">
                    <div>
                      <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="mt-2 text-sm leading-relaxed text-google-gray-500">
                        {plan.description}
                      </CardDescription>
                    </div>

                    <div className="grid grid-cols-2 gap-3 rounded-xl border border-google-gray-100 bg-google-gray-50/80 p-3">
                      <PlanPrice
                        label={p.setupLabel}
                        value={plan.setup}
                        isCustom={isCustom}
                        customLabel={p.customPrice}
                      />
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-google-gray-500">
                          {p.monthlyLabel}
                        </p>
                        {isCustom ? (
                          <p className="mt-0.5 text-base font-medium text-foreground">
                            {p.customPrice}
                          </p>
                        ) : (
                          <div>
                            <p className="mt-0.5 text-2xl font-semibold tracking-tight text-foreground">
                              {plan.monthly}
                              <span className="text-sm font-normal text-google-gray-500">
                                {p.perMonth}
                              </span>
                            </p>
                            <p className="mt-0.5 text-[10px] text-google-gray-400">
                              {p.excludesVat}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="rounded-lg border border-google-gray-100 bg-white px-3 py-2 text-sm text-google-gray-600">
                      <span className="font-medium text-google-gray-700">
                        {isCustom ? p.includedLabel : p.includedMinutesLabel}:{" "}
                      </span>
                      {isCustom ? p.customPrice : plan.minutes}
                    </p>

                    {plan.highlight ? (
                      <p className="rounded-lg border border-google-green/25 bg-google-green/5 px-3 py-2 text-sm font-medium leading-snug text-google-green">
                        {plan.highlight}
                      </p>
                    ) : null}

                    <CtaButton
                      href={mailto}
                      variant="primary"
                      size="default"
                      className="w-full"
                    >
                      {ctaLabel(plan.cta)}
                    </CtaButton>
                  </CardHeader>

                  <CardContent className="flex flex-1 flex-col space-y-4 pt-0">
                    <hr className="border-dashed border-google-gray-200" />
                    <ul className="flex flex-1 flex-col gap-2.5 text-sm text-google-gray-700">
                      {plan.features.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Check className="mt-0.5 size-3.5 shrink-0 text-google-blue" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    {plan.overage ? (
                      <p className="text-xs text-google-gray-500">
                        <span className="font-medium text-google-gray-600">
                          {p.overageLabel}:{" "}
                        </span>
                        {plan.overage}
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={0.2}>
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-google-gray-500">
            {p.setupNote}
          </p>
        </FadeIn>

        <FadeIn delay={0.24} className="mt-12 md:mt-14">
          <h3 className="text-center text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            {p.addOnsTitle}
          </h3>
          <div className="mt-6 overflow-hidden rounded-2xl border border-google-gray-200 bg-white shadow-google-card">
            <ul className="divide-y divide-google-gray-100">
              {p.addOns.map((addon) => (
                <li
                  key={addon.title}
                  className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4"
                >
                  <span className="font-medium text-foreground">{addon.title}</span>
                  <span className="text-sm font-medium text-google-blue sm:shrink-0">
                    {addon.price}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-relaxed text-google-gray-500">
            {p.overageNote}
          </p>
        </FadeIn>
      </div>
    </Section>
  );
}
