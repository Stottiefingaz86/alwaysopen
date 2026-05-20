"use client";

import { ArticleJsonLd } from "@/components/landing/article-json-ld";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { NewsArticleView } from "@/components/landing/news-article-view";
import { useLocale } from "@/components/providers/locale-provider";
import { getNewsItemBySlug } from "@/lib/news-content";
import { notFound } from "next/navigation";

export function NewsArticleClient({
  slug,
  imageVersions,
}: {
  slug: string;
  imageVersions: Record<string, string>;
}) {
  const { locale } = useLocale();
  const article = getNewsItemBySlug(slug, locale);

  if (!article) {
    notFound();
  }

  return (
    <>
      <ArticleJsonLd article={article} />
      <Navbar />
      <main className="overflow-x-clip bg-white">
        <NewsArticleView article={article} imageVersions={imageVersions} />
      </main>
      <Footer />
    </>
  );
}
