import { requireAdminSession } from "@/lib/admin/require-admin";
import { normalizeBusinessTags } from "@/lib/voc/business-tags";
import { uniqueSlug } from "@/lib/voc/slug";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const googlePlaceId =
    typeof body?.google_place_id === "string" ? body.google_place_id.trim() : "";
  const location =
    typeof body?.location === "string" ? body.location.trim() : null;
  const tags = normalizeBusinessTags(body?.tags);

  if (!name || !googlePlaceId) {
    return NextResponse.json(
      { error: "Business name and Google Place ID are required" },
      { status: 400 }
    );
  }

  const { data: existing } = await session.supabase.from("businesses").select("slug");
  const taken = new Set((existing ?? []).map((r) => r.slug));
  const slug = uniqueSlug(name, taken);

  const { data: business, error } = await session.supabase
    .from("businesses")
    .insert({
      name,
      slug,
      google_place_id: googlePlaceId,
      location: location || null,
      tags,
      review_source: "google",
    })
    .select("*")
    .single();

  if (error) {
    const msg = error.message ?? "Could not add business";
    if (msg.includes("tags") && msg.includes("schema cache")) {
      return NextResponse.json(
        {
          error:
            "Database missing businesses.tags — run scripts/apply-business-tags.mjs or SQL: ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';",
        },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  return NextResponse.json({
    business: { ...business, voc_reports: [] },
  });
}
