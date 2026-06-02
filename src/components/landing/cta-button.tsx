"use client";

import { trackCtaClick } from "@/lib/analytics/gtag";
import Link from "next/link";
import { cn } from "@/lib/utils";

type CtaButtonProps = {
  href: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "default" | "lg";
  className?: string;
  /** Where on the site this CTA lives (hero, navbar, pricing, etc.). */
  analyticsLocation?: string;
  /** Set when a parent fires its own GA event (e.g. book_demo_click). */
  skipCtaAnalytics?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  children: React.ReactNode;
};

const sizes = {
  sm: "min-h-9 gap-2 rounded-xl px-5 py-2 text-sm",
  default: "min-h-11 gap-2 rounded-xl px-6 py-3 text-[15px]",
  lg: "min-h-[3.25rem] gap-2 rounded-xl px-8 py-3.5 text-base sm:min-h-14 sm:px-9 sm:text-[1.0625rem]",
};

const variants = {
  primary: [
    "bg-[var(--pastel-blue-deep)] text-white font-medium",
    "shadow-[var(--shadow-soft)]",
    "hover:bg-[var(--pastel-blue-hover)] hover:shadow-[var(--shadow-float)]",
    "active:scale-[0.98]",
  ],
  secondary: [
    "bg-white text-[var(--google-gray-700)] font-medium",
    "border-[1.5px] border-[var(--google-gray-200)]",
    "shadow-[var(--shadow-soft)]",
    "hover:border-[var(--google-blue)] hover:bg-[var(--pastel-blue)]",
    "active:scale-[0.98]",
  ],
};

function labelFromChildren(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  return "CTA";
}

export function CtaButton({
  href,
  variant = "primary",
  size = "default",
  className,
  analyticsLocation = "unknown",
  skipCtaAnalytics = false,
  onClick,
  children,
}: CtaButtonProps) {
  const classes = cn(
    "inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all",
    sizes[size],
    variants[variant],
    className
  );

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    if (!skipCtaAnalytics) {
      trackCtaClick({
        label: labelFromChildren(children),
        href,
        location: analyticsLocation,
        variant,
      });
    }
    onClick?.(event);
  };

  if (
    href.startsWith("mailto:") ||
    href.startsWith("http") ||
    href.startsWith("#")
  ) {
    return (
      <a
        href={href}
        className={classes}
        onClick={handleClick}
        data-ga-skip-global
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={classes}
      onClick={handleClick}
      data-ga-skip-global
    >
      {children}
    </Link>
  );
}
