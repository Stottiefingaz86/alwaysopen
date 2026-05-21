import { getPublicSupabaseEnv } from "@/lib/supabase/public-env";
import { NextResponse } from "next/server";

/** Runtime Supabase URL + anon key for the browser (fixes prod when NEXT_PUBLIC was missing at build). */
export async function GET() {
  const env = getPublicSupabaseEnv();
  if (!env) {
    return NextResponse.json(
      {
        configured: false,
        error:
          "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel (Production), then redeploy or wait for a new deployment.",
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    configured: true,
    url: env.url,
    anonKey: env.anonKey,
  });
}
