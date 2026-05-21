"use client";

import { motion } from "motion/react";

type VocSentimentChartProps = {
  chartLabel: string;
  trend: string;
  months: readonly string[];
  bars: readonly number[];
  className?: string;
  chartHeight?: number;
};

export function VocSentimentChart({
  chartLabel,
  trend,
  months,
  bars,
  className,
  chartHeight = 112,
}: VocSentimentChartProps) {
  const maxBar = Math.max(...bars, 1);

  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between text-xs text-google-gray-500">
        <span>{chartLabel}</span>
        <span className="font-medium text-google-green">{trend}</span>
      </div>
      <div
        className="flex items-end justify-between gap-1.5 sm:gap-2"
        style={{ height: chartHeight }}
      >
        {bars.map((value, i) => {
          const barHeight = Math.round((value / maxBar) * (chartHeight - 20));

          return (
            <div
              key={months[i]}
              className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5"
            >
              <motion.div
                className="w-full max-w-9 rounded-t-md bg-google-blue/75 sm:max-w-10"
                initial={{ height: 0 }}
                animate={{ height: barHeight }}
                transition={{ delay: 0.05 + i * 0.06, duration: 0.45, ease: "easeOut" }}
                style={{ minHeight: 4 }}
              />
              <span className="shrink-0 text-[10px] text-google-gray-400">{months[i]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
