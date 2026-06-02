"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BorderBeam } from "@/components/ui/border-beam";
import { CtaButton } from "@/components/landing/cta-button";
import { VocPanelPreview } from "@/components/landing/voc-panel-preview";
import { FadeIn } from "@/components/ui/section";
import { useLocale } from "@/components/providers/locale-provider";
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
import { setLocationHash } from "@/lib/hash-navigation";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type PanelKey =
  | "complaints"
  | "praise"
  | "sentiment"
  | "competitors"
  | "suggestions"
  | "google"
  | "actions";

const panelIcons = {
  complaints: ThumbsDown,
  praise: ThumbsUp,
  sentiment: Heart,
  competitors: Users,
  suggestions: PenLine,
  google: MapPin,
  actions: ListChecks,
} as const;

const explainerIcons = [MessageSquare, TrendingUp, MapPin] as const;

export function VocSection() {
  const { m, locale } = useLocale();
  const pathname = usePathname();
  const v = m.voc;
  const [activeItem, setActiveItem] = useState<PanelKey>("complaints");
  const demoReportsHref = pathname === "/" ? "#voc-demos" : "/#voc-demos";

  const navigateToDemoReports = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();
    if (pathname === "/") {
      setLocationHash("#voc-demos");
      return;
    }
    window.location.href = "/#voc-demos";
  };

  const explainers = useMemo(
    () => [
      { title: v.whatTitle, icon: explainerIcons[0], body: v.whatBody },
      { title: v.whyTitle, icon: explainerIcons[1], body: v.whyBody },
      { title: v.actionTitle, icon: explainerIcons[2], body: v.actionBody },
    ],
    [v]
  );

  const panels = useMemo(
    () =>
      (Object.keys(panelIcons) as PanelKey[]).map((key) => ({
        key,
        icon: panelIcons[key],
        title: v.panels[key].title,
        description: v.panels[key].description,
      })),
    [v]
  );

  const activePanel = panels.find((p) => p.key === activeItem)!;

  return (
    <section
      id="voc"
      className="relative overflow-x-clip bg-pastel-blue/30 py-16 md:py-24 scroll-mt-24"
    >
      <div className="mx-auto max-w-5xl space-y-10 px-4 sm:px-6 md:space-y-14">
        <FadeIn>
          <div className="mx-auto max-w-3xl space-y-5 text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-google-blue">
              {v.eyebrow}
            </p>
            <h2 className="text-balance text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
              {v.title}
            </h2>
            <p className="text-base leading-relaxed text-google-gray-500 md:text-lg">
              {locale === "es" ? (
                <>
                  {v.introBefore}{" "}
                  <strong className="font-medium text-foreground">{v.introEmphasis}</strong>
                  {v.introAfter}
                </>
              ) : (
                <>
                  <strong className="font-medium text-foreground">VoC</strong> {v.introBefore}{" "}
                  <strong className="font-medium text-foreground">{v.introEmphasis}</strong>
                  {v.introAfter}
                </>
              )}
            </p>
            <div className="flex justify-center pt-2">
              <CtaButton
                href={demoReportsHref}
                size="default"
                analyticsLocation="voc_section"
                onClick={navigateToDemoReports}
              >
                {v.viewDemoReports}
              </CtaButton>
            </div>
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
                <h3 className="mt-4 text-base font-medium text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-google-gray-500">{item.body}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-google-gray-500">
            {v.monthlyNote}
          </p>
        </FadeIn>

        <div className="grid gap-10 md:grid-cols-2 md:gap-14 lg:gap-20">
          <FadeIn delay={0.1}>
            <p className="mb-4 text-sm font-medium text-foreground">{v.accordionHeading}</p>
            <Accordion
              value={[activeItem]}
              onValueChange={(value) => {
                const next = value[0];
                if (next) setActiveItem(next as PanelKey);
              }}
              className="w-full"
            >
              {panels.map((panel) => (
                <AccordionItem key={panel.key} value={panel.key}>
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
              ))}
            </Accordion>
          </FadeIn>

          <FadeIn delay={0.12}>
            <div className="relative overflow-visible rounded-3xl border border-google-gray-200 bg-white p-2 shadow-google-card">
              <div className="relative min-h-[300px] w-full overflow-hidden rounded-2xl bg-google-gray-50 sm:min-h-[320px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeItem}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22 }}
                    className="flex h-full min-h-[300px] flex-col items-center justify-center gap-4 p-5 sm:min-h-[320px] sm:p-6"
                  >
                    <VocPanelPreview panel={activeItem} />
                    <p className="text-center text-xs font-medium text-google-gray-500">
                      {activePanel.title}
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
