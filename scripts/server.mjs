import { createServer } from "node:http";
import { networkInterfaces } from "node:os";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = normalize(join(dirname(fileURLToPath(import.meta.url)), ".."));
const port = Number(process.env.PORT || 4179);
const progressPath = process.env.ITALIAN_COACH_PROGRESS || join(root, "data", "progress.json");

const types = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".webmanifest", "application/manifest+json; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".svg", "image/svg+xml; charset=utf-8"]
]);

function localUrls() {
  const urls = [`http://127.0.0.1:${port}`];
  Object.values(networkInterfaces()).flat().forEach((address) => {
    if (!address || address.family !== "IPv4" || address.internal) return;
    urls.push(`http://${address.address}:${port}`);
  });
  return urls;
}

function resolvePath(url) {
  const cleanUrl = decodeURIComponent(url.split("?")[0]);
  const requested = cleanUrl === "/" ? "/index.html" : cleanUrl;
  const filePath = normalize(join(root, requested));
  if (!filePath.startsWith(root)) return null;
  return filePath;
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,PUT,OPTIONS",
    "access-control-allow-headers": "content-type",
    "cache-control": "no-cache",
    "content-type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(payload));
}

async function readJsonBody(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 2_000_000) throw new Error("Request body too large");
  }
  return body ? JSON.parse(body) : {};
}

async function readProgressFile() {
  try {
    return JSON.parse(await readFile(progressPath, "utf8"));
  } catch {
    return {
      version: 1,
      updatedAt: 0,
      updatedBy: null,
      state: null
    };
  }
}

async function writeProgressFile(payload) {
  await mkdir(dirname(progressPath), { recursive: true });
  const tempPath = `${progressPath}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(payload, null, 2)}\n`);
  await rename(tempPath, progressPath);
}

function mergeProgressRow(left = {}, right = {}) {
  return {
    attempts: Math.max(Number(left.attempts) || 0, Number(right.attempts) || 0),
    correct: Math.max(Number(left.correct) || 0, Number(right.correct) || 0),
    strength: Math.max(Number(left.strength) || 0, Number(right.strength) || 0),
    due: Math.max(Number(left.due) || 0, Number(right.due) || 0),
    lastGrade: Number(right.due) >= Number(left.due) ? right.lastGrade || left.lastGrade || null : left.lastGrade || right.lastGrade || null
  };
}

function mergeStates(base = {}, incoming = {}) {
  const merged = {
    settings: Number(incoming?.meta?.updatedAt) >= Number(base?.meta?.updatedAt)
      ? { ...(base.settings || {}), ...(incoming.settings || {}) }
      : { ...(incoming.settings || {}), ...(base.settings || {}) },
    progress: {},
    history: [],
    daily: { ...(base.daily || {}) },
    meta: {
      ...(base.meta || {}),
      ...(incoming.meta || {}),
      updatedAt: Math.max(Number(base?.meta?.updatedAt) || 0, Number(incoming?.meta?.updatedAt) || 0)
    }
  };

  Object.entries(incoming.daily || {}).forEach(([day, count]) => {
    merged.daily[day] = Math.max(Number(merged.daily[day]) || 0, Number(count) || 0);
  });

  new Set([...Object.keys(base.progress || {}), ...Object.keys(incoming.progress || {})]).forEach((id) => {
    merged.progress[id] = mergeProgressRow(base.progress?.[id], incoming.progress?.[id]);
  });

  const seen = new Set();
  [...(incoming.history || []), ...(base.history || [])]
    .filter((row) => row && row.id && row.at)
    .sort((a, b) => Number(b.at) - Number(a.at))
    .forEach((row) => {
      const key = `${row.id}:${row.at}:${row.answer}`;
      if (seen.has(key) || merged.history.length >= 20) return;
      seen.add(key);
      merged.history.push(row);
    });

  return merged;
}

async function handleApi(request, response, pathname) {
  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return true;
  }

  if (pathname === "/api/health" && request.method === "GET") {
    sendJson(response, 200, { ok: true, urls: localUrls(), progressPath });
    return true;
  }

  if (pathname === "/api/progress" && request.method === "GET") {
    sendJson(response, 200, await readProgressFile());
    return true;
  }

  if (pathname === "/api/progress" && (request.method === "POST" || request.method === "PUT")) {
    try {
      const body = await readJsonBody(request);
      if (!body || typeof body.state !== "object") {
        sendJson(response, 400, { ok: false, error: "Missing state object" });
        return true;
      }

      const current = await readProgressFile();
      const mergedState = mergeStates(current.state || {}, body.state);
      const payload = {
        version: 1,
        updatedAt: Date.now(),
        updatedBy: body.clientId || "unknown-client",
        state: mergedState
      };
      await writeProgressFile(payload);
      sendJson(response, 200, { ok: true, ...payload });
    } catch (error) {
      sendJson(response, 400, { ok: false, error: error.message });
    }
    return true;
  }

  return false;
}

const server = createServer(async (request, response) => {
  const parsedUrl = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  if (parsedUrl.pathname.startsWith("/api/") && await handleApi(request, response, parsedUrl.pathname)) {
    return;
  }

  const filePath = resolvePath(request.url || "/");
  if (!filePath) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const data = await readFile(filePath);
    response.writeHead(200, {
      "content-type": types.get(extname(filePath)) || "application/octet-stream",
      "cache-control": "no-cache"
    });
    response.end(data);
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log("Italian Coach running at:");
  localUrls().forEach((url) => console.log(`  ${url}`));
  console.log(`Progress sync file: ${progressPath}`);
});
