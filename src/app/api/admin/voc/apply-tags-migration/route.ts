import { requireAdminSession } from "@/lib/admin/require-admin";
import { NextResponse } from "next/server";

const TAGS_SQL = `ALTER TABLE public.businesses
ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';`;

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
        sql: TAGS_SQL,
        error:
          "Add SUPABASE_DB_URL to .env.local (Supabase → Project Settings → Database → URI, use Transaction pooler). Or run the SQL in the dashboard callout.",
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
    await client.query(TAGS_SQL);
    await client.end();
    return NextResponse.json({ ok: true, message: "tags column added" });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Migration failed";
    return NextResponse.json(
      { ok: false, needsManualSql: true, sql: TAGS_SQL, error: message },
      { status: 500 }
    );
  }
}
