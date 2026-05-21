import { en } from "@/lib/i18n/messages/en";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const faqItems = en.faq.items;

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
          "RingsAway provides 24/7 AI phone receptionists and hand-prepared Voice of Customer reports for local businesses, with Google Business guidance and industry-specific demos.",
        areaServed: "Worldwide",
        knowsLanguage: ["en", "es"],
      },
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#localbusiness`,
        name: SITE_NAME,
        url: SITE_URL,
        description:
          "AI phone receptionist and monthly customer feedback (VoC) reports for salons, clinics, restaurants, trades, and local shops.",
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
          { "@type": "Place", name: "Costa del Sol" },
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
        inLanguage: ["en", "es"],
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#ai-receptionist`,
        name: "AI Receptionist",
        provider: { "@id": `${SITE_URL}/#organization` },
        serviceType: "24/7 AI phone answering for local businesses",
        areaServed: "Worldwide",
        description:
          "Answers your existing business phone number, books appointments, handles FAQs, and supports English and Spanish callers.",
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#voc-reports`,
        name: "Monthly customer feedback (VoC) reports",
        provider: { "@id": `${SITE_URL}/#organization` },
        serviceType: "Voice of the Customer reporting",
        description:
          "Hand-prepared monthly reports covering top complaints, praise themes, customer sentiment trends, competitor comparisons, suggested Google review replies, and a prioritised action plan.",
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#demos`,
        name: `${SITE_NAME} industry demos`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
          description: "Live AI receptionist demos by industry",
        },
        featureList: [
          "Restaurant AI receptionist demo",
          "Salon demo (coming soon)",
          "Estate agency demo (coming soon)",
          "Clinic demo (coming soon)",
        ],
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
