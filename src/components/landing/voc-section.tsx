"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BorderBeam } from "@/components/ui/border-beam";
import { ReviewCardMock } from "@/components/landing/illustrations";
import { FadeIn } from "@/components/ui/section";
import {
  Heart,
  ListChecks,
  MapPin,
  MessageSquare,
  PenLine,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const GOOGLE_BUSINESS_ICON = "/google-my-business-icon.svg";

type PanelKey =
  | "complaints"
  | "praise"
  | "sentiment"
  | "competitors"
  | "suggestions"
  | "google"
  | "actions";

const explainers = [
  {
    title: "What is VoC?",
    icon: MessageSquare,
    body: "Voice of the Customer (VoC) means listening to what people say about your business: Google reviews, your website, surveys, and feedback after visits. Then we help you make sense of it together.",
  },
  {
    title: "Why it matters",
    icon: TrendingUp,
    body: "Star ratings alone do not tell you what to fix. VoC shows the real themes (wait times, staff, pricing, quality) so you improve what customers actually care about, not what you guess.",
  },
  {
    title: "Action + Google",
    icon: MapPin,
    body: "Each month we turn feedback into clear next steps: what to change in the business, how to reply on Google, and a practical Google Business strategy so your listing works harder for you.",
  },
] as const;

const panels: Record<
  PanelKey,
  { title: string; icon: typeof ThumbsDown; description: string }
> = {
  complaints: {
    title: "Top complaints",
    icon: ThumbsDown,
    description:
      "We read your Google reviews, website feedback, and surveys, then call out what people complain about most so you fix the right thing first.",
  },
  praise: {
    title: "Top praise themes",
    icon: ThumbsUp,
    description:
      "We highlight what customers love in their own words: the phrases and experiences that show up again and again in five-star reviews.",
  },
  sentiment: {
    title: "Customer sentiment",
    icon: Heart,
    description:
      "We track whether mood is improving month to month from your reviews and satisfaction feedback, not just your star average.",
  },
  competitors: {
    title: "Competitor comparison",
    icon: Users,
    description:
      "When reviewers mention rivals, we note why, and where you are already winning in their eyes.",
  },
  suggestions: {
    title: "Review response ideas",
    icon: PenLine,
    description:
      "Optional wording we suggest for Google replies. You choose what to post, in your voice.",
  },
  google: {
    title: "Google Business strategy",
    icon: MapPin,
    description:
      "Practical guidance for your Google Business profile: which reviews to answer, what to post, what to highlight in photos or offers, and how feedback should shape how you show up in local search.",
  },
  actions: {
    title: "Monthly action plan",
    icon: ListChecks,
    description:
      "A short, human-written priority list for this month: fixes in the business, reputation tasks, and Google steps ranked by what will help you most.",
  },
};

export function VocSection() {
  const [activeItem, setActiveItem] = useState<PanelKey>("google");

  return (
    <section id="voc" className="relative overflow-x-clip bg-pastel-blue/30 py-16 md:py-24">
      <div className="mx-auto max-w-5xl space-y-10 px-4 sm:px-6 md:space-y-14">
        <FadeIn>
          <div className="mx-auto max-w-3xl space-y-5 text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-google-blue">
              Customer feedback reports
            </p>
            <h2 className="text-balance text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
              Voice of the Customer, explained in plain English
            </h2>
            <p className="text-base leading-relaxed text-google-gray-500 md:text-lg">
              <strong className="font-medium text-foreground">VoC</strong> is not
              jargon for big corporations. It is listening to what customers say,
              understanding the patterns, and{" "}
              <strong className="font-medium text-foreground">doing something about it</strong>,
              including your Google Business profile, where many people decide
              whether to call you.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="grid gap-4 md:grid-cols-3">
            {explainers.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-google-gray-200 bg-white p-5 shadow-google-card"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-pastel-blue text-google-blue">
                  <item.icon className="size-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 text-base font-medium text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-google-gray-500">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-google-gray-500">
            Each month our team prepares your report by hand. We read Google
            Business reviews, your website, surveys, and customer satisfaction
            feedback, so you get themes, actions, and a Google plan you can
            actually follow.
          </p>
        </FadeIn>

        <div className="grid gap-10 md:grid-cols-2 md:gap-14 lg:gap-20">
          <FadeIn delay={0.1}>
            <p className="mb-4 text-sm font-medium text-foreground">
              What goes into your monthly report
            </p>
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

          <FadeIn delay={0.12}>
            <div className="relative overflow-visible rounded-3xl border border-google-gray-200 bg-white p-2 shadow-google-card">
              <div className="relative min-h-[280px] w-full overflow-hidden rounded-2xl bg-google-gray-50 sm:min-h-[300px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeItem}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="flex h-full min-h-[280px] flex-col items-center justify-center gap-5 p-5 sm:min-h-[300px] sm:p-6"
                  >
                    {activeItem === "google" ? (
                      <Image
                        src={GOOGLE_BUSINESS_ICON}
                        alt="Google Business Profile"
                        width={160}
                        height={140}
                        className="h-28 w-auto max-w-[200px] object-contain sm:h-32"
                      />
                    ) : (
                      (() => {
                        const Icon = panels[activeItem].icon;
                        return (
                          <span className="flex size-16 items-center justify-center rounded-2xl bg-pastel-blue/80">
                            <Icon
                              className="size-8 text-google-blue"
                              strokeWidth={1.5}
                            />
                          </span>
                        );
                      })()
                    )}
                    <ReviewCardMock className="w-full max-w-[220px] shrink-0" />
                    <p className="text-center text-sm font-medium text-google-gray-700">
                      {panels[activeItem].title}
                    </p>
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
