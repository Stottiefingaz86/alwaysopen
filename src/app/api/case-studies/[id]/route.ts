import { createAdminClient } from "@/lib/supabase/admin";
import { caseStudyDisplayTitle } from "@/lib/voc/case-studies";
import { loadEnrichedCaseStudyReport } from "@/lib/voc/load-case-study-report";
import type { VocReportData } from "@/lib/voc/report-types";
import { NextResponse } from "next/server";

type Props = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Props) {
  const { id } = await params;

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }

  const { data: row, error } = await supabase
    .from("voc_case_studies")
    .select(
      `
      id,
      title,
      tags,
      is_published,
      businesses ( id, name, slug, location, tags ),
      voc_reports!inner ( id, period, report_data, scraped_reviews, status )
    `
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!row.is_published) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const biz = row.businesses as {
    id: string;
    name: string;
    slug: string;
    location: string | null;
    tags: string[];
  } | null;
  const rep = row.voc_reports as {
    id: string;
    period: string;
    report_data: VocReportData | null;
    scraped_reviews: unknown;
    status: string;
  } | null;

  if (!biz || !rep || rep.status !== "ready" || !rep.report_data) {
    return NextResponse.json({ error: "Report not ready" }, { status: 404 });
  }

  const report = await loadEnrichedCaseStudyReport(supabase, {
    reportId: rep.id,
    businessId: biz.id,
    businessName: biz.name,
    location: biz.location,
    tags: [...new Set([...(row.tags ?? []), ...(biz.tags ?? [])])],
    period: rep.period,
    reportData: rep.report_data,
    scrapedReviews: rep.scraped_reviews,
  });

  return NextResponse.json({
    id: row.id,
    title: caseStudyDisplayTitle(row.title, biz.name),
    businessSlug: biz.slug,
    period: rep.period,
    report,
  });
}
