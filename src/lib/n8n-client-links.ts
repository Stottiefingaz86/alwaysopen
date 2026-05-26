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

export type ClientWorkflowBinding = {
  clientId: string;
  clientName: string;
  workflowId: string;
  roles: ("booking" | "cancel" | "voc")[];
  editorUrl: string;
};

/** One entry per workflow ID (merges booking/cancel/voc when same URL used twice). */
export function buildClientWorkflowBindings(
  clients: {
    id: string;
    business_name: string;
    client_integrations: IntegrationRow | IntegrationRow[] | null;
  }[]
) {
  const byWorkflowId = new Map<string, ClientWorkflowBinding>();

  for (const client of clients) {
    const integration = Array.isArray(client.client_integrations)
      ? client.client_integrations[0]
      : client.client_integrations;
    for (const link of linksFromIntegration(client.id, client.business_name, integration)) {
      const existing = byWorkflowId.get(link.workflowId);
      if (existing) {
        if (!existing.roles.includes(link.workflowType)) {
          existing.roles.push(link.workflowType);
        }
        continue;
      }
      byWorkflowId.set(link.workflowId, {
        clientId: link.clientId,
        clientName: link.clientName,
        workflowId: link.workflowId,
        roles: [link.workflowType],
        editorUrl: link.editorUrl,
      });
    }
  }

  return byWorkflowId;
}
