import { requireAdminSession } from "@/lib/admin/require-admin";
import {
  normalizeCaseStudyTags,
  normalizePlacements,
} from "@/lib/voc/case-studies";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await requireAdminSession();
  if (!session.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await session.supabase
    .from("voc_case_studies")
    .select("id, report_id, business_id, title, tags, placements, sort_order, is_published")
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const reportId = typeof body?.report_id === "string" ? body.report_id : "";
  if (!reportId) {
    return NextResponse.json({ error: "report_id is required" }, { status: 400 });
  }

  const { data: report, error: repErr } = await session.supabase
    .from("voc_reports")
    .select("id, business_id, status")
    .eq("id", reportId)
    .maybeSingle();

  if (repErr || !report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  if (report.status !== "ready") {
    return NextResponse.json(
      { error: "Report must be ready before publishing as a case study" },
      { status: 400 }
    );
  }

  const title = typeof body?.title === "string" ? body.title.trim() || null : null;
  const tags = normalizeCaseStudyTags(body?.tags);
  const placements = normalizePlacements(body?.placements);
  const sortOrder =
    typeof body?.sort_order === "number" && Number.isFinite(body.sort_order)
      ? Math.round(body.sort_order)
      : 0;
  const isPublished = body?.is_published !== false;

  const { data, error } = await session.supabase
    .from("voc_case_studies")
    .upsert(
      {
        report_id: reportId,
        business_id: report.business_id,
        title,
        tags,
        placements,
        sort_order: sortOrder,
        is_published: isPublished,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "report_id" }
    )
    .select("*")
    .single();

  if (error) {
    const msg = error.message ?? "Could not save case study";
    if (msg.includes("voc_case_studies") && msg.includes("schema")) {
      return NextResponse.json(
        {
          error:
            "Run migration supabase/migrations/20260521120000_voc_case_studies.sql first.",
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  return NextResponse.json({ item: data });
}

export async function DELETE(request: Request) {
  const session = await requireAdminSession();
  if (!session.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const reportId = searchParams.get("report_id");
  if (!reportId) {
    return NextResponse.json({ error: "report_id required" }, { status: 400 });
  }

  const { error } = await session.supabase
    .from("voc_case_studies")
    .delete()
    .eq("report_id", reportId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
