"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BorderBeam } from "@/components/ui/border-beam";
import {
  ReviewCardMock,
  StorefrontIllustration,
} from "@/components/landing/illustrations";
import { FadeIn } from "@/components/ui/section";
import {
  BarChart3,
  Heart,
  ListChecks,
  PenLine,
  ThumbsDown,
  ThumbsUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type PanelKey = "complaints" | "praise" | "sentiment" | "competitors" | "suggestions" | "actions";

const panels: Record<
  PanelKey,
  { title: string; icon: typeof ThumbsDown; description: string }
> = {
  complaints: {
    title: "Top complaints",
    icon: ThumbsDown,
    description:
      "See what customers complain about most — wait times, pricing, staff — so you can fix the right thing first.",
  },
  praise: {
    title: "Top praise themes",
    icon: ThumbsUp,
    description:
      "Double down on what people love. Spot the phrases that show up in five-star reviews.",
  },
  sentiment: {
    title: "Customer sentiment",
    icon: Heart,
    description:
      "Track whether mood is improving month to month, not just your star average.",
  },
  competitors: {
    title: "Competitor comparison",
    icon: Users,
    description:
      "Understand why customers mention rivals — and where you're already winning.",
  },
  suggestions: {
    title: "Review suggestions",
    icon: PenLine,
    description:
      "Draft responses that sound like you, tuned to each review's tone and topic.",
  },
  actions: {
    title: "Monthly action plans",
    icon: ListChecks,
    description:
      "A short list of fixes to make this month — ranked by impact on revenue and reputation.",
  },
};

export function VocSection() {
  const [activeItem, setActiveItem] = useState<PanelKey>("complaints");

  return (
    <section id="voc" className="relative overflow-hidden bg-pastel-blue/30 py-16 md:py-24">
      <div className="mx-auto max-w-5xl space-y-10 px-4 sm:px-6 md:space-y-16">
        <FadeIn>
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-google-blue">
              Voice of Customer
            </p>
            <h2 className="text-balance text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
              Know what customers are really saying
            </h2>
            <p className="text-google-gray-500">
              AlwaysOpen analyses reviews and feedback to uncover the themes affecting
              your reputation and revenue.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-10 md:grid-cols-2 md:gap-14 lg:gap-20">
          <FadeIn delay={0.06}>
            <Accordion
              value={[activeItem]}
              onValueChange={(value) => {
                const next = value[0];
                if (next) setActiveItem(next as PanelKey);
              }}
              className="w-full"
            >
              {(Object.keys(panels) as PanelKey[]).map((key) => {
                const panel = panels[key];
                return (
                  <AccordionItem key={key} value={key}>
                    <AccordionTrigger className="text-base hover:no-underline">
                      <span className="flex items-center gap-2">
                        <panel.icon className="size-4 text-google-blue" />
                        {panel.title}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-google-gray-500">
                      {panel.description}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="relative flex overflow-hidden rounded-3xl border border-google-gray-200 bg-white p-2 shadow-google-card">
              <div className="relative aspect-[4/3] w-full rounded-2xl bg-google-gray-50">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeItem}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-6"
                  >
                    <StorefrontIllustration className="h-32 w-full max-w-xs opacity-90" />
                    <div className="absolute right-4 top-4 w-44">
                      <ReviewCardMock />
                    </div>
                    <p className="mt-4 text-center text-sm font-medium text-google-gray-700">
                      {panels[activeItem].title}
                    </p>
                    <BarChart3 className="mt-3 size-8 text-google-blue/60" />
                  </motion.div>
                </AnimatePresence>
              </div>
              <BorderBeam
                duration={6}
                size={180}
                className="from-transparent via-google-blue/60 to-transparent"
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
