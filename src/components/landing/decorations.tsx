"use client";

import { motion } from "framer-motion";
import { MapPin, Star, Phone, MessageCircle } from "lucide-react";

export function DotGrid({ className }: { className?: string }) {
  return (
    <div
      className={`pattern-dots pointer-events-none absolute inset-0 opacity-40 ${className ?? ""}`}
      aria-hidden
    />
  );
}

export function FloatingBadge({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 200 }}
      className={`absolute z-10 flex items-center gap-2 rounded-xl border border-google-gray-200 bg-white px-3 py-2 text-xs font-medium text-google-gray-700 shadow-google-elevated ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}

export function FloatingPrompt({
  text,
  className,
  delay = 0,
  floatDuration = 5,
  accent = "blue",
}: {
  text: string;
  className?: string;
  delay?: number;
  floatDuration?: number;
  accent?: "blue" | "green" | "yellow";
}) {
  const accents = {
    blue: "text-google-blue bg-pastel-lavender",
    green: "text-google-green bg-pastel-mint",
    yellow: "text-google-yellow bg-pastel-peach",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={`prompt-float pointer-events-none absolute rounded-xl border border-google-gray-200 bg-white px-2.5 py-2 shadow-google-elevated sm:px-3 sm:py-2.5 ${className ?? ""}`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${floatDuration}s`,
      }}
    >
      <span
        className={`mb-1.5 flex size-6 items-center justify-center rounded-full ${accents[accent]}`}
      >
        <MessageCircle className="size-3.5" strokeWidth={2} />
      </span>
      <p className="text-left text-[11px] leading-snug text-google-gray-700 sm:text-xs">
        &ldquo;{text}&rdquo;
      </p>
    </motion.div>
  );
}

export function MapPinCluster() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute right-8 top-12 text-google-red"
      >
        <MapPin className="size-8 fill-google-red/20" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
        className="absolute right-24 top-28 text-google-blue"
      >
        <MapPin className="size-6 fill-google-blue/20" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
        className="absolute left-4 top-20 text-google-green"
      >
        <MapPin className="size-7 fill-google-green/20" />
      </motion.div>
    </div>
  );
}

export function StarRating({ rating = 4.8 }: { rating?: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`size-4 ${i <= Math.floor(rating) ? "fill-google-yellow text-google-yellow" : "fill-google-gray-200 text-google-gray-200"}`}
        />
      ))}
      <span className="ml-1 text-sm font-medium text-google-gray-700">{rating}</span>
    </div>
  );
}

export function PhoneRingPulse() {
  return (
    <span className="relative flex size-3">
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-google-green opacity-50" />
      <span className="relative inline-flex size-3 rounded-full bg-google-green" />
    </span>
  );
}

export function IconBubble({
  icon: Icon,
  color,
  bg,
}: {
  icon: typeof Phone;
  color: string;
  bg: string;
}) {
  return (
    <span className={`flex size-8 items-center justify-center rounded-full ${bg}`}>
      <Icon className={`size-4 ${color}`} />
    </span>
  );
}
