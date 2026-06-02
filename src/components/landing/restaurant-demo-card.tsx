"use client";

import { DemoLanguageAvatars } from "@/components/landing/demo-language-avatars";
import { IndustryAgentDialog } from "@/components/landing/industry-agent-dialog";
import { RestaurantWorkflowDialog } from "@/components/landing/restaurant-workflow-dialog";
import { FadeIn } from "@/components/ui/section";
import { useLocale } from "@/components/providers/locale-provider";
import { INDUSTRY_AGENT_IDS } from "@/lib/elevenlabs-agent";
import {
  trackLiveDemoOpen,
  trackLiveDemoWorkflow,
} from "@/lib/analytics/gtag";
import { cn } from "@/lib/utils";
import { GitBranch, Phone, UtensilsCrossed } from "lucide-react";
import { useState } from "react";

const demoFooterButtonClass =
  "inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium whitespace-nowrap transition-all";

const workflowButtonClass = cn(
  demoFooterButtonClass,
  "border-[1.5px] border-google-gray-300 bg-transparent text-google-gray-700",
  "hover:border-google-blue hover:bg-pastel-blue/40 hover:text-google-blue",
  "active:scale-[0.98]"
);

export function RestaurantDemoCard({
  index,
  className,
}: {
  index: number;
  className?: string;
}) {
  const { m } = useLocale();
  const copy = m.industries.items.restaurant;
  const wf = m.industries.restaurantWorkflow;
  const [callOpen, setCallOpen] = useState(false);
  const [workflowOpen, setWorkflowOpen] = useState(false);
  const agentId = INDUSTRY_AGENT_IDS.restaurant;

  return (
    <FadeIn delay={index * 0.05} className={cn("h-full", className)}>
      <li className="flex h-full list-none flex-col overflow-hidden rounded-2xl border border-google-gray-200 bg-white shadow-google-card">
        <div className="relative flex flex-1 flex-col p-5">
          <DemoLanguageAvatars primary="en" secondary="es" />
          <span className="flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-800">
            <UtensilsCrossed className="size-6" strokeWidth={1.5} />
          </span>
          <h4 className="mt-4 text-base font-medium text-foreground">{copy.name}</h4>
          <p className="mt-1 text-sm font-medium text-amber-800/90">{copy.venue}</p>
          <p className="mt-4 flex-1 text-sm leading-relaxed text-google-gray-500">
            {copy.description}
          </p>
        </div>

        {agentId ? (
          <div className="flex flex-col gap-2 border-t border-google-gray-100 p-4">
            <button
              type="button"
              onClick={() => {
                trackLiveDemoOpen("restaurant", "industry_demos");
                setCallOpen(true);
              }}
              className={cn("btn-call", demoFooterButtonClass)}
            >
              <Phone className="size-4 shrink-0" aria-hidden />
              {m.agent.startCall}
            </button>
            <button
              type="button"
              onClick={() => {
                trackLiveDemoWorkflow("restaurant", "industry_demos");
                setWorkflowOpen(true);
              }}
              className={workflowButtonClass}
            >
              <GitBranch className="size-4 shrink-0" aria-hidden />
              {wf.viewWorkflow}
            </button>
          </div>
        ) : null}

        {agentId ? (
          <>
            <IndustryAgentDialog
              open={callOpen}
              onOpenChange={setCallOpen}
              industry="restaurant"
              agentId={agentId}
              title={copy.modalTitle}
              description={copy.modalDescription}
              promptPhrases={copy.prompts}
            />
            <RestaurantWorkflowDialog
              open={workflowOpen}
              onOpenChange={setWorkflowOpen}
              title={wf.modalTitle}
            />
          </>
        ) : null}
      </li>
    </FadeIn>
  );
}
