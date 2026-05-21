import { requireAdminSession } from "@/lib/admin/require-admin";
import { NextResponse } from "next/server";

import { isCaseStudiesTableMissing } from "@/lib/supabase/case-studies-migration-sql";

/** Returns whether required VoC dashboard tables/columns exist. */
export async function GET() {
  const session = await requireAdminSession();
  if (!session.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error: tagsError } = await session.supabase
    .from("businesses")
    .select("tags")
    .limit(1);

  let tagsColumn = true;
  if (tagsError?.message?.includes("tags") && tagsError.message.includes("schema cache")) {
    tagsColumn = false;
  } else if (tagsError) {
    tagsColumn = false;
  }

  const { error: caseError } = await session.supabase
    .from("voc_case_studies")
    .select("id")
    .limit(1);

  let caseStudiesTable = true;
  if (caseError && isCaseStudiesTableMissing(caseError.message)) {
    caseStudiesTable = false;
  } else if (caseError) {
    caseStudiesTable = false;
  }

  return NextResponse.json({
    tagsColumn,
    caseStudiesTable,
    message: caseError?.message ?? tagsError?.message,
  });
}
