import { getNewsItems } from "@/lib/news-content";
import { SITE_URL } from "@/lib/site";

/** ItemList + CollectionPage for /news — crawlers only. */
export function NewsIndexJsonLd() {
  const items = getNewsItems("en");

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/news#webpage`,
        name: "RingsAway News & guides",
        description:
          "Guides on AI receptionists, missed calls, GSM call routing, bilingual phone lines, and customer feedback for local businesses.",
        url: `${SITE_URL}/news`,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: ["en", "es"],
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/news#itemlist`,
        name: "RingsAway articles",
        numberOfItems: items.length,
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${SITE_URL}/news/${item.slug}`,
          name: item.title,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/news#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "News",
            item: `${SITE_URL}/news`,
          },
        ],
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
