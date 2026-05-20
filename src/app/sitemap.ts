import { getSitemapEntries } from "@/lib/sitemap-urls";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return getSitemapEntries();
}
