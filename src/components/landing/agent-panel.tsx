"use client";

import { SiriOrb } from "@/components/ui/siri-orb";
import { useLocale } from "@/components/providers/locale-provider";
import {
  AI_AGENT_PHONE_DISPLAY,
  AI_AGENT_PHONE_TEL,
} from "@/lib/contact";
import { useConversation } from "@elevenlabs/react";
import { Loader2, Phone, PhoneOff } from "lucide-react";
import { useState } from "react";

function AgentInterface() {
  const { m } = useLocale();
  const [error, setError] = useState<string | null>(null);

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
    } catch {
      setError(m.agent.errorMic);
    }
  };

  return (
    <div className="agent-panel flex min-h-[380px] flex-col sm:min-h-[420px]">
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-8 sm:py-10">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-google-blue/10 blur-3xl sm:size-64"
          aria-hidden
        />
        <div className="relative z-10 origin-center scale-100 sm:scale-105">
          <SiriOrb
            size="180px"
            animationDuration={orbSpeed}
            colors={{
              bg: "oklch(98% 0.008 240)",
              c1: "oklch(55% 0.14 240)",
              c2: "oklch(72% 0.12 220)",
              c3: "oklch(65% 0.1 235)",
            }}
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
              {m.agent.prompts.map((phrase) => (
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
          </>
        ) : (
          <button
            type="button"
            onClick={() => endSession()}
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

export function AgentPanel() {
  return <AgentInterface />;
}
