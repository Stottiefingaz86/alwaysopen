import { createAdminClient } from "@/lib/supabase/admin";
import {
  caseStudyDisplayTitle,
  type CaseStudyListItem,
} from "@/lib/voc/case-studies";
import { formatTagLabel } from "@/lib/voc/business-tags";
import type { VocReportData } from "@/lib/voc/report-types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const placement = searchParams.get("placement")?.trim() || "voc-carousel";
  const tag = searchParams.get("tag")?.trim().toLowerCase() || null;

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return NextResponse.json({ items: [] });
  }

  const { data: rows, error } = await supabase
    .from("voc_case_studies")
    .select(
      `
      id,
      title,
      tags,
      placements,
      sort_order,
      businesses ( id, name, slug, location, tags ),
      voc_reports ( period, report_data, review_count, status )
    `
    )
    .eq("is_published", true)
    .contains("placements", [placement])
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("case-studies list:", error.message);
    return NextResponse.json({ items: [] });
  }

  const items: CaseStudyListItem[] = [];

  for (const row of rows ?? []) {
    const biz = row.businesses as {
      name: string;
      slug: string;
      location: string | null;
      tags?: string[];
    } | null;
    const rep = row.voc_reports as {
      period: string;
      report_data: VocReportData | null;
      review_count: number;
      status: string;
    } | null;

    if (!biz || !rep || rep.status !== "ready" || !rep.report_data) continue;

    const tags = [
      ...new Set([...(row.tags ?? []), ...(biz.tags ?? [])]),
    ] as string[];

    if (tag && !tags.includes(tag)) continue;

    const data = rep.report_data;
    items.push({
      id: row.id,
      title: caseStudyDisplayTitle(row.title, biz.name),
      businessName: biz.name,
      location: biz.location ?? data.location ?? "—",
      slug: biz.slug,
      period: rep.period,
      tags,
      tagLabels: tags.map(formatTagLabel),
      score: data.score,
      scoreLabel: data.scoreLabel,
      reviewCount: data.reviewCount ?? rep.review_count,
      placements: row.placements as CaseStudyListItem["placements"],
    });
  }

  return NextResponse.json({ items });
}
