import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function PremiumBlock({
  children,
  className,
  header,
  footer,
}: {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border border-google-gray-200 bg-google-gray-50 shadow-google-card",
        className
      )}
    >
      {header && (
        <div className="border-b border-google-gray-200 bg-white px-6 py-5 md:px-8">
          {header}
        </div>
      )}
      {children}
      {footer && (
        <div className="border-t border-google-gray-200 bg-white px-6 py-4 md:px-8">
          {footer}
        </div>
      )}
    </div>
  );
}

export function PremiumGrid({
  children,
  className,
  cols = "sm:grid-cols-2 lg:grid-cols-3",
}: {
  children: ReactNode;
  className?: string;
  cols?: string;
}) {
  return (
    <div className={cn("grid gap-px bg-google-gray-200", cols, className)}>
      {children}
    </div>
  );
}

export function PremiumCell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "card-interactive group h-full bg-white p-6 transition-colors md:p-7",
        className
      )}
    >
      {children}
    </div>
  );
}

export function PremiumLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full bg-pastel-blue px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-google-blue",
        className
      )}
    >
      {children}
    </span>
  );
}

export function PremiumIcon({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-2xl bg-pastel-blue text-google-blue transition-transform duration-300 group-hover:scale-105",
        className
      )}
    >
      {children}
    </span>
  );
}
