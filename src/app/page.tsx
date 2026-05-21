import { Navbar } from "@/components/landing/navbar";
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
