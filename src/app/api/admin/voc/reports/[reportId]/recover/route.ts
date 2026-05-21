import { requireAdminSession } from "@/lib/admin/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

type RecoverAction = "fail" | "continue";

export async function POST(
  request: Request,
  context: { params: Promise<{ reportId: string }> }
) {
  const session = await requireAdminSession();
  if (!session.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { reportId } = await context.params;
  const body = await request.json().catch(() => ({}));
  const action = body?.action as RecoverAction;

  if (action !== "fail" && action !== "continue") {
    return NextResponse.json(
      { error: 'action must be "fail" or "continue"' },
      { status: 400 }
    );
  }

  const { data: report, error: repErr } = await session.supabase
    .from("voc_reports")
    .select("id, status, review_count, scraped_reviews, business_id")
    .eq("id", reportId)
    .single();

  if (repErr || !report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  if (action === "fail") {
    const { data, error } = await session.supabase
      .from("voc_reports")
      .update({
        status: "failed",
        error_message:
          "Marked failed from dashboard (edge run ended before finishing).",
        updated_at: new Date().toISOString(),
      })
      .eq("id", reportId)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ report: data });
  }

  const hasScrape =
    Array.isArray(report.scraped_reviews) && report.scraped_reviews.length > 0;

  if (!hasScrape && (report.review_count ?? 0) < 1) {
    return NextResponse.json(
      {
        error:
          "No scraped reviews saved yet — use Generate again instead of Continue analysis.",
      },
      { status: 400 }
    );
  }

  await session.supabase
    .from("voc_reports")
    .update({
      status: "analyzing",
      error_message: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reportId);

  try {
    const admin = createAdminClient();
    const { data: fnData, error: fnError } = await admin.functions.invoke(
      "generate-voc-report",
      { body: { report_id: reportId, phase: "analyze" } }
    );

    if (fnError) {
      const detail = fnError.message;
      await session.supabase
        .from("voc_reports")
        .update({
          status: "failed",
          error_message: detail,
          updated_at: new Date().toISOString(),
        })
        .eq("id", reportId);
      return NextResponse.json({ error: detail }, { status: 502 });
    }

    const { data: refreshed } = await session.supabase
      .from("voc_reports")
      .select(
        "id, period, status, public_slug, review_count, generated_at, created_at, updated_at, error_message"
      )
      .eq("id", reportId)
      .single();

    return NextResponse.json({
      ok: true,
      report: refreshed ?? { id: reportId, status: fnData?.status ?? "analyzing" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Continue failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
