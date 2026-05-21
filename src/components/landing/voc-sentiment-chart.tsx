"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

type VocSentimentChartProps = {
  chartLabel: string;
  trend: string;
  months: readonly string[];
  bars: readonly number[];
  className?: string;
  chartHeight?: number;
};

function trendStyle(trend: string) {
  if (/↓|declin|down|fall|drop|worse/i.test(trend)) {
    return {
      Icon: TrendingDown,
      badge: "border-amber-200/80 bg-amber-50 text-amber-800",
      bar: "from-google-blue/90 to-google-blue",
      lastBar: "from-amber-500/90 to-amber-600",
    };
  }
  if (/↑|improv|up|rise|better/i.test(trend)) {
    return {
      Icon: TrendingUp,
      badge: "border-google-green/25 bg-google-green/10 text-google-green",
      bar: "from-google-blue/80 to-google-blue",
      lastBar: "from-google-blue to-pastel-blue-deep",
    };
  }
  return {
    Icon: Minus,
    badge: "border-google-gray-200 bg-google-gray-50 text-google-gray-600",
    bar: "from-google-blue/70 to-google-blue/90",
    lastBar: "from-google-blue/90 to-google-blue",
  };
}

function chartDomain(bars: readonly number[]) {
  const min = Math.min(...bars);
  const max = Math.max(...bars);
  const spread = max - min;
  const padding = spread <= 6 ? 8 : spread <= 15 ? 6 : 4;
  const floor = Math.max(0, Math.floor(min - padding));
  const ceiling = Math.min(100, Math.ceil(max + 2));
  return { min: floor, max: ceiling === floor ? floor + 10 : ceiling };
}

function yTicks(min: number, max: number): number[] {
  const span = max - min;
  if (span <= 12) {
    const mid = Math.round((min + max) / 2);
    return [...new Set([min, mid, max])].sort((a, b) => a - b);
  }
  const step = span <= 25 ? 10 : 20;
  const ticks: number[] = [];
  const start = Math.ceil(min / step) * step;
  for (let v = start; v <= max; v += step) ticks.push(v);
  if (!ticks.includes(min)) ticks.unshift(min);
  if (!ticks.includes(max)) ticks.push(max);
  return [...new Set(ticks)].sort((a, b) => a - b);
}

export function VocSentimentChart({
  chartLabel,
  trend,
  months,
  bars,
  className,
  chartHeight = 140,
}: VocSentimentChartProps) {
  const { min: domainMin, max: domainMax } = chartDomain(bars);
  const range = domainMax - domainMin || 1;
  const plotHeight = chartHeight - 28;
  const ticks = yTicks(domainMin, domainMax);
  const style = trendStyle(trend);
  const TrendIcon = style.Icon;
  const lastIndex = bars.length - 1;

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-google-gray-700">{chartLabel}</span>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
            style.badge
          )}
        >
          <TrendIcon className="size-3.5 shrink-0" aria-hidden />
          {trend.replace(/^[↑↓→]\s*/, "")}
        </span>
      </div>

      <div className="flex gap-3">
        <div
          className="relative w-8 shrink-0 text-[10px] tabular-nums text-google-gray-400"
          style={{ height: plotHeight }}
          aria-hidden
        >
          {ticks.map((tick) => {
            const topPct = (1 - (tick - domainMin) / range) * 100;
            return (
              <span
                key={tick}
                className="absolute right-0 -translate-y-1/2"
                style={{ top: `${topPct}%` }}
              >
                {tick}
              </span>
            );
          })}
        </div>

        <div className="relative min-w-0 flex-1">
          <div
            className="pointer-events-none absolute inset-x-0 top-0"
            style={{ height: plotHeight }}
            aria-hidden
          >
            {ticks.map((tick) => {
              const topPct = (1 - (tick - domainMin) / range) * 100;
              return (
                <div
                  key={tick}
                  className="absolute left-0 right-0 border-t border-dashed border-google-gray-200"
                  style={{ top: `${topPct}%` }}
                />
              );
            })}
          </div>

          <div
            className="relative flex items-end justify-between gap-2 sm:gap-3"
            style={{ height: plotHeight }}
          >
            {bars.map((value, i) => {
              const pct = (value - domainMin) / range;
              const barHeight = Math.max(6, Math.round(pct * (plotHeight - 22)));
              const isLast = i === lastIndex;

              return (
                <div
                  key={`${months[i]}-${i}`}
                  className="flex min-w-0 flex-1 flex-col items-center"
                >
                  <span className="mb-1 text-[10px] font-medium tabular-nums text-google-gray-600">
                    {value}
                  </span>
                  <motion.div
                    className={cn(
                      "w-full max-w-11 rounded-t-md bg-gradient-to-t sm:max-w-12",
                      isLast ? style.lastBar : style.bar
                    )}
                    initial={{ height: 0 }}
                    animate={{ height: barHeight }}
                    transition={{
                      delay: 0.04 + i * 0.05,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                    title={`${months[i]}: ${value}`}
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-2 flex justify-between gap-2">
            {months.map((month, i) => (
              <span
                key={`${month}-${i}`}
                className={cn(
                  "min-w-0 flex-1 truncate text-center text-[10px]",
                  i === lastIndex
                    ? "font-medium text-google-gray-700"
                    : "text-google-gray-400"
                )}
              >
                {month}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
