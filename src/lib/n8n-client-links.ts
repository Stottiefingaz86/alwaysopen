import { parseN8nWorkflowId } from "@/lib/n8n-url";

export type N8nClientWorkflowLink = {
  clientId: string;
  clientName: string;
  workflowId: string;
  workflowType: "booking" | "cancel" | "voc";
  editorUrl: string;
};

type IntegrationRow = {
  n8n_booking_workflow_url: string | null;
  n8n_cancel_workflow_url: string | null;
  n8n_voc_workflow_url: string | null;
};

export function linksFromIntegration(
  clientId: string,
  clientName: string,
  integration: IntegrationRow | null | undefined
): N8nClientWorkflowLink[] {
  if (!integration) return [];

  const pairs: { type: N8nClientWorkflowLink["workflowType"]; url: string | null }[] = [
    { type: "booking", url: integration.n8n_booking_workflow_url },
    { type: "cancel", url: integration.n8n_cancel_workflow_url },
    { type: "voc", url: integration.n8n_voc_workflow_url },
  ];

  const links: N8nClientWorkflowLink[] = [];
  for (const { type, url } of pairs) {
    if (!url?.trim()) continue;
    const workflowId = parseN8nWorkflowId(url);
    if (!workflowId) continue;
    links.push({
      clientId,
      clientName,
      workflowId,
      workflowType: type,
      editorUrl: url.trim(),
    });
  }
  return links;
}
