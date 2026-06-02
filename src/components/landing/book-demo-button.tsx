"use client";

import { CtaButton } from "@/components/landing/cta-button";
import { trackBookDemoClick } from "@/lib/analytics/gtag";
import { getPublicBookingUrl, openBookingPopup } from "@/lib/booking";
import { getBookDemoHref } from "@/lib/contact";

type BookDemoButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "default" | "lg";
  className?: string;
  analyticsLocation?: string;
};

export function BookDemoButton({
  children,
  variant = "secondary",
  size = "default",
  className,
  analyticsLocation = "unknown",
}: BookDemoButtonProps) {
  const bookingUrl = getPublicBookingUrl();
  const fallbackHref = getBookDemoHref();

  return (
    <CtaButton
      href={bookingUrl ?? fallbackHref}
      variant={variant}
      size={size}
      className={className}
      analyticsLocation={analyticsLocation}
      skipCtaAnalytics
      onClick={(event) => {
        trackBookDemoClick(analyticsLocation);
        if (!bookingUrl) return;
        event.preventDefault();
        openBookingPopup(bookingUrl);
      }}
    >
      {children}
    </CtaButton>
  );
}
