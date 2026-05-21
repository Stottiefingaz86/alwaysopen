import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { Hero } from "@/components/landing/hero";
import { StatsBar } from "@/components/landing/stats-bar";
import { IndustryShowcaseSection } from "@/components/landing/industry-showcase-section";
import { PhoneReceptionistSection } from "@/components/landing/phone-receptionist-section";
import { TrustBar } from "@/components/landing/trust-bar";
import { ProblemSection } from "@/components/landing/problem-section";
import { SolutionSection } from "@/components/landing/solution-section";
import { PipelineSection } from "@/components/landing/pipeline";
import { VocSection } from "@/components/landing/voc-section";
import { NewsSection } from "@/components/landing/news-section";
import { getNewsImageVersions } from "@/lib/news-image-versions";
import { PricingSection } from "@/components/landing/pricing";
import { AddOnsSection } from "@/components/landing/add-ons";
import { AboutSection } from "@/components/landing/about-section";
import { FaqsSection } from "@/components/landing/faqs-section";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";

/** Re-read public/news mtimes when you replace an image file */
export const revalidate = 0;

export const metadata: Metadata = {
  title: `${SITE_NAME} | 24/7 AI receptionist & VoC reports for local business`,
  description:
    "Stop missing calls. RingsAway answers your line 24/7, delivers monthly customer feedback reports from Google reviews, and offers live AI demos by industry including restaurants.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} | 24/7 AI receptionist & VoC reports`,
    description:
      "AI phone answering on your real number, monthly VoC reports, and live industry demos. Based in Manilva, Spain — English and Spanish.",
    url: SITE_URL,
  },
};

export default function Home() {
  const newsImageVersions = getNewsImageVersions();

  return (
    <>
      <Navbar />
      <main className="overflow-x-clip">
        <Hero />
        <PhoneReceptionistSection />
        <IndustryShowcaseSection />
        <StatsBar />
        <TrustBar />
        <ProblemSection />
        <SolutionSection />
        <PipelineSection />
        <VocSection />
        <PricingSection />
        <AddOnsSection />
        <NewsSection imageVersions={newsImageVersions} />
        <AboutSection />
        <FaqsSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
