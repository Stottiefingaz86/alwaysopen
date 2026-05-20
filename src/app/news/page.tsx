import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { NewsCoverImage } from "@/components/landing/news-cover-image";
import {
  categoryLabels,
  formatNewsDate,
  newsItems,
} from "@/lib/news-content";
import { getNewsImageVersions } from "@/lib/news-image-versions";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "News & guides for local businesses",
  description:
    "Practical guides on phone-first local business, Google listings, bilingual reception, and monthly customer feedback (VoC) from the RingsAway team in Spain.",
  alternates: {
    canonical: "/news",
  },
  openGraph: {
    title: `News & guides | ${SITE_NAME}`,
    description:
      "Updates and practical tips for salons, clinics, trades, and local shops.",
    url: `${SITE_URL}/news`,
    type: "website",
  },
};

export default function NewsIndexPage() {
  const imageVersions = getNewsImageVersions();

  return (
    <>
      <Navbar />
      <main className="overflow-x-clip bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <header className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-wider text-google-blue">
              News
            </p>
            <h1 className="mt-3 text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              Updates and guides
            </h1>
            <p className="mt-4 text-base leading-relaxed text-google-gray-500">
              Product news and practical tips for phone-first local businesses,
              from our team in Manilva, Spain.
            </p>
          </header>

          <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:mt-12">
            {newsItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/news/${item.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-google-gray-200 bg-white shadow-google-card transition-all hover:border-google-blue/30 hover:shadow-google-elevated"
                >
                  <NewsCoverImage
                    item={item}
                    imageVersions={imageVersions}
                    className="h-40 w-full"
                  />
                  <div className="flex flex-1 flex-col p-5 md:p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                          item.category === "article"
                            ? "bg-pastel-blue text-google-blue"
                            : "bg-google-green/10 text-google-green"
                        )}
                      >
                        {categoryLabels[item.category]}
                      </span>
                      <time
                        className="text-xs text-google-gray-500"
                        dateTime={item.date}
                      >
                        {formatNewsDate(item.date)}
                      </time>
                    </div>
                    <h2 className="mt-3 text-lg font-medium leading-snug text-foreground group-hover:text-google-blue">
                      {item.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-google-gray-600">
                      {item.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-google-blue">
                      Read article
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-center text-sm text-google-gray-500">
            <Link href="/" className="font-medium text-google-blue hover:underline">
              ← Back to homepage
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
