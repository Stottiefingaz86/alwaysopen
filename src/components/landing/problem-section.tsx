"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FadeIn, Section } from "@/components/ui/section";
import { MessageSquareOff, PhoneMissed, Workflow } from "lucide-react";

const problems = [
  {
    title: "Missed enquiries",
    text: "Customers call while staff are busy — and go to someone who answers.",
    icon: PhoneMissed,
  },
  {
    title: "Unseen customer feedback",
    text: "Reviews contain valuable insight but rarely get analysed into action.",
    icon: MessageSquareOff,
  },
  {
    title: "Poor follow-up",
    text: "Leads and opportunities fall through the cracks after the first contact.",
    icon: Workflow,
  },
];

export function ProblemSection() {
  return (
    <Section id="problems" background="pattern">
      <FadeIn>
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-google-blue">
            The problem
          </p>
          <h2 className="text-balance text-3xl font-medium tracking-tight md:text-4xl">
            Local businesses lose customers in two ways
          </h2>
          <p className="text-google-gray-500">
            Missed calls, ignored reviews, and follow-up that never happens.
          </p>
        </div>
      </FadeIn>

      <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
        {problems.map((card, i) => (
          <FadeIn key={card.title} delay={i * 0.08}>
            <Card className="h-full border-google-gray-200 shadow-google-card transition-shadow hover:shadow-google-elevated">
              <CardContent className="flex h-full flex-col p-7">
                <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-pastel-blue text-google-blue">
                  <card.icon className="size-7" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-medium">{card.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-google-gray-500">
                  {card.text}
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
