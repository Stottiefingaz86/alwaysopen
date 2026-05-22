"use client";

import type { IntegrationIcon } from "@/lib/integrations";
import { cn } from "@/lib/utils";
import Image from "next/image";

type IntegrationIconProps = {
  icon: IntegrationIcon;
  label: string;
  size?: number;
  className?: string;
};

export function IntegrationBrandIcon({
  icon,
  label,
  size = 16,
  className,
}: IntegrationIconProps) {
  if (icon.kind === "image") {
    return (
      <Image
        src={icon.src}
        alt=""
        width={size}
        height={size}
        className={cn("shrink-0 object-contain", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  const Icon = icon.Icon;
  return (
    <Icon
      className={cn("shrink-0", className)}
      size={size}
      aria-hidden
      title={label}
    />
  );
}
