"use client";

import type { Messages } from "@/lib/i18n/messages/en";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Star } from "lucide-react";
import Image from "next/image";

const GOOGLE_ICON = "/google-my-business-icon.svg";

const CARD_LAYOUT = [
  "left-[5%] top-[8%] -rotate-2",
  "right-[3%] top-[32%] z-10 rotate-1",
  "left-[10%] bottom-[10%] -rotate-1",
] as const;

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${stars} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5",
            i < stars
              ? "fill-amber-400 text-amber-400"
              : "fill-google-gray-200 text-google-gray-200"
          )}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

type VocFloatingReviewsVisualProps = {
  reviews: Messages["solution"]["voc"]["floatingReviews"];
  sourceLabel: string;
};

export function VocFloatingReviewsVisual({
  reviews,
  sourceLabel,
}: VocFloatingReviewsVisualProps) {
  return (
    <div className="relative flex h-full min-h-[220px] w-full overflow-hidden rounded-2xl bg-linear-to-br from-pastel-blue/50 via-white to-google-gray-50/90 md:min-h-[280px]">
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--google-gray-200) 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
        aria-hidden
      />

      {reviews.map((review, i) => (
        <motion.article
          key={review.author}
          className={cn(
            "absolute w-[min(100%,14rem)] rounded-xl border border-google-gray-200/90 bg-white/95 px-4 py-3.5 shadow-google-elevated backdrop-blur-sm sm:w-[13.5rem]",
            CARD_LAYOUT[i]
          )}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.06 + i * 0.1, duration: 0.4 }}
        >
          <motion.div
            animate={{ y: [0, i % 2 === 0 ? -6 : 6, 0] }}
            transition={{
              duration: 4.2 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          >
            <div className="mb-2.5 flex items-center justify-between gap-2">
              <StarRating stars={review.stars} />
              <span className="inline-flex shrink-0 items-center gap-1 text-[9px] font-medium text-google-gray-400">
                <Image src={GOOGLE_ICON} alt="" width={12} height={12} className="size-3" />
                {sourceLabel}
              </span>
            </div>
            <p className="text-[13px] leading-snug text-google-gray-700">
              &ldquo;{review.quote}&rdquo;
            </p>
            <p className="mt-2.5 text-xs font-medium text-google-gray-500">
              {review.author}
            </p>
          </motion.div>
        </motion.article>
      ))}
    </div>
  );
}
