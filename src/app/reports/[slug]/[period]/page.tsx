import { PublicReportView } from "@/components/voc/public-report-view";
import { Logo } from "@/components/landing/logo";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { enrichReportWithPortfolioBenchmark } from "@/lib/voc/area-benchmark";
import { enrichReportWithReviewCorpus } from "@/lib/voc/theme-reviews";
import type { VocReportData } from "@/lib/voc/report-types";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string; period: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, period } = await params;
  const row = await fetchReport(slug, period);
  if (!row?.report.report_data) {
    return { title: "Report not found", robots: { index: false } };
  }
  const data = row.report.report_data as unknown as VocReportData;
  return {
    title: `${data.businessName} · VoC ${data.period}`,
    description: `Voice of Customer report for ${data.businessName} (${period}).`,
    robots: { index: false, follow: false },
  };
}

async function fetchReport(slug: string, period: string) {
  const supabase = await createClient();
  const { data: business } = await supabase
    .from("businesses")
    .select("id, name, slug, location, tags")
    .eq("slug", slug)
    .maybeSingle();

  if (!business) return null;

  const { data: report } = await supabase
    .from("voc_reports")
    .select("report_data, scraped_reviews, status, period, generated_at, review_count")
    .eq("business_id", business.id)
    .eq("period", period)
    .eq("status", "ready")
    .maybeSingle();

  if (!report?.report_data) return null;
  return { business, report };
}

export default async function PublicReportPage({ params }: Props) {
  const { slug, period } = await params;
  const row = await fetchReport(slug, period);
  if (!row?.report.report_data) notFound();

  let reportData = row.report.report_data as unknown as VocReportData;

  const scraped = row.report.scraped_reviews as
    | Parameters<typeof enrichReportWithReviewCorpus>[1]
    | null;
  reportData = enrichReportWithReviewCorpus(reportData, scraped, period);

  try {
    const admin = createAdminClient();
    reportData = await enrichReportWithPortfolioBenchmark(admin, {
      businessId: row.business.id,
      businessName: row.business.name,
      location: row.business.location,
      tags: row.business.tags,
      period,
      report: reportData,
    });
  } catch {
    // Show stored report if enrichment unavailable (e.g. missing service role locally)
  }

  return (
    <div className="min-h-screen bg-google-gray-50">
      <div className="gradient-brand h-1 w-full" />
      <div className="border-b border-google-gray-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/">
            <Logo />
          </Link>
          <Link
            href="/"
            className="text-sm text-google-blue hover:underline"
          >
            ringsaway.com
          </Link>
        </div>
      </div>
      <PublicReportView
        report={reportData}
        businessSlug={slug}
        period={period}
      />
    </div>
  );
}
