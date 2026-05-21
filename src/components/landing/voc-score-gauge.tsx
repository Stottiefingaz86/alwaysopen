"use client";

import { getVocScoreTier, getVocScoreTierStyles } from "@/lib/voc-score-tier";
import { cn } from "@/lib/utils";

type VocScoreGaugeProps = {
  score: number;
  max?: number;
  label: string;
  qualityLabel: string;
  qualityClassName?: string;
  large?: boolean;
  className?: string;
};

/** VoC score — numeric box with tier colour (no arc). */
export function VocScoreGauge({
  score,
  max = 100,
  label,
  qualityLabel,
  qualityClassName,
  large = false,
  className,
}: VocScoreGaugeProps) {
  const tier = getVocScoreTier(score);
  const { box, label: tierLabelColor } = getVocScoreTierStyles(tier);

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-xl border text-center",
        box,
        large ? "px-4 py-4" : "px-2 py-3",
        className
      )}
    >
      <span
        className={cn(
          "font-semibold uppercase tracking-wider text-google-gray-500",
          large ? "text-[10px]" : "text-[9px]"
        )}
      >
        {label}
      </span>
      <p
        className={cn(
          "mt-1 font-semibold tabular-nums leading-none text-foreground",
          large ? "text-4xl" : "text-2xl"
        )}
      >
        {score}
        <span
          className={cn(
            "font-normal text-google-gray-400",
            large ? "text-lg" : "text-sm"
          )}
        >
          /{max}
        </span>
      </p>
      <p
        className={cn(
          "mt-1 font-medium",
          large ? "text-sm" : "text-xs",
          tierLabelColor,
          qualityClassName
        )}
      >
        {qualityLabel}
      </p>
    </div>
  );
}
