import { createAdminClient } from "@/lib/supabase/admin";
import {
  caseStudyDisplayTitle,
  DEFAULT_CASE_STUDY_PLACEMENTS,
  type CaseStudyListItem,
} from "@/lib/voc/case-studies";
import { formatTagLabel } from "@/lib/voc/business-tags";
import { caseStudyCardFieldsFromReport } from "@/lib/voc/report-card";
import type { VocReportData } from "@/lib/voc/report-types";
import { isCaseStudiesTableMissing } from "@/lib/supabase/case-studies-migration-sql";

export type ListCaseStudiesResult = {
  items: CaseStudyListItem[];
  error?: string;
  configMissing?: boolean;
  tableMissing?: boolean;
};

export function parsePlacementFilter(raw: string | null | undefined): string[] {
  const value = raw?.trim();
  if (!value) return [...DEFAULT_CASE_STUDY_PLACEMENTS];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function rowMatchesPlacements(
  placements: string[] | null | undefined,
  requested: string[]
): boolean {
  const rowPlacements = placements ?? [];
  return requested.some((p) => rowPlacements.includes(p));
}

/** Server-side list of published landing case studies (homepage cards). */
export async function listPublishedCaseStudies(options?: {
  placements?: string[];
  tag?: string | null;
}): Promise<ListCaseStudiesResult> {
  const requestedPlacements = options?.placements ?? [...DEFAULT_CASE_STUDY_PLACEMENTS];
  const tag = options?.tag?.trim().toLowerCase() || null;

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return {
      items: [],
      configMissing: true,
      error:
        "SUPABASE_SERVICE_ROLE_KEY is not set on the server. Add it in Vercel environment variables and redeploy.",
    };
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
    .order("sort_order", { ascending: true });

  if (error) {
    const msg = error.message ?? "Could not load case studies";
    if (isCaseStudiesTableMissing(msg)) {
      return { items: [], tableMissing: true, error: msg };
    }
    return { items: [], error: msg };
  }

  const items: CaseStudyListItem[] = [];

  for (const row of rows ?? []) {
    if (!rowMatchesPlacements(row.placements as string[] | null, requestedPlacements)) {
      continue;
    }

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
    const cardFields = caseStudyCardFieldsFromReport(data, rep.period);
    items.push({
      id: row.id,
      title: caseStudyDisplayTitle(row.title, biz.name),
      businessName: biz.name,
      location: biz.location ?? data.location ?? "—",
      slug: biz.slug,
      period: rep.period,
      tags,
      tagLabels: tags.map(formatTagLabel),
      placements: row.placements as CaseStudyListItem["placements"],
      ...cardFields,
    });
  }

  return { items };
}
