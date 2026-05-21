import { reviewSourceIconPath } from "@/lib/review-source-icons";
import { cn } from "@/lib/utils";
import Image from "next/image";

type ReviewSourceIconProps = {
  source: string;
  size?: number;
  className?: string;
};

export function ReviewSourceIcon({
  source,
  size = 16,
  className,
}: ReviewSourceIconProps) {
  const src = reviewSourceIconPath(source);

  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", className)}
      style={{ width: size, height: size }}
    />
  );
}
