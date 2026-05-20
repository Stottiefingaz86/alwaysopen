import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { NewsIndexContent } from "@/components/landing/news-index-content";
import { getNewsImageVersions } from "@/lib/news-image-versions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & guides for local businesses",
  description:
    "Practical guides on phone-first local business, Google listings, bilingual reception, and monthly customer feedback (VoC) from the RingsAway team in Spain.",
  alternates: {
    canonical: "/news",
  },
};

export default function NewsIndexPage() {
  const imageVersions = getNewsImageVersions();

  return (
    <>
      <Navbar />
      <main className="overflow-x-clip bg-white">
        <NewsIndexContent imageVersions={imageVersions} />
      </main>
      <Footer />
    </>
  );
}
