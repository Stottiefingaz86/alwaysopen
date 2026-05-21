/** Read Supabase public credentials (build-time or Vercel runtime). */
export function getPublicSupabaseEnv():
  | { url: string; anonKey: string }
  | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url?.startsWith("https://") || !anonKey || anonKey.length < 20) {
    return null;
  }
  return { url, anonKey };
}

export function isPublicSupabaseConfigured(): boolean {
  return getPublicSupabaseEnv() !== null;
}
