"use client";

import { SiriOrb, type SiriOrbProps } from "@/components/ui/siri-orb";
import {
  trackLiveDemoCallEnd,
  trackLiveDemoCallStart,
} from "@/lib/analytics/gtag";
import { useLocale } from "@/components/providers/locale-provider";
import {
  AI_AGENT_PHONE_DISPLAY,
  AI_AGENT_PHONE_TEL,
} from "@/lib/contact";
import { useConversation } from "@elevenlabs/react";
import { Loader2, Phone, PhoneOff } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type AgentCallPanelPhoneAlt = {
  /** e.g. "or call" */
  orCallLabel?: string;
  /** Shown greyed when `muted`; uses tel link when set and not muted */
  phoneDisplay: string;
  phoneTel?: string;
  hint: string;
  muted?: boolean;
};

type AgentCallPanelProps = {
  /** End the session when the parent closes (e.g. dialog) */
  active?: boolean;
  showPhoneLink?: boolean;
  /** Custom phone line below Start call (client demo business number) */
  phoneAlt?: AgentCallPanelPhoneAlt;
  promptPhrases?: readonly string[];
  orbColors?: SiriOrbProps["colors"];
  orbGlowClassName?: string;
  className?: string;
  demoIndustry?: string;
  demoLocation?: string;
};

export function AgentCallPanel({
  active = true,
  showPhoneLink = true,
  phoneAlt,
  promptPhrases,
  orbColors,
  orbGlowClassName = "bg-google-blue/10",
  className,
  demoIndustry = "hero",
  demoLocation = "hero_agent",
}: AgentCallPanelProps) {
  const { m } = useLocale();
  const [error, setError] = useState<string | null>(null);
  const phrases = promptPhrases ?? m.agent.prompts;

  const { startSession, endSession, status, isSpeaking, isListening } =
    useConversation({
      onConnect: () => setError(null),
      onError: (msg) => setError(msg ?? m.agent.errorConnection),
    });

  const isConnected = status === "connected";
  const isConnecting = status === "connecting";
  const orbSpeed = isSpeaking ? 6 : isListening ? 10 : isConnected ? 14 : 20;

  const startCall = async () => {
    setError(null);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      startSession({ connectionType: "webrtc" });
      trackLiveDemoCallStart(demoIndustry, demoLocation);
    } catch {
      setError(m.agent.errorMic);
    }
  };

  const endCall = () => {
    if (isConnected || isConnecting) {
      trackLiveDemoCallEnd(demoIndustry, demoLocation);
    }
    endSession();
  };

  useEffect(() => {
    if (!active && (isConnected || isConnecting)) {
      endCall();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- endCall wraps endSession
  }, [active, isConnected, isConnecting]);

  return (
    <div
      className={cn(
        "agent-panel flex min-h-[380px] flex-col sm:min-h-[420px]",
        className
      )}
    >
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-8 sm:py-10">
        <div
          className={cn(
            "pointer-events-none absolute left-1/2 top-1/2 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl sm:size-64",
            orbGlowClassName
          )}
          aria-hidden
        />
        <div className="relative z-10 origin-center scale-100 sm:scale-105">
          <SiriOrb
            size="180px"
            animationDuration={orbSpeed}
            colors={
              orbColors ?? {
                bg: "oklch(98% 0.008 240)",
                c1: "oklch(55% 0.14 240)",
                c2: "oklch(72% 0.12 220)",
                c3: "oklch(65% 0.1 235)",
              }
            }
          />
        </div>
        {isConnected && (
          <p className="relative z-10 mt-5 text-sm text-google-gray-500">
            {isSpeaking
              ? m.agent.speaking
              : isListening
                ? m.agent.listening
                : m.agent.connected}
          </p>
        )}
      </div>

      <div className="border-t border-google-gray-200 bg-google-gray-50/50 px-4 py-4 sm:px-5 sm:py-5">
        {!isConnected ? (
          <>
            <p className="mb-3 text-xs text-google-gray-500">{m.agent.trySaying}</p>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {phrases.map((phrase) => (
                <li key={phrase}>
                  <button
                    type="button"
                    onClick={startCall}
                    disabled={isConnecting}
                    className="w-full rounded-xl border border-google-gray-200/80 bg-white/70 px-3 py-2.5 text-left text-[13px] leading-snug text-google-gray-700 transition-colors hover:border-[#c4b8f0]/50 hover:bg-white disabled:opacity-60"
                  >
                    {phrase}
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={startCall}
              disabled={isConnecting}
              className="btn-call mt-4 inline-flex w-full items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-medium transition-all disabled:opacity-60"
            >
              {isConnecting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Phone className="size-4" />
              )}
              {isConnecting ? m.agent.connecting : m.agent.startCall}
            </button>
            {phoneAlt && (
              <div className="mt-3 space-y-1 text-center">
                <p className="text-sm text-google-gray-500">
                  {phoneAlt.orCallLabel ?? m.agent.callOr}
                </p>
                {phoneAlt.muted || !phoneAlt.phoneTel ? (
                  <p className="text-sm font-medium text-google-gray-400">
                    {phoneAlt.phoneDisplay}
                  </p>
                ) : (
                  <a
                    href={`tel:${phoneAlt.phoneTel}`}
                    className="text-sm font-medium text-google-gray-600 hover:text-google-blue hover:underline"
                  >
                    {phoneAlt.phoneDisplay}
                  </a>
                )}
                <p className="text-xs leading-snug text-google-gray-500">{phoneAlt.hint}</p>
              </div>
            )}
            {showPhoneLink && !phoneAlt && (
              <p className="mt-3 text-center text-sm text-google-gray-500">
                {m.agent.callOr}{" "}
                <a
                  href={`tel:${AI_AGENT_PHONE_TEL}`}
                  className="font-medium text-google-blue hover:underline"
                >
                  {AI_AGENT_PHONE_DISPLAY}
                </a>{" "}
                {m.agent.callSuffix}
              </p>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={endCall}
            className="btn-call inline-flex w-full items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-medium transition-all"
          >
            <PhoneOff className="size-4" />
            {m.agent.endCall}
          </button>
        )}

        {error && (
          <p className="mt-3 text-center text-sm text-google-red">{error}</p>
        )}
      </div>
    </div>
  );
}
