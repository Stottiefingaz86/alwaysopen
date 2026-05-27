"use client";

import { localeNames, type Locale } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";
import Image from "next/image";

const flagSrc: Record<Locale, string> = {
  en: "/flags/gb.svg",
  es: "/flags/es.svg",
};

function FlagAvatar({
  locale,
  size = "md",
  className,
}: {
  locale: Locale;
  size?: "sm" | "md";
  className?: string;
}) {
  const px = size === "sm" ? 20 : 24;
  return (
    <Image
      src={flagSrc[locale]}
      alt=""
      width={px}
      height={px}
      className={cn(
        "shrink-0 rounded-full bg-white ring-[1.5px] ring-white shadow-sm",
        size === "sm" ? "size-5" : "size-6",
        className
      )}
      aria-hidden
    />
  );
}

type DemoLanguageAvatarsProps = {
  primary: Locale;
  secondary?: Locale;
  className?: string;
};

/** Overlapping flag avatars for live demo cards (top-right). */
export function DemoLanguageAvatars({
  primary,
  secondary,
  className,
}: DemoLanguageAvatarsProps) {
  const label = secondary
    ? `${localeNames[primary]}, ${localeNames[secondary]}`
    : localeNames[primary];

  if (!secondary) {
    return (
      <div
        className={cn("absolute right-5 top-5", className)}
        title={label}
        aria-label={label}
      >
        <FlagAvatar locale={primary} />
      </div>
    );
  }

  return (
    <div
      className={cn("absolute right-5 top-5", className)}
      title={label}
      aria-label={label}
    >
      <div className="flex items-center">
        <FlagAvatar
          locale={secondary}
          size="sm"
          className="relative z-0 -mr-2 ring-google-gray-200/80"
        />
        <FlagAvatar locale={primary} className="relative z-10" />
      </div>
    </div>
  );
}
