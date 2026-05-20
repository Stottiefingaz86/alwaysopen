import fs from "node:fs";
import path from "node:path";
import { newsItems } from "@/lib/news-content";

/** Read mtime of files in public/news so image URLs refresh when you replace a file. */
export function getNewsImageVersions(): Record<string, string> {
  const versions: Record<string, string> = {};

  for (const item of newsItems) {
    const filename = path.basename(item.image);
    const filePath = path.join(process.cwd(), "public", "news", filename);

    try {
      versions[item.slug] = String(Math.floor(fs.statSync(filePath).mtimeMs));
    } catch {
      versions[item.slug] = "0";
    }
  }

  return versions;
}
