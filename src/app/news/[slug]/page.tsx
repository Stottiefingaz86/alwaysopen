import { NewsArticleClient } from "@/app/news/[slug]/news-article-client";
import { getNewsItemBySlug, getAllNewsSlugs } from "@/lib/news-content";
import { getNewsImageVersions } from "@/lib/news-image-versions";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsItemBySlug(slug, "en");

  if (!article) {
    return { title: "Article not found" };
  }

  const canonical = `/news/${slug}`;

  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.tags,
    alternates: { canonical },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      url: `${SITE_URL}${canonical}`,
      siteName: SITE_NAME,
      images: [{ url: `${SITE_URL}${article.image}`, alt: article.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [`${SITE_URL}${article.image}`],
    },
    robots: { index: true, follow: true },
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getNewsItemBySlug(slug, "en");

  if (!article) {
    notFound();
  }

  const imageVersions = getNewsImageVersions();

  return <NewsArticleClient slug={slug} imageVersions={imageVersions} />;
}
