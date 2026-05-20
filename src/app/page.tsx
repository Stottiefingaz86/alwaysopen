import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { StatsBar } from "@/components/landing/stats-bar";
import { PhoneReceptionistSection } from "@/components/landing/phone-receptionist-section";
import { TrustBar } from "@/components/landing/trust-bar";
import { ProblemSection } from "@/components/landing/problem-section";
import { SolutionSection } from "@/components/landing/solution-section";
import { PipelineSection } from "@/components/landing/pipeline";
import { VocSection } from "@/components/landing/voc-section";
import { UseCasesSection } from "@/components/landing/use-cases";
import { PricingSection } from "@/components/landing/pricing";
import { AddOnsSection } from "@/components/landing/add-ons";
import { FaqsSection } from "@/components/landing/faqs-section";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-clip">
        <Hero />
        <PhoneReceptionistSection />
        <StatsBar />
        <TrustBar />
        <ProblemSection />
        <SolutionSection />
        <PipelineSection />
        <VocSection />
        <UseCasesSection />
        <PricingSection />
        <AddOnsSection />
        <FaqsSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
