import { requireAdminSession } from "@/lib/admin/require-admin";
import { CASE_STUDIES_MIGRATION_SQL } from "@/lib/supabase/case-studies-migration-sql";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await requireAdminSession();
  if (!session.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUrl = process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    return NextResponse.json(
      {
        ok: false,
        needsManualSql: true,
        sql: CASE_STUDIES_MIGRATION_SQL,
        error:
          "Add SUPABASE_DB_URL to .env.local (Supabase → Database → Transaction pooler URI). Or run the SQL in Supabase SQL Editor.",
      },
      { status: 400 }
    );
  }

  try {
    const { default: pg } = await import("pg");
    const client = new pg.Client({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
    });
    await client.connect();
    await client.query(CASE_STUDIES_MIGRATION_SQL);
    await client.end();
    return NextResponse.json({ ok: true, message: "voc_case_studies table created" });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Migration failed";
    return NextResponse.json(
      {
        ok: false,
        needsManualSql: true,
        sql: CASE_STUDIES_MIGRATION_SQL,
        error: message,
      },
      { status: 500 }
    );
  }
}
