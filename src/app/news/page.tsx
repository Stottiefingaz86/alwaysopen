import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { NewsIndexContent } from "@/components/landing/news-index-content";
import { NewsIndexJsonLd } from "@/components/landing/news-index-json-ld";
import { getNewsImageVersions } from "@/lib/news-image-versions";
import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "News & guides for local businesses",
  description:
    "Guides for local businesses: AI phone answering, Google listings, bilingual reception, VoC reports, and local SEO tips including Sotogrande hospitality from the RingsAway team in Manilva, Spain.",
  alternates: {
    canonical: "/news",
  },
  openGraph: {
    url: `${SITE_URL}/news`,
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function NewsIndexPage() {
  const imageVersions = getNewsImageVersions();

  return (
    <>
      <NewsIndexJsonLd />
      <Navbar />
      <main className="overflow-x-clip bg-white">
        <Suspense
          fallback={
            <div className="mx-auto max-w-6xl px-4 py-16 text-center text-sm text-google-gray-500">
              Loading…
            </div>
          }
        >
          <NewsIndexContent imageVersions={imageVersions} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
