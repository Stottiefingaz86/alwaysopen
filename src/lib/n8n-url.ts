/** Editor link from instance base + workflow id (e.g. mzpH8ceGar3qjnuN). */
export function n8nEditorUrl(instanceBase: string, workflowId: string) {
  return `${instanceBase.replace(/\/$/, "")}/workflow/${workflowId}`;
}

/** Parse id from pasted editor URL or raw id. */
export function parseN8nWorkflowId(urlOrId: string): string | null {
  const raw = urlOrId.trim();
  if (!raw) return null;
  if (/^[a-zA-Z0-9]+$/.test(raw) && raw.length >= 8) return raw;
  const m = raw.match(/\/workflow\/([a-zA-Z0-9]+)/);
  return m?.[1] ?? null;
}
