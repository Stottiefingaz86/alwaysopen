import { requireAdminSession } from "@/lib/admin/require-admin";
import { normalizeBusinessTags } from "@/lib/voc/business-tags";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminSession();
  if (!session.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const tags = normalizeBusinessTags(body?.tags);
  const location =
    typeof body?.location === "string" ? body.location.trim() || null : undefined;

  const updates: { tags: string[]; location?: string | null } = { tags };
  if (location !== undefined) updates.location = location;

  const { data: business, error } = await session.supabase
    .from("businesses")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    const msg = error.message ?? "Could not update business";
    if (msg.includes("tags") && msg.includes("schema cache")) {
      return NextResponse.json(
        {
          error:
            "Database missing businesses.tags — in Supabase SQL Editor run: ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}'; then retry.",
        },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  return NextResponse.json({ business });
}
