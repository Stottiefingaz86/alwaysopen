"use client";

import { FadeIn, Section, SectionHeader } from "@/components/ui/section";
import {
  categoryLabels,
  formatNewsDate,
  newsItems,
  type NewsItem,
} from "@/lib/news-content";
import { NewsCoverImage } from "@/components/landing/news-cover-image";
import { cn } from "@/lib/utils";
import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";

function CategoryBadge({ category }: { category: NewsItem["category"] }) {
  const styles = {
    article: "bg-pastel-blue text-google-blue",
    update: "bg-google-green/10 text-google-green",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles[category]
      )}
    >
      {categoryLabels[category]}
    </span>
  );
}

function NewsCard({
  item,
  imageVersions,
  featured = false,
}: {
  item: NewsItem;
  imageVersions: Record<string, string>;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-google-gray-200 bg-white text-left shadow-google-card transition-all hover:border-google-blue/30 hover:shadow-google-elevated",
        featured && "md:flex-row md:items-stretch"
      )}
    >
      <NewsCoverImage
        item={item}
        imageVersions={imageVersions}
        featured={featured}
        className={cn(
          "shrink-0",
          featured ? "h-48 w-full md:h-auto md:w-48 lg:w-56" : "h-40 w-full"
        )}
      />

      <div className={cn("flex flex-1 flex-col p-5 md:p-6", featured && "justify-center")}>
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={item.category} />
          <time className="text-xs text-google-gray-500" dateTime={item.date}>
            {formatNewsDate(item.date)}
          </time>
          <span className="text-xs text-google-gray-400">· {item.readTime}</span>
        </div>

        <h3
          className={cn(
            "mt-3 font-medium leading-snug text-foreground group-hover:text-google-blue",
            featured ? "text-xl md:text-2xl" : "text-lg"
          )}
        >
          {item.title}
        </h3>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-google-gray-600">
          {item.excerpt}
        </p>

        {item.tags && item.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-md bg-google-gray-50 px-2 py-0.5 text-xs text-google-gray-500"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-google-blue">
          Read more
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export function NewsSection({
  imageVersions,
}: {
  imageVersions: Record<string, string>;
}) {
  const [featured, ...rest] = newsItems;

  return (
    <Section id="news" background="pattern">
      <SectionHeader
        eyebrow="News"
        title="Updates and guides"
        subtitle="Product news and practical tips for phone-first local businesses, from our team in Manilva, Spain."
      />

      <div className="space-y-6">
        <FadeIn>
          <div className="flex items-end justify-between gap-4 border-b border-google-gray-200 pb-3">
            <h3 className="text-lg font-medium text-foreground">Latest</h3>
            <Link
              href="/news"
              className="hidden text-sm font-medium text-google-blue hover:underline sm:inline"
            >
              <Calendar className="mr-1.5 inline size-4 -translate-y-px" />
              View all articles
            </Link>
          </div>
        </FadeIn>

        {featured && (
          <FadeIn>
            <NewsCard
              item={featured}
              imageVersions={imageVersions}
              featured
            />
          </FadeIn>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          {rest.map((item, i) => (
            <FadeIn key={item.id} delay={0.06 + i * 0.05}>
              <NewsCard item={item} imageVersions={imageVersions} />
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <p className="text-center sm:hidden">
            <Link
              href="/news"
              className="text-sm font-medium text-google-blue hover:underline"
            >
              View all articles →
            </Link>
          </p>
        </FadeIn>
      </div>
    </Section>
  );
}
