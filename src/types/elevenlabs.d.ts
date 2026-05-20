import type { DetailedHTMLProps, HTMLAttributes } from "react";

type ElevenLabsConvaiProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement> & { "agent-id"?: string },
  HTMLElement
>;

/** Methods exposed on the convai custom element (when supported by embed script) */
export interface ElevenLabsConvaiElement extends HTMLElement {
  sendUserMessage?: (text: string) => void;
  startConversation?: () => void;
  endConversation?: () => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": ElevenLabsConvaiProps;
    }
  }
}

export {};
