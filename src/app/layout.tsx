import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import { JsonLd } from "@/components/landing/json-ld";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const fraunces = Fraunces({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "RingsAway | More bookings, better reviews, happier customers",
  description:
    "RingsAway answers your business phone line with a 24/7 AI receptionist, plus hand-prepared customer feedback reports (VoC) with actions and a Google Business plan.",
  keywords: [
    "local business",
    "AI receptionist",
    "booking automation",
    "Google reviews",
    "voice of customer",
    "customer experience",
  ],
  authors: [{ name: "RingsAway" }],
  openGraph: {
    title: "RingsAway | Get more bookings. Improve reviews.",
    description:
      "Real phone line answered 24/7 by AI, with monthly customer feedback reports and Google Business guidance.",
    type: "website",
    locale: "en_IE",
    siteName: "RingsAway",
  },
  twitter: {
    card: "summary_large_image",
    title: "RingsAway | Local business growth system",
    description:
      "Stop missing calls. Get more bookings. Understand your customers.",
  },
  robots: {
    index: true,
    follow: true,
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
        <JsonLd />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
