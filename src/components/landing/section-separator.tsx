"use client";

import { cn } from "@/lib/utils";

type SectionSeparatorProps = {
  src: string;
  width: number;
  height: number;
  className?: string;
};

/** Full-width decorative PNG — no FadeIn so transforms are not clipped by page overflow-x. */
export function SectionSeparator({
  src,
  width,
  height,
  className,
}: SectionSeparatorProps) {
  return (
    <div
      className={cn(
        "relative z-20 block w-full overflow-visible",
        className
      )}
    >
      {/* block img only — avoid leading-[0] which clips the top of tall PNGs */}
      <img
        src={src}
        alt=""
        width={width}
        height={height}
        decoding="async"
        className="block h-auto w-full max-w-none"
        aria-hidden
      />
    </div>
  );
}
