"use client";

import {
  createClientWithConfig,
  getSupabaseBrowserConfig,
  LOGIN_EMAIL_KEY,
  LOGIN_REMEMBER_KEY,
} from "@/lib/supabase/client";
import { withTimeout } from "@/lib/supabase/browser-config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const fieldClass = cn(
  "mt-1.5 w-full rounded-lg border border-google-gray-200 bg-white px-3 py-2 text-sm",
  "outline-none focus-visible:border-google-blue focus-visible:ring-2 focus-visible:ring-google-blue/20"
);

const SIGN_IN_TIMEOUT_MS = 20_000;

function readRememberPreference(): boolean {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(LOGIN_REMEMBER_KEY);
  return stored !== "false";
}

function readSavedEmail(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(LOGIN_EMAIL_KEY) ?? "";
}

export function LoginForm({ supabaseReady = true }: { supabaseReady?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [configLoading, setConfigLoading] = useState(true);
  const [clientConfig, setClientConfig] = useState<Awaited<
    ReturnType<typeof getSupabaseBrowserConfig>
  >>(null);

  useEffect(() => {
    setRememberMe(readRememberPreference());
    setEmail(readSavedEmail());
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setConfigLoading(true);
      const cfg = await getSupabaseBrowserConfig();
      if (cancelled) return;
      setClientConfig(cfg);
      setConfigLoading(false);
      if (!cfg) {
        setError(
          "Supabase is not configured on this server. In Vercel → Environment Variables (Production), set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then redeploy."
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const isBusy = configLoading || loading || redirecting;
  const canSubmit =
    Boolean(clientConfig) && !isBusy && supabaseReady;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cfg = clientConfig ?? (await getSupabaseBrowserConfig());
    if (!cfg) {
      setError(
        "Cannot reach Supabase. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel (Production), save, then redeploy."
      );
      return;
    }

    setLoading(true);
    let navigatingAway = false;
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(LOGIN_REMEMBER_KEY, rememberMe ? "true" : "false");
        if (rememberMe) {
          localStorage.setItem(LOGIN_EMAIL_KEY, email);
        } else {
          localStorage.removeItem(LOGIN_EMAIL_KEY);
        }
      }

      const supabase = createClientWithConfig(cfg, { rememberMe });

      const { error: signInError } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        SIGN_IN_TIMEOUT_MS,
        "Sign-in timed out. Check Vercel env vars (NEXT_PUBLIC_SUPABASE_*) and redeploy."
      );

      if (signInError) {
        setError(signInError.message);
        return;
      }

      const { data: allowed, error: adminError } = await supabase.rpc("is_admin");

      if (adminError) {
        setError(
          adminError.message.includes("Failed to fetch")
            ? "Could not reach Supabase. Check environment variables in Vercel."
            : adminError.message
        );
        await supabase.auth.signOut();
        return;
      }
      if (!allowed) {
        await supabase.auth.signOut();
        setError("This account is not authorised for admin access.");
        return;
      }

      navigatingAway = true;
      setRedirecting(true);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Sign-in failed. Please try again.";
      setError(message);
    } finally {
      if (!navigatingAway) {
        setLoading(false);
        setRedirecting(false);
      }
    }
  }

  const buttonLabel = redirecting
    ? "Opening dashboard…"
    : loading
      ? "Signing in…"
      : configLoading
        ? "Preparing…"
        : "Sign in";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={fieldClass}
          autoComplete="email"
          required
          disabled={isBusy}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="password"
          type="password"
          className={fieldClass}
          autoComplete="current-password"
          required
          disabled={isBusy}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <label className="flex cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          checked={rememberMe}
          disabled={isBusy}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="size-4 rounded border-google-gray-300 text-google-blue focus-visible:ring-2 focus-visible:ring-google-blue/30 disabled:opacity-50"
        />
        <span className="text-sm text-google-gray-600">
          Remember me for 30 days
        </span>
      </label>
      {error ? (
        <p className="text-sm text-google-red" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="submit"
        size="lg"
        className={cn(
          "h-11 w-full gap-2.5 rounded-full text-sm font-medium shadow-google transition-all",
          isBusy && "bg-google-blue/90"
        )}
        disabled={!canSubmit}
        aria-busy={isBusy}
        aria-live="polite"
      >
        {isBusy ? (
          <Loader2
            className="size-4 shrink-0 animate-spin"
            aria-hidden
          />
        ) : null}
        <span>{buttonLabel}</span>
      </Button>
    </form>
  );
}
