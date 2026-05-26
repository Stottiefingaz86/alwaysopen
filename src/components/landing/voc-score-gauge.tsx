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

/** VoC score summary — centered score box with tier label. */
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
  const { label: tierLabelColor } = getVocScoreTierStyles(tier);

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-xl border border-google-gray-200/90 bg-[#f1f5f2] text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]",
        large ? "gap-1.5 px-4 py-3.5" : "gap-1 px-3 py-2.5",
        className
      )}
    >
      <span
        className={cn(
          "font-semibold uppercase tracking-[0.12em] text-google-gray-500",
          large ? "text-[10px]" : "text-[9px]"
        )}
      >
        {label}
      </span>
      <p
        className={cn(
          "font-semibold tabular-nums leading-none tracking-tight text-foreground",
          large ? "text-4xl" : "text-2xl"
        )}
      >
        {score}
        <span
          className={cn(
            "ml-0.5 font-normal text-google-gray-400",
            large ? "text-base" : "text-sm"
          )}
        >
          /{max}
        </span>
      </p>
      <p
        className={cn(
          "font-semibold leading-tight",
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
