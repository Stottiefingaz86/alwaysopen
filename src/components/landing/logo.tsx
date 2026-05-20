import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const LOGO_ICON = "/logo_icon.png";
/** Intrinsic size of public/logo_icon.png — do not squash into a square */
const LOGO_ICON_WIDTH = 480;
const LOGO_ICON_HEIGHT = 262;

export function Logo({ size = "default" }: { size?: "default" | "large" }) {
  const textSize =
    size === "large" ? "text-[1.75rem]" : "text-[1.3125rem] sm:text-[1.375rem]";
  const dotSize = size === "large" ? "text-[1.5rem]" : "text-[1.2rem] sm:text-[1.25rem]";
  const iconSizes =
    size === "large" ? "56px" : "(max-width: 639px) 42px, 44px";

  return (
    <Link
      href="/"
      className={cn(
        "logo-wordmark inline-flex items-center gap-2 overflow-visible leading-none transition-opacity hover:opacity-85 sm:gap-2.5",
        textSize
      )}
      aria-label="RingsAway home"
    >
      <Image
        src={LOGO_ICON}
        alt=""
        width={LOGO_ICON_WIDTH}
        height={LOGO_ICON_HEIGHT}
        sizes={iconSizes}
        quality={100}
        unoptimized
        className="h-[1em] w-auto shrink-0 object-contain"
        aria-hidden
        priority
      />
      <span className="font-logo inline-flex items-baseline">
        <span className="font-medium tracking-[-0.03em] text-google-gray-700">
          Rings
        </span>
        <span className="logo-away-gradient inline-flex items-baseline font-semibold tracking-[-0.03em]">
          Away
          <span
            className={cn(
              "logo-blink ml-0.5 font-semibold leading-none",
              dotSize
            )}
            aria-hidden
          >
            .
          </span>
        </span>
      </span>
    </Link>
  );
}
