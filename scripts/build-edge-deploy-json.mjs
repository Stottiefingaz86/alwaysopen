#!/usr/bin/env node
/** Builds .cursor-mcp-deploy.json for Supabase MCP deploy_edge_function */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), "supabase/functions");
const pairs = [
  ["index.ts", "generate-voc-report/index.ts"],
  ["deno.json", "generate-voc-report/deno.json"],
  ["../_shared/voc-constants.ts", "_shared/voc-constants.ts"],
  ["../_shared/voc-ai-prompt.ts", "_shared/voc-ai-prompt.ts"],
  ["../_shared/review-metrics.ts", "_shared/review-metrics.ts"],
  ["../_shared/area-benchmark.ts", "_shared/area-benchmark.ts"],
  ["../_shared/theme-match.ts", "_shared/theme-match.ts"],
];

const files = pairs.map(([name, rel]) => ({
  name,
  content: readFileSync(join(root, rel), "utf8"),
}));

const payload = {
  name: "generate-voc-report",
  entrypoint_path: "index.ts",
  import_map_path: "deno.json",
  verify_jwt: false,
  files,
};

const out = join(process.cwd(), ".cursor-mcp-deploy.json");
writeFileSync(out, JSON.stringify(payload));
console.log(`Wrote ${out} (${JSON.stringify(payload).length} bytes, ${files.length} files)`);
