"use client";

import { CtaButton } from "@/components/landing/cta-button";
import { getPublicBookingUrl, openBookingPopup } from "@/lib/booking";
import { getBookDemoHref } from "@/lib/contact";

type BookDemoButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "default" | "lg";
  className?: string;
};

export function BookDemoButton({
  children,
  variant = "secondary",
  size = "default",
  className,
}: BookDemoButtonProps) {
  const bookingUrl = getPublicBookingUrl();
  const fallbackHref = getBookDemoHref();

  return (
    <CtaButton
      href={bookingUrl ?? fallbackHref}
      variant={variant}
      size={size}
      className={className}
      onClick={(event) => {
        if (!bookingUrl) return;
        event.preventDefault();
        openBookingPopup(bookingUrl);
      }}
    >
      {children}
    </CtaButton>
  );
}
