"use client";

import { AgentPanel } from "@/components/landing/agent-panel";
import { bookingClientTools } from "@/lib/booking-tools";
import { ELEVENLABS_AGENT } from "@/lib/elevenlabs-agent";
import { ConversationProvider } from "@elevenlabs/react";
import { motion } from "framer-motion";

export function AgentShowcase() {
  return (
    <motion.div
      id="talk-to-chris"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative mx-auto w-full max-w-md lg:max-w-none"
    >
      <ConversationProvider
        agentId={ELEVENLABS_AGENT.id}
        clientTools={bookingClientTools}
      >
        <div className="overflow-hidden rounded-2xl border border-google-gray-200 bg-white shadow-google-elevated">
          <AgentPanel />
        </div>
      </ConversationProvider>
    </motion.div>
  );
}
