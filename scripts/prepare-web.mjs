import { cp, mkdir, rm } from "node:fs/promises";
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

console.log(`Prepared Android web bundle at ${www}`);
