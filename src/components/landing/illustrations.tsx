"use client";

import { motion } from "framer-motion";

export function StorefrontIllustration({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 280 220"
      fill="none"
      className={className}
      aria-hidden
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <rect width="280" height="220" rx="20" fill="#F8F9FA" />
      <rect x="30" y="80" width="220" height="120" rx="12" fill="#E8F0FE" />
      <rect x="30" y="80" width="220" height="32" rx="12" fill="#9aa8ef" />
      <rect x="60" y="125" width="55" height="60" rx="6" fill="#fff" stroke="#DADCE0" />
      <rect x="130" y="125" width="95" height="38" rx="6" fill="#fff" stroke="#DADCE0" />
      <circle cx="87" cy="155" r="6" fill="#FBBC05" />
      <path d="M140 50 L140 80" stroke="#34A853" strokeWidth="5" strokeLinecap="round" />
      <circle cx="140" cy="38" r="16" fill="#34A853" opacity="0.2" />
      <circle cx="140" cy="38" r="10" fill="#34A853" />
      <circle cx="140" cy="38" r="4" fill="white" />
      {/* Floating review stars */}
      <g transform="translate(180, 28)">
        <rect width="80" height="44" rx="10" fill="white" stroke="#E8EAED" />
        {[0, 1, 2, 3, 4].map((i) => (
          <polygon
            key={i}
            points={`${12 + i * 14},28 ${14 + i * 14},22 ${16 + i * 14},28 ${14 + i * 14},26 ${12 + i * 14},28`}
            fill="#FBBC05"
            transform={`translate(0, -2)`}
          />
        ))}
      </g>
      {/* Calendar booking */}
      <rect x="200" y="130" width="48" height="48" rx="8" fill="#fff" stroke="#34A853" strokeWidth="1.5" />
      <rect x="200" y="130" width="48" height="14" rx="8" fill="#34A853" />
      <rect x="208" y="152" width="12" height="8" rx="2" fill="#E6F4EA" />
      <rect x="224" y="152" width="12" height="8" rx="2" fill="#E6F4EA" />
      <rect x="208" y="164" width="12" height="8" rx="2" fill="#34A853" opacity="0.4" />
    </motion.svg>
  );
}

export function GrowthChartIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 100" fill="none" className={className} aria-hidden>
      <rect width="200" height="100" rx="12" fill="#F8F9FA" stroke="#E8EAED" />
      <rect x="16" y="58" width="24" height="28" rx="6" fill="#9aa8ef" opacity="0.35" />
      <rect x="52" y="42" width="24" height="44" rx="6" fill="#34A853" opacity="0.45" />
      <rect x="88" y="28" width="24" height="58" rx="6" fill="#FBBC05" opacity="0.55" />
      <rect x="124" y="12" width="24" height="74" rx="6" fill="#9aa8ef" />
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
  return (
    <div className={`rounded-2xl border border-google-gray-200 bg-white p-5 shadow-google-card ${className ?? ""}`}>
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-pastel-lavender text-sm font-medium text-google-blue">
          SM
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Sarah M.</p>
          <div className="mt-0.5 flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg key={i} className="size-3.5 fill-google-yellow text-google-yellow" viewBox="0 0 20 20">
                <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.25 5.06 16.7l.94-5.5-4-3.9 5.53-.8L10 1.5z" />
              </svg>
            ))}
          </div>
        </div>
        <span className="ml-auto text-xs text-google-gray-500">Google</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-google-gray-700">
        &ldquo;Called after hours and got booked straight away. Wish they&apos;d done this years ago.&rdquo;
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-pastel-mint px-2.5 py-0.5 text-xs text-google-green">Booking ease</span>
        <span className="rounded-full bg-pastel-lavender px-2.5 py-0.5 text-xs text-google-blue">After hours</span>
      </div>
    </div>
  );
}
