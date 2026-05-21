import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { enrichReportWithPortfolioBenchmark } from "@/lib/voc/area-benchmark";
import { enrichReportWithReviewCorpus } from "@/lib/voc/theme-reviews";
import type { VocReportData } from "@/lib/voc/report-types";

export async function loadEnrichedCaseStudyReport(
  supabase: SupabaseClient<Database>,
  input: {
    reportId: string;
    businessId: string;
    businessName: string;
    location: string | null;
    tags: string[];
    period: string;
    reportData: VocReportData;
    scrapedReviews: unknown;
  }
): Promise<VocReportData> {
  let report = enrichReportWithReviewCorpus(
    input.reportData,
    input.scrapedReviews as Parameters<typeof enrichReportWithReviewCorpus>[1],
    input.period
  );

  try {
    report = await enrichReportWithPortfolioBenchmark(supabase, {
      businessId: input.businessId,
      businessName: input.businessName,
      location: input.location,
      tags: input.tags,
      period: input.period,
      report,
    });
  } catch {
    /* optional */
  }

  return report;
}
