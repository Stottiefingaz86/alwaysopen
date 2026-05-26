import { requireAdminSession } from "@/lib/admin/require-admin";
import { readFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import pg from "pg";

export async function POST() {
  const session = await requireAdminSession();
  if (!session.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUrl = process.env.SUPABASE_DB_URL?.trim();
  if (!dbUrl) {
    return NextResponse.json(
      {
        error:
          "SUPABASE_DB_URL is not set. Add your Supabase transaction pooler URI to .env.local and Vercel, or run supabase/migrations/20260522120000_backoffice.sql in the SQL editor.",
      },
      { status: 400 }
    );
  }

  const sqlPath = join(
    process.cwd(),
    "supabase/migrations/20260522120000_backoffice.sql"
  );
  const sql = await readFile(sqlPath, "utf8");

  const client = new pg.Client({ connectionString: dbUrl });
  try {
    await client.connect();
    await client.query(sql);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Migration failed";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    await client.end();
  }
}
