"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FadeIn, Section } from "@/components/ui/section";
import { useLocale } from "@/components/providers/locale-provider";
import { getContactHref, getTalkOverCoffeeLink } from "@/lib/contact";
import {
  Calendar,
  Clock,
  Globe,
  MapPin,
  Phone,
  Star,
  type LucideIcon,
} from "lucide-react";

const faqIcons: Record<string, LucideIcon> = {
  "item-1": Phone,
  "item-2": Clock,
  "item-3": Calendar,
  "item-4": Star,
  "item-5": MapPin,
  "item-6": Globe,
};

export function FaqsSection() {
  const { m, locale } = useLocale();
  const contactHref = getContactHref(true);

  return (
    <Section id="faq" background="gray">
      <div className="mx-auto max-w-5xl px-0">
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          <FadeIn className="md:w-1/3">
            <div className="md:sticky md:top-24">
              <p className="text-sm font-medium uppercase tracking-wider text-google-blue">
                {m.faq.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-medium tracking-tight">{m.faq.title}</h2>
              <p className="mt-4 text-sm text-google-gray-500">
                {m.faq.introBefore}{" "}
                <a
                  href={contactHref}
                  className="font-medium text-google-blue hover:underline"
                >
                  {getTalkOverCoffeeLink(locale)}
                </a>{" "}
                {m.faq.introAfter}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.08} className="md:w-2/3">
            <Accordion className="w-full space-y-2">
              {m.faq.items.map((item) => {
                const Icon = faqIcons[item.id] ?? Phone;
                return (
                  <AccordionItem
                    key={item.id}
                    value={item.id}
                    className="rounded-xl border border-google-gray-200 bg-white px-4 shadow-google last:border-b"
                  >
                    <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                      <span className="flex items-center gap-3 text-left text-base">
                        <Icon className="size-4 shrink-0 text-google-blue" />
                        {item.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-sm text-google-gray-500">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </FadeIn>
        </div>
      </div>
    </Section>
  );
}
