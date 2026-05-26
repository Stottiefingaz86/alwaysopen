"use client";

import { Logo } from "@/components/landing/logo";
import { cn } from "@/lib/utils";
import { BarChart3, FileBarChart, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const cards = [
  {
    href: "/dashboard",
    title: "VoC dashboard",
    description: "Generate and publish Voice of Customer reports, case studies, and business profiles.",
    icon: FileBarChart,
    accent: "border-google-green/30 bg-google-green/5 hover:border-google-green/50",
  },
  {
    href: "/admin",
    title: "Backoffice",
    description: "Manage clients, integrations, workflows, usage, payments, and onboarding.",
    icon: BarChart3,
    accent: "border-google-blue/30 bg-pastel-blue/50 hover:border-google-blue/50",
  },
];

export function AdminStartClient({ userEmail }: { userEmail: string }) {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col bg-google-gray-50">
      <header className="border-b border-google-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Logo />
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-2 text-sm text-google-gray-600 hover:text-foreground"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-6 py-12">
        <p className="text-sm font-medium uppercase tracking-wider text-google-blue">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight text-foreground">
          What would you like to open?
        </h1>
        <p className="mt-2 text-google-gray-500">
          Signed in as {userEmail}. Choose VoC tools or the operations backoffice.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className={cn(
                "group rounded-2xl border-2 p-6 shadow-google transition-all hover:shadow-google-elevated",
                card.accent
              )}
            >
              <card.icon className="size-8 text-google-blue" strokeWidth={1.5} />
              <h2 className="mt-4 text-xl font-medium text-foreground">{card.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-google-gray-600">
                {card.description}
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-google-blue group-hover:underline">
                Open →
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
