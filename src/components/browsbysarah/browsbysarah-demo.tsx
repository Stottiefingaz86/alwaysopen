"use client";

import { AgentCallPanel } from "@/components/landing/agent-call-panel";
import { bookingClientTools } from "@/lib/booking-tools";
import {
  BROWS_BY_SARAH_AGENT,
  BROWS_BY_SARAH_ORB_COLORS,
} from "@/lib/elevenlabs-agent";
import { ConversationProvider } from "@elevenlabs/react";
import type { SiriOrbProps } from "@/components/ui/siri-orb";
import Image from "next/image";

const orbColors: SiriOrbProps["colors"] = {
  bg: BROWS_BY_SARAH_ORB_COLORS.bg,
  c1: BROWS_BY_SARAH_ORB_COLORS.c1,
  c2: BROWS_BY_SARAH_ORB_COLORS.c2,
  c3: BROWS_BY_SARAH_ORB_COLORS.c3,
};

export function BrowsBySarahDemo() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg">
        <div className="border-b border-neutral-100 px-4 py-3 text-center">
          <div className="mx-auto flex max-w-[140px] justify-center">
            <Image
              src={BROWS_BY_SARAH_AGENT.logoSrc}
              alt={`${BROWS_BY_SARAH_AGENT.name} logo`}
              width={280}
              height={157}
              className="h-auto w-full object-contain"
              priority
            />
          </div>
        </div>

        <ConversationProvider
          agentId={BROWS_BY_SARAH_AGENT.id}
          clientTools={bookingClientTools}
        >
          <AgentCallPanel
            active
            showPhoneLink={false}
            phoneAlt={{
              phoneDisplay: BROWS_BY_SARAH_AGENT.businessPhone.display,
              phoneTel: BROWS_BY_SARAH_AGENT.businessPhone.tel,
              hint: BROWS_BY_SARAH_AGENT.businessPhone.hint,
              muted: BROWS_BY_SARAH_AGENT.businessPhone.muted,
            }}
            orbColors={orbColors}
            orbGlowClassName={BROWS_BY_SARAH_ORB_COLORS.glow}
            className="min-h-[480px] border-0 shadow-none"
          />
        </ConversationProvider>
      </div>
    </div>
  );
}
