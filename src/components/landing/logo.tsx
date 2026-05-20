import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const LOGO_ICON = "/logo_icon.png";

export function Logo({ size = "default" }: { size?: "default" | "large" }) {
  const textSize =
    size === "large" ? "text-[1.75rem]" : "text-[1.3125rem] sm:text-[1.375rem]";
  const dotSize = size === "large" ? "text-[1.5rem]" : "text-[1.2rem] sm:text-[1.25rem]";

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 overflow-visible leading-none transition-opacity hover:opacity-85 sm:gap-2.5",
        textSize
      )}
      aria-label="RingsAway home"
    >
      <Image
        src={LOGO_ICON}
        alt=""
        width={32}
        height={32}
        className="h-[1em] w-auto shrink-0 object-contain"
        aria-hidden
        priority
      />
      <span className="font-logo inline-flex items-baseline">
        <span className="font-medium tracking-[-0.03em] text-google-gray-700">
          Rings
        </span>
        <span className="font-semibold tracking-[-0.03em] text-google-blue">
          Away
        </span>
        <span
          className={cn(
            "logo-blink ml-0.5 font-semibold leading-none text-google-blue",
            dotSize
          )}
          aria-hidden
        >
          .
        </span>
      </span>
    </Link>
  );
}
