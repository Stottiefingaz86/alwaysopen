import type { NewsBodyBlock, NewsTextSegment } from "@/lib/news-content";
import Link from "next/link";

function InlineSegments({ segments }: { segments: NewsTextSegment[] }) {
  return (
    <>
      {segments.map((segment, i) =>
        segment.type === "text" ? (
          <span key={i}>{segment.value}</span>
        ) : (
          <Link
            key={i}
            href={segment.href}
            className="font-medium text-google-blue underline-offset-2 hover:underline"
            target={segment.href.startsWith("http") ? "_blank" : undefined}
            rel={segment.href.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {segment.label}
          </Link>
        )
      )}
    </>
  );
}

export function NewsArticleContent({ blocks }: { blocks: NewsBodyBlock[] }) {
  return (
    <div className="space-y-4 text-[15px] leading-relaxed text-google-gray-700">
      {blocks.map((block, i) => {
        if (block.type === "paragraph") {
          return (
            <p key={i}>
              <InlineSegments segments={block.segments} />
            </p>
          );
        }

        if (block.type === "heading") {
          const className =
            block.level === 2
              ? "pt-2 text-xl font-medium tracking-tight text-foreground"
              : "pt-1 text-lg font-medium text-foreground";

          if (block.href) {
            return (
              <h3 key={i} className={className}>
                <Link
                  href={block.href}
                  className="text-google-blue underline-offset-2 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {block.text}
                </Link>
              </h3>
            );
          }

          const Tag = block.level === 2 ? "h2" : "h3";
          return (
            <Tag key={i} className={className}>
              {block.text}
            </Tag>
          );
        }

        return (
          <ul key={i} className="list-disc space-y-2 pl-5">
            {block.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-medium text-google-blue underline-offset-2 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}
