#!/usr/bin/env bash
set -euo pipefail

HOST="127.0.0.1"
PORT="4173"
BASE_URL="http://${HOST}:${PORT}"
SERVER_LOG="${TMPDIR:-/tmp}/vitalis-e2e.log"
OUTPUT_DIR="${GITHUB_WORKSPACE:-.}/artifacts/mobile-smoke"
mkdir -p "$OUTPUT_DIR"

bun run build:check >/dev/null
bun run dev --host "$HOST" --port "$PORT" >"$SERVER_LOG" 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT

for _ in {1..30}; do
  if curl --silent --fail "$BASE_URL/" >/dev/null; then
    break
  fi
  sleep 1
done

if ! curl --silent --fail "$BASE_URL/" >/dev/null; then
  cat "$SERVER_LOG"
  exit 1
fi

for viewport in "320,720" "360,800" "390,844" "412,915" "768,1024" "1024,768" "1280,800" "844,390"; do
  output="$OUTPUT_DIR/vitalis-mobile-${viewport//,/-}.png"
  bunx playwright screenshot \
    --browser=chromium \
    --viewport-size="$viewport" \
    --wait-for-selector="#main" \
    "$BASE_URL/?__vitalis_smoke=1" \
    "$output" >/dev/null
  test -s "$output"
done

for route in "/flash" "/scan" "/reel" "/radar" "/talents" "/espace"; do
  output="$OUTPUT_DIR/vitalis-route-${route#/}.png"
  selector="#main"
  if [[ "$route" == "/reel" ]]; then
    selector=".reel-proximity"
  fi
  bunx playwright screenshot \
    --browser=chromium \
    --viewport-size="390,844" \
    --wait-for-selector="$selector" \
    "$BASE_URL$route?__vitalis_smoke=1" \
    "$output" >/dev/null
  test -s "$output"
done

echo "Mobile E2E smoke validation passed for eight target viewports including landscape and six engine/profile routes."
