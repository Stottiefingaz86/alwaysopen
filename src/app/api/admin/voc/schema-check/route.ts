import { requireAdminSession } from "@/lib/admin/require-admin";
import { NextResponse } from "next/server";

/** Returns whether businesses.tags exists (PostgREST schema cache). */
export async function GET() {
  const session = await requireAdminSession();
  if (!session.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await session.supabase
    .from("businesses")
    .select("tags")
    .limit(1);

  if (error?.message?.includes("tags") && error.message.includes("schema cache")) {
    return NextResponse.json({ tagsColumn: false, message: error.message });
  }

  if (error) {
    return NextResponse.json({ tagsColumn: false, message: error.message });
  }

  return NextResponse.json({ tagsColumn: true });
}
