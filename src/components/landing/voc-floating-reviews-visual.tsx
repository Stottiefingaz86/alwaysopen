"use client";

import { ReviewSourceIcon } from "@/components/landing/review-source-icon";
import type { Messages } from "@/lib/i18n/messages/en";
import { REVIEW_SOURCE_KEYS } from "@/lib/review-source-icons";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Star } from "lucide-react";

const CARD_LAYOUT = [
  "left-[5%] top-[8%] -rotate-2",
  "right-[3%] top-[32%] z-10 rotate-1",
  "left-[10%] bottom-[14%] -rotate-1",
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
  sourceLabels: Messages["solution"]["voc"]["reviewSources"];
};

export function VocFloatingReviewsVisual({
  reviews,
  sourceLabels,
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

      {reviews.map((review, i) => {
        const source = review.source as keyof typeof sourceLabels;
        const label = sourceLabels[source] ?? sourceLabels.google;

        return (
          <motion.article
            key={`${review.author}-${review.source}`}
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
                <span className="inline-flex shrink-0 items-center gap-1 text-[9px] font-medium text-google-gray-500">
                  <ReviewSourceIcon source={review.source} size={14} />
                  {label}
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
        );
      })}

      <div
        className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-google-gray-200/90 bg-white/95 px-3 py-2 shadow-google-card"
        aria-label="Review sources"
      >
        {REVIEW_SOURCE_KEYS.map((key) => (
          <ReviewSourceIcon key={key} source={key} size={20} />
        ))}
      </div>
    </div>
  );
}
