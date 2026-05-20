import { newsImageSrc } from "@/lib/news-image-src";
import type { NewsItem } from "@/lib/news-content";
import { cn } from "@/lib/utils";
import Image from "next/image";

type NewsCoverImageProps = {
  item: NewsItem;
  imageVersions: Record<string, string>;
  featured?: boolean;
  className?: string;
  priority?: boolean;
};

export function NewsCoverImage({
  item,
  imageVersions,
  featured = false,
  className,
  priority = false,
}: NewsCoverImageProps) {
  return (
    <div
      className={cn(
        "news-image-overlay relative overflow-hidden bg-google-gray-100",
        featured && "news-image-overlay-featured",
        className
      )}
    >
      <Image
        src={newsImageSrc(item, imageVersions)}
        alt={item.imageAlt}
        fill
        className={cn(
          "object-cover",
          !priority && "transition-transform duration-300 group-hover:scale-[1.03]"
        )}
        sizes={
          featured
            ? "(min-width: 1024px) 224px, (min-width: 768px) 192px, 100vw"
            : "(min-width: 768px) 50vw, 100vw"
        }
        priority={priority}
      />
    </div>
  );
}
