import { createClient } from "@/lib/supabase/server";

export async function requireAdminSession() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.email) {
    return { ok: false as const, supabase, user: null };
  }

  const { data: allowed } = await supabase.rpc("is_admin");
  if (!allowed) {
    return { ok: false as const, supabase, user: null };
  }

  return { ok: true as const, supabase, user };
}
