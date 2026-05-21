import type { Metadata } from "next";
import { LoginForm } from "@/app/login/login-form";
import { Logo } from "@/components/landing/logo";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  const supabaseReady = isSupabaseConfigured();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-google-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-google-gray-200 bg-white p-8 shadow-google-card">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-center text-lg font-medium text-foreground">VoC admin</h1>
        <p className="mt-2 text-center text-sm text-google-gray-500">
          Sign in to manage businesses and client reports.
        </p>
        {!supabaseReady ? (
          <div
            className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
            role="alert"
          >
            <p className="font-medium">Sign-in is not configured on this deployment</p>
            <p className="mt-1.5 text-amber-900/90">
              Add{" "}
              <code className="rounded bg-amber-100/80 px-1">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
              and{" "}
              <code className="rounded bg-amber-100/80 px-1">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </code>{" "}
              in Vercel → Project → Settings → Environment Variables (Production), then{" "}
              <strong>redeploy</strong>. After deploy, login loads keys from the server
              automatically.
            </p>
          </div>
        ) : null}
        <div className="mt-8">
          <LoginForm supabaseReady={supabaseReady} />
        </div>
      </div>
    </div>
  );
}
