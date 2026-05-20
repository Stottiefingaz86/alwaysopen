"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { motion } from "framer-motion";

export function GrowthChartIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 100" fill="none" className={className} aria-hidden>
      <rect width="200" height="100" rx="12" fill="#F8F9FA" stroke="#E8EAED" />
      <rect x="16" y="58" width="24" height="28" rx="6" fill="#3b7fd4" opacity="0.35" />
      <rect x="52" y="42" width="24" height="44" rx="6" fill="#34A853" opacity="0.45" />
      <rect x="88" y="28" width="24" height="58" rx="6" fill="#FBBC05" opacity="0.55" />
      <rect x="124" y="12" width="24" height="74" rx="6" fill="#3b7fd4" />
      <motion.path
        d="M28 68 L56 52 L92 38 L128 22"
        stroke="#34A853"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <circle cx="128" cy="22" r="6" fill="#34A853" />
      <text x="140" y="26" fill="#34A853" fontSize="11" fontWeight="500">
        +32%
      </text>
    </svg>
  );
}

export function ReviewCardMock({ className }: { className?: string }) {
  const { m } = useLocale();
  const r = m.reviewCard;

  return (
    <div className={`rounded-2xl border border-google-gray-200 bg-white p-5 shadow-google-card ${className ?? ""}`}>
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-pastel-lavender text-sm font-medium text-google-blue">
          SM
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{r.author}</p>
          <div className="mt-0.5 flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg key={i} className="size-3.5 fill-google-yellow text-google-yellow" viewBox="0 0 20 20">
                <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.25 5.06 16.7l.94-5.5-4-3.9 5.53-.8L10 1.5z" />
              </svg>
            ))}
          </div>
        </div>
        <span className="ml-auto text-xs text-google-gray-500">{r.source}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-google-gray-700">&ldquo;{r.quote}&rdquo;</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-pastel-mint px-2.5 py-0.5 text-xs text-google-green">
          {r.tags[0]}
        </span>
        <span className="rounded-full bg-pastel-lavender px-2.5 py-0.5 text-xs text-google-blue">
          {r.tags[1]}
        </span>
      </div>
    </div>
  );
}
