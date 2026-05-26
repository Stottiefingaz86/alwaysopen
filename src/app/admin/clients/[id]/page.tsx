import { ClientDetailClient } from "@/app/admin/clients/[id]/client-detail-client";
import { currentMonthKey, getBackofficeDb } from "@/lib/backoffice/db";
import { DEFAULT_ONBOARDING, type UsageLog } from "@/lib/backoffice/types";
import { getN8nWorkflowNameMap } from "@/lib/n8n-api";
import { syncElevenLabsUsageForClient } from "@/lib/elevenlabs-usage";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { notFound, redirect } from "next/navigation";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAdminSession();
  if (!session.ok) redirect("/login");

  const { id } = await params;
  const db = getBackofficeDb();
  const month = currentMonthKey();
  const elevenLabsConfigured = Boolean(process.env.ELEVENLABS_API_KEY?.trim());

  let usageSyncError: string | null = null;
  if (elevenLabsConfigured) {
    const sync = await syncElevenLabsUsageForClient(id);
    if (!sync.ok) usageSyncError = sync.error;
  }

  const { data: client, error } = await db
    .from("clients")
    .select(
      `
      *,
      client_integrations (*),
      client_credentials (*),
      client_payments (*),
      usage_logs (*),
      workflow_health (*),
      client_voc_reports (*)
    `
    )
    .eq("id", id)
    .single();

  if (error || !client) notFound();

  const usageLogs = (client.usage_logs ?? []) as UsageLog[];
  const usage = usageLogs.find((u) => u.month === month) ?? usageLogs[0] ?? null;

  const onboarding = {
    ...DEFAULT_ONBOARDING,
    ...((client.onboarding_checklist as object) ?? {}),
  };

  return (
    <ClientDetailClient
      userEmail={session.user.email ?? ""}
      client={{ ...client, onboarding_checklist: onboarding }}
      usage={usage}
      integrations={
        Array.isArray(client.client_integrations)
          ? client.client_integrations[0]
          : client.client_integrations
      }
      credentials={client.client_credentials ?? []}
      payments={client.client_payments ?? []}
      workflows={client.workflow_health ?? []}
      reports={client.client_voc_reports ?? []}
      elevenLabsConfigured={elevenLabsConfigured}
      usageSyncError={usageSyncError}
      n8nWorkflowNames={n8nWorkflowNames}
    />
  );
}
