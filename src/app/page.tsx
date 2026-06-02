import type { Metadata } from "next";
import { HomePageAnalytics } from "@/components/analytics/home-page-analytics";
import { Navbar } from "@/components/landing/navbar";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { Hero } from "@/components/landing/hero";
import { StatsBar } from "@/components/landing/stats-bar";
import { PhoneReceptionistSection } from "@/components/landing/phone-receptionist-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { SolutionSection } from "@/components/landing/solution-section";
import { listPublishedCaseStudies } from "@/lib/voc/list-published-case-studies";
import { IntegrationsSection } from "@/components/landing/integrations-section";
import { VocSection } from "@/components/landing/voc-section";
import { NewsSection } from "@/components/landing/news-section";
import { getNewsImageVersions } from "@/lib/news-image-versions";
import { PricingSection } from "@/components/landing/pricing";
import { AboutSection } from "@/components/landing/about-section";
import { FaqsSection } from "@/components/landing/faqs-section";
import { FinalCta } from "@/components/landing/final-cta";
import { ContactSection } from "@/components/landing/contact-section";
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

export default async function Home() {
  const newsImageVersions = getNewsImageVersions();
  const { items: landingCaseStudies } = await listPublishedCaseStudies();

  return (
    <>
      <HomePageAnalytics />
      <Navbar />
      <main className="overflow-x-clip">
        <Hero />
        <PhoneReceptionistSection />
        <SolutionSection initialCaseStudies={landingCaseStudies} />
        <StatsBar />
        <ProblemSection />
        <IntegrationsSection />
        <VocSection />
        <PricingSection />
        <NewsSection imageVersions={newsImageVersions} />
        <AboutSection />
        <FaqsSection />
        <FinalCta />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
