import Image from "next/image";
import { cn } from "@/lib/utils";

const WHITE_MARK = "/iconwhite.png";
const BRAND_MARK = "/logo_icon.png";

type RingsAwayMarkProps = {
  className?: string;
  /** White mark on blue/dark UI; full-color mark on light backgrounds */
  variant?: "white" | "brand";
};

export function RingsAwayMark({ className, variant = "white" }: RingsAwayMarkProps) {
  const src = variant === "white" ? WHITE_MARK : BRAND_MARK;

  return (
    <Image
      src={src}
      alt=""
      width={32}
      height={32}
      className={cn("object-contain", className)}
      aria-hidden
    />
  );
}
