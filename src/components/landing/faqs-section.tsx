"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FadeIn, Section } from "@/components/ui/section";
import { BOOK_MEETING_MAILTO } from "@/lib/contact";
import {
  Calendar,
  Clock,
  Globe,
  Phone,
  Star,
  type LucideIcon,
} from "lucide-react";

const faqItems: {
  id: string;
  icon: LucideIcon;
  question: string;
  answer: string;
}[] = [
  {
    id: "item-1",
    icon: Phone,
    question: "Does it use my existing business number?",
    answer:
      "Yes. Customers dial the same number they already use — on Google, your website, or shop signage. AlwaysOpen answers that line; it's not a separate app or chat widget.",
  },
  {
    id: "item-2",
    icon: Clock,
    question: "Is it really available 24/7?",
    answer:
      "Your AI receptionist answers whenever you can't — evenings, weekends, and busy periods. You choose when to hand off to a person.",
  },
  {
    id: "item-3",
    icon: Calendar,
    question: "How do bookings reach my calendar?",
    answer:
      "Confirmed appointments sync to Google Calendar (and more on higher plans). You and your team get email confirmations with caller details.",
  },
  {
    id: "item-4",
    icon: Star,
    question: "What does review intelligence include?",
    answer:
      "We analyse your Google reviews for themes — complaints, praise, sentiment — and send a monthly action plan so you know what to fix first.",
  },
  {
    id: "item-5",
    icon: Globe,
    question: "Who is AlwaysOpen for?",
    answer:
      "Local businesses that live on the phone: salons, clinics, trades, shops, and practices that lose enquiries when no one picks up. We're based in Manilva and support owners in English and Spanish.",
  },
];

export function FaqsSection() {
  return (
    <Section id="faq" background="gray">
      <div className="mx-auto max-w-5xl px-0">
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          <FadeIn className="md:w-1/3">
            <div className="md:sticky md:top-24">
              <p className="text-sm font-medium uppercase tracking-wider text-google-blue">
                FAQ
              </p>
              <h2 className="mt-3 text-3xl font-medium tracking-tight">
                Common questions
              </h2>
              <p className="mt-4 text-sm text-google-gray-500">
                Can&apos;t find what you need?{" "}
                <a
                  href={BOOK_MEETING_MAILTO}
                  className="font-medium text-google-blue hover:underline"
                >
                  Book a meeting
                </a>{" "}
                and we&apos;ll walk you through setup.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.08} className="md:w-2/3">
            <Accordion className="w-full space-y-2">
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="rounded-xl border border-google-gray-200 bg-white px-4 shadow-google last:border-b"
                >
                  <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                    <span className="flex items-center gap-3 text-left text-base">
                      <item.icon className="size-4 shrink-0 text-google-blue" />
                      {item.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm text-google-gray-500">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>
        </div>
      </div>
    </Section>
  );
}
