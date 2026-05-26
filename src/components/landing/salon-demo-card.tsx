"use client";

import { IndustryAgentDialog } from "@/components/landing/industry-agent-dialog";
import { SalonWorkflowDialog } from "@/components/landing/salon-workflow-dialog";
import { FadeIn } from "@/components/ui/section";
import { useLocale } from "@/components/providers/locale-provider";
import {
  BROWS_BY_SARAH_AGENT,
  INDUSTRY_AGENT_IDS,
} from "@/lib/elevenlabs-agent";
import { cn } from "@/lib/utils";
import { GitBranch, Phone, Scissors } from "lucide-react";
import { useState } from "react";

const demoFooterButtonClass =
  "inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium whitespace-nowrap transition-all";

const workflowButtonClass = cn(
  demoFooterButtonClass,
  "border-[1.5px] border-google-gray-300 bg-transparent text-google-gray-700",
  "hover:border-google-blue hover:bg-pastel-blue/40 hover:text-google-blue",
  "active:scale-[0.98]"
);

export function SalonDemoCard({
  index,
  className,
}: {
  index: number;
  className?: string;
}) {
  const { m } = useLocale();
  const copy = m.industries.items.salon;
  const wf = m.industries.salonWorkflow;
  const [callOpen, setCallOpen] = useState(false);
  const [workflowOpen, setWorkflowOpen] = useState(false);
  const agentId = INDUSTRY_AGENT_IDS.salon;

  return (
    <FadeIn delay={index * 0.05} className={cn("h-full", className)}>
      <li className="flex h-full list-none flex-col overflow-hidden rounded-2xl border border-google-gray-200 bg-white shadow-google-card">
        <div className="flex flex-1 flex-col p-5">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-700">
            <Scissors className="size-6" strokeWidth={1.5} />
          </span>
          <h4 className="mt-4 text-base font-medium text-foreground">{copy.name}</h4>
          {"venue" in copy && typeof copy.venue === "string" && copy.venue ? (
            <p className="mt-1 text-sm font-medium text-pink-800/90">{copy.venue}</p>
          ) : null}
          <p className="mt-4 flex-1 text-sm leading-relaxed text-google-gray-500">
            {copy.description}
          </p>
        </div>

        {agentId ? (
          <div className="flex flex-col gap-2 border-t border-google-gray-100 p-4">
            <button
              type="button"
              onClick={() => setCallOpen(true)}
              className={cn("btn-call", demoFooterButtonClass)}
            >
              <Phone className="size-4 shrink-0" aria-hidden />
              {m.agent.startCall}
            </button>
            <button
              type="button"
              onClick={() => setWorkflowOpen(true)}
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
              industry="salon"
              agentId={agentId}
              title={copy.modalTitle}
              description={copy.modalDescription}
              promptPhrases={copy.prompts}
              phoneAlt={{
                phoneDisplay: BROWS_BY_SARAH_AGENT.businessPhone.display,
                phoneTel: BROWS_BY_SARAH_AGENT.businessPhone.tel,
                hint: BROWS_BY_SARAH_AGENT.businessPhone.hint,
                muted: BROWS_BY_SARAH_AGENT.businessPhone.muted,
              }}
            />
            <SalonWorkflowDialog
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
