import { WorkflowsClient } from "@/app/admin/workflows/workflows-client";
import { getN8nConfig, getN8nWorkflowHealthOverview, syncN8nWorkflowHealthToDb } from "@/lib/n8n-api";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { redirect } from "next/navigation";

export default async function AdminWorkflowsPage() {
  const session = await requireAdminSession();
  if (!session.ok) redirect("/login");

  const { configured } = getN8nConfig();
  let n8nError: string | null = null;
  let syncNote: string | null = null;

  if (configured) {
    const sync = await syncN8nWorkflowHealthToDb();
    if (!sync.ok) {
      n8nError = sync.error;
    } else {
      syncNote = `Synced ${sync.synced} client-linked workflow(s) from n8n.`;
    }
  }

  const { rows: n8nRows, error: overviewError } = configured
    ? await getN8nWorkflowHealthOverview()
    : { rows: [], error: undefined };

  if (overviewError) n8nError = overviewError;

  return (
    <WorkflowsClient
      userEmail={session.user.email ?? ""}
      workflows={n8nRows}
      n8nConfigured={configured}
      n8nError={n8nError}
      syncNote={syncNote}
    />
  );
}
