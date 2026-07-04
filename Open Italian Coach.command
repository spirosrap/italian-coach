#!/bin/zsh
set -euo pipefail

cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required to run Italian Coach."
  exit 1
fi

PORT="${PORT:-4179}"
URL="http://127.0.0.1:${PORT}"

if ! curl -fsS "${URL}" >/dev/null 2>&1; then
  node scripts/server.mjs >/tmp/italian-coach.log 2>&1 &
  sleep 0.8
fi

open "${URL}"
