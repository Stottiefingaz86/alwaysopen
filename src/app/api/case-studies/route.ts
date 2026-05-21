import {
  listPublishedCaseStudies,
  parsePlacementFilter,
} from "@/lib/voc/list-published-case-studies";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const placements = parsePlacementFilter(searchParams.get("placement"));
  const tag = searchParams.get("tag");

  const result = await listPublishedCaseStudies({ placements, tag });

  if (result.configMissing || result.tableMissing) {
    console.error("case-studies list:", result.error);
  }

  return NextResponse.json({
    items: result.items,
    error: result.error,
    configMissing: result.configMissing,
    tableMissing: result.tableMissing,
  });
}
