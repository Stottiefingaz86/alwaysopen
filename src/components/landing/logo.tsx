import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ size = "default" }: { size?: "default" | "large" }) {
  const textSize =
    size === "large" ? "text-[1.75rem]" : "text-[1.3125rem] sm:text-[1.375rem]";
  const dotSize = size === "large" ? "text-[1.5rem]" : "text-[1.2rem] sm:text-[1.25rem]";

  return (
    <Link
      href="/"
      className={cn(
        "font-logo inline-flex items-baseline leading-none transition-opacity hover:opacity-85",
        textSize
      )}
      aria-label="AlwaysOpen home"
    >
      <span className="font-medium tracking-[-0.03em] text-google-gray-700">
        Always
      </span>
      <span className="font-semibold tracking-[-0.03em] text-google-blue">Open</span>
      <span
        className={cn(
          "logo-blink ml-0.5 font-semibold leading-none text-google-blue",
          dotSize
        )}
        aria-hidden
      >
        .
      </span>
    </Link>
  );
}
