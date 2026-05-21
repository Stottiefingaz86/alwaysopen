import { isPublicSupabaseConfigured } from "@/lib/supabase/public-env";

/** True when Supabase public env vars are set (build or Vercel runtime for API routes). */
export function isSupabaseConfigured(): boolean {
  return isPublicSupabaseConfigured();
}
