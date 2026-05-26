import { SettingsClient } from "@/app/admin/settings/settings-client";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { redirect } from "next/navigation";

function envPresent(name: string) {
  const v = process.env[name];
  return Boolean(v?.trim());
}

export default async function AdminSettingsPage() {
  const session = await requireAdminSession();
  if (!session.ok) redirect("/login");

  const connections = [
    {
      name: "Supabase",
      ok: envPresent("NEXT_PUBLIC_SUPABASE_URL") && envPresent("SUPABASE_SERVICE_ROLE_KEY"),
      env: "NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY",
    },
    {
      name: "ElevenLabs",
      ok: envPresent("ELEVENLABS_API_KEY"),
      env: "ELEVENLABS_API_KEY",
    },
    {
      name: "Stripe",
      ok: envPresent("STRIPE_SECRET_KEY"),
      env: "STRIPE_SECRET_KEY",
    },
    {
      name: "Twilio",
      ok: envPresent("TWILIO_ACCOUNT_SID") && envPresent("TWILIO_AUTH_TOKEN"),
      env: "TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN",
    },
    {
      name: "n8n",
      ok: envPresent("N8N_WEBHOOK_BASE_URL") || envPresent("WORKFLOW_LOG_SECRET"),
      env: "N8N_WEBHOOK_BASE_URL or WORKFLOW_LOG_SECRET",
    },
    {
      name: "Resend",
      ok: envPresent("RESEND_API_KEY"),
      env: "RESEND_API_KEY",
    },
  ];

  return <SettingsClient userEmail={session.user.email ?? ""} connections={connections} />;
}
