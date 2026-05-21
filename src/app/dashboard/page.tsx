import { DashboardClient } from "@/app/dashboard/dashboard-client";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await requireAdminSession();
  if (!session.ok) {
    redirect("/login");
  }

  let businesses: DashboardBusiness[] = [];
  let tagsColumnMissing = false;

  const withTags = await session.supabase
    .from("businesses")
    .select("*, voc_reports(*)")
    .order("created_at", { ascending: false });

  if (withTags.error?.message?.includes("tags") && withTags.error.message.includes("schema")) {
    tagsColumnMissing = true;
    const fallback = await session.supabase
      .from("businesses")
      .select(
        "id, name, slug, google_place_id, location, review_source, created_at, voc_reports(*)"
      )
      .order("created_at", { ascending: false });
    businesses = (fallback.data ?? []).map((b) => ({
      ...(b as Omit<DashboardBusiness, "tags">),
      tags: [] as string[],
    }));
  } else {
    businesses = (withTags.data ?? []) as DashboardBusiness[];
  }

  return (
    <DashboardClient
      initialTagsColumnMissing={tagsColumnMissing}
      initialBusinesses={businesses}
      userEmail={session.user.email ?? ""}
    />
  );
}

export type DashboardBusiness = {
  id: string;
  name: string;
  slug: string;
  google_place_id: string | null;
  location: string | null;
  tags: string[];
  review_source: string;
  created_at: string;
  voc_reports: {
    id: string;
    period: string;
    status: string;
    public_slug: string;
    review_count: number;
    generated_at: string | null;
    created_at: string;
    updated_at: string;
    error_message: string | null;
  }[];
};
