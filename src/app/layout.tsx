import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import { JsonLd } from "@/components/landing/json-ld";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const fraunces = Fraunces({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | 24/7 AI receptionist for local businesses`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "RingsAway answers your business phone line with a 24/7 AI receptionist, plus hand-prepared Voice of Customer (VoC) reports from Google reviews with sentiment trends, competitor insights, and reply ideas. Try live industry demos for restaurants and more.",
  keywords: [
    "AI receptionist",
    "24/7 phone answering",
    "local business",
    "missed calls",
    "Google Business Profile",
    "Google reviews",
    "voice of customer",
    "VoC report",
    "customer sentiment analysis",
    "review response",
    "booking automation",
    "restaurant phone answering",
    "salon appointment booking",
    "bilingual receptionist",
    "Manilva Spain",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} | AI receptionist & monthly customer feedback reports`,
    description:
      "Your real business number answered 24/7 by AI. Monthly VoC reports with complaints, praise, sentiment charts, and Google reply suggestions.",
    type: "website",
    locale: "en_IE",
    siteName: SITE_NAME,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | 24/7 AI receptionist for local businesses`,
    description:
      "Stop missing calls. Get more bookings. Understand your customers.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable, fraunces.variable)}>
      <body className="min-h-screen overflow-x-clip bg-background font-sans text-foreground antialiased">
        <LocaleProvider>
          <JsonLd />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
