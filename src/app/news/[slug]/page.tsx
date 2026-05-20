import { ArticleJsonLd } from "@/components/landing/article-json-ld";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { NewsArticleView } from "@/components/landing/news-article-view";
import {
  getAllNewsSlugs,
  getNewsItemBySlug,
} from "@/lib/news-content";
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
  const article = getNewsItemBySlug(slug);

  if (!article) {
    return { title: "Article not found" };
  }

  const canonical = `/news/${slug}`;

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      url: `${SITE_URL}${canonical}`,
      siteName: SITE_NAME,
      images: [
        {
          url: article.image,
          alt: article.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getNewsItemBySlug(slug);

  if (!article) {
    notFound();
  }

  const imageVersions = getNewsImageVersions();

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
