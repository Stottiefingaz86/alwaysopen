import { BookDemoSection } from "@/components/landing/book-demo-section";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a demo | RingsAway",
  description:
    "Pick a time for a RingsAway demo. Video calls use Google Meet when you book through our calendar.",
  alternates: {
    canonical: "/book-demo",
  },
  openGraph: {
    url: `${SITE_URL}/book-demo`,
  },
  robots: { index: true, follow: true },
};

export default function BookDemoPage() {
  return (
    <>
      <Navbar />
      <main className="pt-6 md:pt-10">
        <BookDemoSection />
      </main>
      <Footer />
    </>
  );
}
