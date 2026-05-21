"use client";

import { IndustryAgentDialog } from "@/components/landing/industry-agent-dialog";
import { FadeIn, Section, SectionHeader } from "@/components/ui/section";
import { useLocale } from "@/components/providers/locale-provider";
import {
  INDUSTRY_AGENT_IDS,
  type IndustryAgentKey,
} from "@/lib/elevenlabs-agent";
import { cn } from "@/lib/utils";
import {
  Building2,
  Phone,
  Scissors,
  Stethoscope,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

type IndustryCard = {
  key: IndustryAgentKey;
  icon: LucideIcon;
  available: boolean;
  accentIcon?: string;
};

const INDUSTRY_CARDS: IndustryCard[] = [
  {
    key: "restaurant",
    icon: UtensilsCrossed,
    available: true,
    accentIcon: "bg-amber-50 text-amber-800",
  },
  { key: "salon", icon: Scissors, available: false },
  { key: "estateAgency", icon: Building2, available: false },
  { key: "clinic", icon: Stethoscope, available: false },
];

export function IndustryShowcaseSection() {
  const { m } = useLocale();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeIndustry, setActiveIndustry] = useState<IndustryAgentKey | null>(
    null
  );

  const openIndustry = (key: IndustryAgentKey) => {
    const agentId = INDUSTRY_AGENT_IDS[key];
    if (!agentId) return;
    setActiveIndustry(key);
    setDialogOpen(true);
  };

  const industryCopy = m.industries.items;
  const activeCopy = activeIndustry ? industryCopy[activeIndustry] : null;
  const activeAgentId = activeIndustry
    ? INDUSTRY_AGENT_IDS[activeIndustry]
    : undefined;

  return (
    <Section id="industry-demos" className="bg-google-gray-50/80">
      <SectionHeader
        eyebrow={m.industries.eyebrow}
        title={m.industries.title}
        subtitle={m.industries.subtitle}
        centered
      />

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {INDUSTRY_CARDS.map((card, index) => {
          const copy = industryCopy[card.key];
          const isAvailable =
            card.available && Boolean(INDUSTRY_AGENT_IDS[card.key]);

          return (
            <FadeIn key={card.key} delay={index * 0.05}>
              <li
                className={cn(
                  "flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-google-card",
                  isAvailable
                    ? "border-google-gray-200"
                    : "border-google-gray-200/80 opacity-55"
                )}
              >
                <div className="relative flex flex-1 flex-col p-5">
                  {!isAvailable && (
                    <span className="absolute right-3 top-3 rounded-full bg-google-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-google-gray-500">
                      {m.industries.comingSoon}
                    </span>
                  )}
                  <span
                    className={cn(
                      "flex size-12 items-center justify-center rounded-2xl",
                      isAvailable
                        ? card.accentIcon ??
                          "bg-pastel-blue text-google-blue"
                        : "bg-google-gray-100 text-google-gray-400"
                    )}
                  >
                    <card.icon className="size-6" strokeWidth={1.5} />
                  </span>
                  <h3
                    className={cn(
                      "mt-4 text-base font-medium",
                      isAvailable ? "text-foreground" : "text-google-gray-500"
                    )}
                  >
                    {copy.name}
                  </h3>
                  {"venue" in copy && copy.venue && (
                    <p className="mt-1 text-sm font-medium text-amber-800/90">
                      {copy.venue}
                    </p>
                  )}
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-google-gray-500">
                    {copy.description}
                  </p>
                </div>

                {isAvailable && (
                  <div className="border-t border-google-gray-100 p-4">
                    <button
                      type="button"
                      onClick={() => openIndustry(card.key)}
                      className="btn-call inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-all"
                    >
                      <Phone className="size-4" aria-hidden />
                      {m.agent.startCall}
                    </button>
                  </div>
                )}
              </li>
            </FadeIn>
          );
        })}
      </ul>

      {activeAgentId && activeCopy && activeIndustry && (
        <IndustryAgentDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setActiveIndustry(null);
          }}
          industry={activeIndustry}
          agentId={activeAgentId}
          title={activeCopy.modalTitle}
          description={activeCopy.modalDescription}
          promptPhrases={activeCopy.prompts}
        />
      )}
    </Section>
  );
}
