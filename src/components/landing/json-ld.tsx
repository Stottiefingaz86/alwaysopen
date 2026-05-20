import { faqItems } from "@/lib/faq-content";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        description:
          "RingsAway answers local business phone lines with a 24/7 AI receptionist and delivers hand-prepared customer feedback (VoC) reports with Google Business guidance.",
        areaServed: "Worldwide",
        knowsLanguage: ["en", "es"],
      },
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#localbusiness`,
        name: SITE_NAME,
        url: SITE_URL,
        description:
          "AI phone receptionist and monthly customer feedback reports for salons, clinics, trades, and local shops.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Manilva",
          addressRegion: "Málaga",
          addressCountry: "ES",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 36.376,
          longitude: -5.245,
        },
        areaServed: [
          { "@type": "Country", name: "Spain" },
          { "@type": "Place", name: "Worldwide" },
        ],
        priceRange: "€€",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en",
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#ai-receptionist`,
        name: "AI Receptionist",
        provider: { "@id": `${SITE_URL}/#organization` },
        serviceType: "24/7 AI phone answering for local businesses",
        areaServed: "Worldwide",
        description:
          "Answers your existing business phone number, books appointments, and handles FAQs.",
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
