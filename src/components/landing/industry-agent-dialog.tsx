"use client";

import { AgentCallPanel } from "@/components/landing/agent-call-panel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { bookingClientTools } from "@/lib/booking-tools";
import {
  DEFAULT_ORB_COLORS,
  INDUSTRY_ORB_COLORS,
  type IndustryAgentKey,
} from "@/lib/elevenlabs-agent";
import { ConversationProvider } from "@elevenlabs/react";
import type { SiriOrbProps } from "@/components/ui/siri-orb";

type IndustryAgentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  industry: IndustryAgentKey;
  agentId: string;
  title: string;
  description: string;
  promptPhrases?: readonly string[];
};

export function IndustryAgentDialog({
  open,
  onOpenChange,
  industry,
  agentId,
  title,
  description,
  promptPhrases,
}: IndustryAgentDialogProps) {
  const palette = INDUSTRY_ORB_COLORS[industry] ?? DEFAULT_ORB_COLORS;
  const orbColors: SiriOrbProps["colors"] = {
    bg: palette.bg,
    c1: palette.c1,
    c2: palette.c2,
    c3: palette.c3,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[min(92vh,720px)] overflow-hidden border-google-gray-200 p-0 sm:max-w-md"
        showCloseButton
      >
        <DialogHeader className="border-b border-google-gray-100 px-5 pb-4 pt-5 pr-12">
          <DialogTitle className="text-lg font-medium text-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="text-google-gray-500">
            {description}
          </DialogDescription>
        </DialogHeader>

        {open && (
          <ConversationProvider
            agentId={agentId}
            clientTools={bookingClientTools}
          >
            <AgentCallPanel
              active={open}
              showPhoneLink={false}
              promptPhrases={promptPhrases}
              orbColors={orbColors}
              orbGlowClassName={palette.glow}
              className="min-h-0 border-0 shadow-none"
            />
          </ConversationProvider>
        )}
      </DialogContent>
    </Dialog>
  );
}
