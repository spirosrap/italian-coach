import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const www = join(projectRoot, "www");

const entries = [
  "index.html",
  "styles.css",
  "app.js",
  "manifest.webmanifest",
  "sw.js",
  "assets"
];

await rm(www, { recursive: true, force: true });
await mkdir(www, { recursive: true });

for (const entry of entries) {
  await cp(join(projectRoot, entry), join(www, entry), { recursive: true });
}

const syncServer = String(process.env.ITALIAN_COACH_SYNC_SERVER || "").trim().replace(/\/+$/, "");
if (syncServer) {
  const indexPath = join(www, "index.html");
  const html = await readFile(indexPath, "utf8");
  await writeFile(
    indexPath,
    html.replace(
      /<meta name="italian-coach-sync-server" content="[^"]*" \/>/,
      `<meta name="italian-coach-sync-server" content="${escapeHtml(syncServer)}" />`
    )
  );
  console.log(`Configured default sync server: ${syncServer}`);
}

console.log(`Prepared Android web bundle at ${www}`);

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
