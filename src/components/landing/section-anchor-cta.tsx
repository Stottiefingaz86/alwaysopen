"use client";

import { CtaButton } from "@/components/landing/cta-button";
import { scrollToAnchor } from "@/lib/hash-navigation";

type SectionAnchorCtaProps = {
  targetId: string;
  label: string;
  size?: "sm" | "default" | "lg";
  className?: string;
  analyticsLocation?: string;
};

export function SectionAnchorCta({
  targetId,
  label,
  size = "default",
  className,
  analyticsLocation = "section_anchor",
}: SectionAnchorCtaProps) {
  const hash = `#${targetId}`;

  return (
    <CtaButton
      href={hash}
      size={size}
      className={className}
      analyticsLocation={analyticsLocation}
      onClick={(e) => {
        e.preventDefault();
        scrollToAnchor(targetId);
        if (window.location.hash !== hash) {
          window.history.replaceState(null, "", hash);
        }
      }}
    >
      {label}
    </CtaButton>
  );
}
