#!/usr/bin/env node
/**
 * Deploy generate-voc-report via Supabase Management API.
 * Requires: SUPABASE_ACCESS_TOKEN (https://supabase.com/dashboard/account/tokens)
 */
import { readFileSync, createReadStream } from "node:fs";
import { join } from "node:path";

const PROJECT_REF = "aierpcwlkmvyojnaksvr";
const TOKEN = process.env.SUPABASE_ACCESS_TOKEN || process.env.SB_ACCESS_TOKEN;

if (!TOKEN) {
  console.error(
    "Missing SUPABASE_ACCESS_TOKEN. Create one at https://supabase.com/dashboard/account/tokens then run:\n" +
      "  SUPABASE_ACCESS_TOKEN=sbp_xxx node scripts/deploy-edge-full.mjs"
  );
  process.exit(1);
}

const payload = JSON.parse(
  readFileSync(join(process.cwd(), ".cursor-mcp-deploy.json"), "utf8")
);

const boundary = `----form${Date.now()}`;
const metadata = JSON.stringify({
  entrypoint_path: payload.entrypoint_path,
  import_map_path: payload.import_map_path,
  name: payload.name,
  verify_jwt: payload.verify_jwt,
});

const parts = [];
parts.push(
  `--${boundary}\r\nContent-Disposition: form-data; name="metadata"\r\n\r\n${metadata}\r\n`
);
for (const f of payload.files) {
  parts.push(
    `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${f.name}"\r\nContent-Type: text/plain\r\n\r\n${f.content}\r\n`
  );
}
parts.push(`--${boundary}--\r\n`);
const body = parts.join("");

const url = `https://api.supabase.com/v1/projects/${PROJECT_REF}/functions/deploy?slug=${payload.name}`;
console.log(`Deploying ${payload.name} (${payload.files.length} files, ${body.length} bytes)...`);

const res = await fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": `multipart/form-data; boundary=${boundary}`,
  },
  body,
});

const text = await res.text();
if (!res.ok) {
  console.error(`Deploy failed (${res.status}):`, text.slice(0, 800));
  process.exit(1);
}
console.log("Deploy OK:", text.slice(0, 500));
