import { requireAdminSession } from "@/lib/admin/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { currentPeriodKey } from "@/lib/voc/period";
import { reportPublicSlug } from "@/lib/voc/slug";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const businessId =
    typeof body?.business_id === "string" ? body.business_id : "";
  const period =
    typeof body?.period === "string" ? body.period : currentPeriodKey();

  if (!businessId) {
    return NextResponse.json({ error: "business_id required" }, { status: 400 });
  }

  const { data: business, error: bizError } = await session.supabase
    .from("businesses")
    .select("*")
    .eq("id", businessId)
    .single();

  if (bizError || !business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const publicSlug = reportPublicSlug(business.slug, period);

  const { data: report, error: upsertError } = await session.supabase
    .from("voc_reports")
    .upsert(
      {
        business_id: business.id,
        period,
        public_slug: publicSlug,
        status: "pending",
        error_message: null,
      },
      { onConflict: "business_id,period" }
    )
    .select("*")
    .single();

  if (upsertError || !report) {
    return NextResponse.json(
      { error: upsertError?.message ?? "Could not create report row" },
      { status: 400 }
    );
  }

  try {
    const admin = createAdminClient();
    const { data: fnData, error: fnError } = await admin.functions.invoke(
      "generate-voc-report",
      { body: { report_id: report.id } }
    );

    if (fnError) {
      const ctx = fnError as { context?: Response };
      let detail = fnError.message;
      try {
        const body = await ctx.context?.json();
        if (body && typeof body === "object" && "error" in body) {
          detail = String((body as { error: unknown }).error);
        } else if (body && typeof body === "object" && "message" in body) {
          detail = String((body as { message: unknown }).message);
        }
      } catch {
        try {
          const text = await ctx.context?.text();
          if (text?.trim()) detail = text.slice(0, 500);
        } catch {
          /* ignore */
        }
      }

      await admin
        .from("voc_reports")
        .update({
          status: "failed",
          error_message: detail,
        })
        .eq("id", report.id);
      return NextResponse.json({ error: detail }, { status: 502 });
    }

    // Edge returns 202 quickly and finishes in background
    const accepted = fnData?.accepted === true;
    const updated = fnData?.report as typeof report | undefined;
    return NextResponse.json({
      accepted,
      report: updated ?? { ...report, status: "scraping" as const },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Pipeline failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
